import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

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