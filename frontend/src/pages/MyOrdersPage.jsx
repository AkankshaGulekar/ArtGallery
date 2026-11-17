import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../features/orders/ordersSlice'

function rupees(amount) {
  return Number(amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
}

export default function MyOrdersPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const { items, status, error } = useSelector((state) => state.orders)

  useEffect(() => {
    if (user) dispatch(fetchOrders())
  }, [dispatch, user])

  if (!user) {
    return (
      <div>
        <h1>My orders</h1>
        <p>
          Please <Link to="/login">log in</Link> to see your orders.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1>My orders</h1>

      {status === 'failed' && <p className="error">{error}</p>}
      {status === 'succeeded' && items.length === 0 && (
        <p>
          You have no orders yet. <Link to="/shop">Go to the shop</Link>
        </p>
      )}

      {items.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-head">
            <strong>Order #{order.id}</strong>
            <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
            <span className="order-status">{order.status}</span>
          </div>

          {order.items.map((item) => (
            <div key={item.paintingId} className="order-line">
              <Link to={`/paintings/${item.paintingId}`}>{item.title}</Link>
              <span>
                {item.quantity} × {rupees(item.price)}
              </span>
            </div>
          ))}

          <p>Delivery: {order.shippingAddress}</p>
          <strong>Total: {rupees(order.total)}</strong>
        </div>
      ))}
    </div>
  )
}