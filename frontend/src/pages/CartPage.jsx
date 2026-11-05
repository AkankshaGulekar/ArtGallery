import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCart, removeFromCart, updateQuantity } from '../features/cart/cartSlice'

function rupees(amount) {
  return Number(amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
}

export default function CartPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const { items, status, error } = useSelector((state) => state.cart)

  useEffect(() => {
    if (user) dispatch(fetchCart())
  }, [dispatch, user])

  if (!user) {
    return (
      <div>
        <h1>Your cart</h1>
        <p>
          Please <Link to="/login">log in</Link> to see your cart.
        </p>
      </div>
    )
  }

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

  return (
    <div>
      <h1>Your cart</h1>

      {status === 'failed' && <p className="error">{error}</p>}
      {status === 'succeeded' && items.length === 0 && (
        <p>
          Your cart is empty. <Link to="/shop">Go to the shop</Link>
        </p>
      )}

      {items.map((item) => (
        <div key={item.id} className="cart-line">
          <div className="cart-info">
            <Link to={`/paintings/${item.paintingId}`}>{item.title}</Link>
            <span>{item.category}</span>
          </div>

          <div className="cart-quantity">
            {item.category === 'Originals' ? (
              <span>Qty 1</span>
            ) : (
              <>
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({ paintingId: item.paintingId, quantity: item.quantity - 1 })
                    )
                  }
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({ paintingId: item.paintingId, quantity: item.quantity + 1 })
                    )
                  }
                >
                  +
                </button>
              </>
            )}
          </div>

          <div className="cart-price">{rupees(Number(item.price) * item.quantity)}</div>

          <button onClick={() => dispatch(removeFromCart(item.paintingId))}>Remove</button>
        </div>
      ))}

      {items.length > 0 && (
        <div className="cart-total">
          <strong>Total: {rupees(total)}</strong>
        </div>
      )}
    </div>
  )
}