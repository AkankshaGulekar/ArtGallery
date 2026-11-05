import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchPaintingById } from '../features/paintings/paintingsSlice'
import { addToCart, fetchCart, updateQuantity } from '../features/cart/cartSlice'

export default function PaintingDetailsPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selected, selectedStatus, selectedError } = useSelector(
    (state) => state.paintings
  )
  const user = useSelector((state) => state.auth.user)
  const cart = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(fetchPaintingById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (user) dispatch(fetchCart())
  }, [dispatch, user])

  const cartItem = selected && cart.items.find((i) => i.paintingId === selected.id)
  const isOriginal = selected?.category === 'Originals'
  const busy = cart.status === 'loading'

  function handleAdd() {
    if (!user) {
      navigate('/login')
      return
    }
    dispatch(addToCart(selected.id))
  }

  function changeQuantity(quantity) {
    dispatch(updateQuantity({ paintingId: selected.id, quantity }))
  }

  return (
    <div>
      <Link to="/shop">&larr; Back to shop</Link>

      {selectedStatus === 'loading' && <p>Loading...</p>}
      {selectedStatus === 'failed' && <p>Error: {selectedError}</p>}

      {selected && (
        <div className="painting-details">
          {selected.imageUrl ? (
            <img src={selected.imageUrl} alt={selected.title} />
          ) : (
            <div className="no-image">No image</div>
          )}
          <div>
            <h1>{selected.title}</h1>
            <p>{selected.category}</p>
            <p>{selected.description}</p>
            <h2>
              {Number(selected.price).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              })}
            </h2>

            {!selected.available ? (
              <p>Sold</p>
            ) : isOriginal && cartItem ? (
              <button className="add-button" disabled>
                In your cart
              </button>
            ) : !isOriginal && cartItem ? (
              <div className="quantity-picker">
                <button
                  onClick={() => changeQuantity(cartItem.quantity - 1)}
                  disabled={busy || cartItem.quantity <= 1}
                >
                  −
                </button>
                <span>{cartItem.quantity} in your cart</span>
                <button onClick={() => changeQuantity(cartItem.quantity + 1)} disabled={busy}>
                  +
                </button>
              </div>
            ) : (
              <button className="add-button" onClick={handleAdd} disabled={busy}>
                Add to cart
              </button>
            )}

            {cart.status === 'failed' && <p className="error">{cart.error}</p>}
          </div>
        </div>
      )}
    </div>
  )
}