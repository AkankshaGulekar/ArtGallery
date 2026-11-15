import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCart } from '../features/cart/cartSlice'
import { placeOrder } from '../features/orders/ordersSlice'

function rupees(amount) {
  return Number(amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
}

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const { items } = useSelector((state) => state.cart)
  const { status, error } = useSelector((state) => state.orders)
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [placed, setPlaced] = useState(null)

  useEffect(() => {
    if (user) dispatch(fetchCart())
  }, [dispatch, user])

  async function handleSubmit(e) {
    e.preventDefault()
    const result = await dispatch(placeOrder({ shippingAddress: address, phone }))
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
          <textarea
            placeholder="Delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            required
          />
          <input
            type="tel"
            placeholder="Phone (10 digits)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="\d{10}"
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