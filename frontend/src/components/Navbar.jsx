import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import cartIcon from '../assets/cart-icon.png'
import { logout } from '../features/auth/authSlice'
import { fetchCart } from '../features/cart/cartSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const cartItems = useSelector((state) => state.cart.items)

  useEffect(() => {
    if (user) dispatch(fetchCart())
  }, [dispatch, user])

  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  function handleLogout() {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Art Gallery
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/cart" className="cart-link">
              <img src={cartIcon} alt="Cart" className="cart-icon" />
              <span>({count})</span>
            </Link>
            <span>Hi, {user.name}</span>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}