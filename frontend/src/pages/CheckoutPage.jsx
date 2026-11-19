import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCart } from '../features/cart/cartSlice'
import { placeOrder } from '../features/orders/ordersSlice'

const COUNTRY_CODES =
  'AF AX AL DZ AS AD AO AI AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BA BW BR BN BG BF BI ' +
  'KH CM CA CV KY CF TD CL CN CO KM CG CD CK CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK ' +
  'FO FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT VA HN HK HU IS IN ID IR IQ IE ' +
  'IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR ' +
  'MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY ' +
  'PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA ' +
  'SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UY UZ VU VE VN ' +
  'VG VI WF EH YE ZM ZW'

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
const COUNTRIES = COUNTRY_CODES.split(' ')
  .map((code) => regionNames.of(code))
  .sort((a, b) => a.localeCompare(b))

function rupees(amount) {
  return Number(amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
}

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const { items } = useSelector((state) => state.cart)
  const { status, error } = useSelector((state) => state.orders)
  const [form, setForm] = useState({
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  })
  const [placed, setPlaced] = useState(null)

  useEffect(() => {
    if (user) dispatch(fetchCart())
  }, [dispatch, user])

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const result = await dispatch(
      placeOrder({
        ...form,
        state: form.state.trim() || undefined,
        phone: form.phone.replace(/\s/g, ''),
      })
    )
    if (placeOrder.fulfilled.match(result)) {
      setPlaced(result.payload)
      dispatch(fetchCart())
    }
  }

  if (!user) {
    return (
      <div>
        <h1>Checkout</h1>
        <p>
          Please <Link to="/login">log in</Link> to place an order.
        </p>
      </div>
    )
  }

  if (placed) {
    return (
      <div>
        <h1>Thank you!</h1>
        <p>
          Your order #{placed.id} has been placed. Total: {rupees(placed.total)}
        </p>
        <Link to="/shop" className="button">
          Continue shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div>
        <h1>Checkout</h1>
        <p>
          Your cart is empty. <Link to="/shop">Go to the shop</Link>
        </p>
      </div>
    )
  }

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

  return (
    <div>
      <h1>Checkout</h1>

      {items.map((item) => (
        <div key={item.id} className="cart-line">
          <div className="cart-info">
            <span>{item.title}</span>
            <span>Qty {item.quantity}</span>
          </div>
          <div className="cart-price">{rupees(Number(item.price) * item.quantity)}</div>
        </div>
      ))}
      <div className="cart-total">
        <strong>Total: {rupees(total)}</strong>
      </div>

      <div className="auth-page">
        <h2>Delivery details</h2>
        <form onSubmit={handleSubmit}>
          <select value={form.country} onChange={update('country')} required>
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Address (house, street, area)"
            value={form.addressLine}
            onChange={update('addressLine')}
            maxLength={300}
            required
          />
          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={update('city')}
            maxLength={100}
            required
          />
          <input
            type="text"
            placeholder="State / Region (optional)"
            value={form.state}
            onChange={update('state')}
            maxLength={100}
          />
          <input
            type="text"
            placeholder="Postal / ZIP code"
            value={form.postalCode}
            onChange={update('postalCode')}
            pattern="[A-Za-z0-9][A-Za-z0-9 \-]{2,10}"
            maxLength={11}
            required
          />
          <input
            type="tel"
            placeholder="Phone with country code, like +1 415 555 2671"
            value={form.phone}
            onChange={update('phone')}
            pattern="\+[0-9 ]{7,20}"
            required
          />
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Placing order...' : 'Place order'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}