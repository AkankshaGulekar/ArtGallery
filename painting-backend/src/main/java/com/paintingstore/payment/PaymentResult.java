package com.paintingstore.payment;

public record PaymentResult(boolean success, String reference, String message) {
}