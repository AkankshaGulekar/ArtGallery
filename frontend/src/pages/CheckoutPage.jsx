import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCart } from '../features/cart/cartSlice'
import { placeOrder } from '../features/orders/ordersSlice'

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

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
    pincode: '',
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
    const result = await dispatch(placeOrder(form))
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
          <select value={form.state} onChange={update('state')} required>
            <option value="">Select state</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Pincode (6 digits)"
            value={form.pincode}
            onChange={update('pincode')}
            pattern="[1-9][0-9]{5}"
            maxLength={6}
            required
          />
          <input
            type="tel"
            placeholder="Phone (10 digits)"
            value={form.phone}
            onChange={update('phone')}
            pattern="[0-9]{10}"
            maxLength={10}
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