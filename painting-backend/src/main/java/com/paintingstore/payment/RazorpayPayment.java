package com.paintingstore.payment;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import com.paintingstore.entity.Order;

@Component
public class RazorpayPayment implements PaymentMethod {

    private static final String CURRENCY = "INR";

    private final String keyId;
    private final String keySecret;
    private final RestClient client;

    public RazorpayPayment(@Value("${razorpay.key-id}") String keyId,
                           @Value("${razorpay.key-secret}") String keySecret) {
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.client = RestClient.builder()
                .baseUrl("https://api.razorpay.com/v1")
                .defaultHeaders(headers -> headers.setBasicAuth(keyId, keySecret))
                .build();
    }

    @Override
    public PaymentType type() {
        return PaymentType.UPI;
    }

    @Override
    public PaymentSession start(Order order) {
        long paise = order.getTotal().movePointRight(2).longValueExact();
        Map<String, Object> body = Map.of(
                "amount", paise,
                "currency", CURRENCY,
                "receipt", "order_" + order.getId());

        try {
            Map<String, Object> response = client.post()
                    .uri("/orders")
                    .body(body)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() { });

            if (response == null || response.get("id") == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY, "Could not start the payment");
            }

            String providerOrderId = String.valueOf(response.get("id"));
            order.setProviderOrderId(providerOrderId);
            return new PaymentSession(
                    type(), order.getId(), providerOrderId, keyId, order.getTotal(), CURRENCY);
        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY, "Could not start the payment");
        }
    }

    @Override
    public String confirm(Order order, Map<String, String> data) {
        String razorpayOrderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");

        if (razorpayOrderId == null || paymentId == null || signature == null
                || !razorpayOrderId.equals(order.getProviderOrderId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payment details");
        }

        String expected = hmacSha256(razorpayOrderId + "|" + paymentId);
        boolean valid = MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                signature.getBytes(StandardCharsets.UTF_8));
        if (!valid) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Payment verification failed");
        }
        return paymentId;
    }

    private String hmacSha256(String message) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return HexFormat.of().formatHex(mac.doFinal(message.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException("Could not verify the payment", e);
        }
    }
}