import { configureStore } from '@reduxjs/toolkit'
import paintingsReducer from '../features/paintings/paintingsSlice'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'

export const store = configureStore({
  reducer: {
    paintings: paintingsReducer,
    auth: authReducer,
    cart: cartReducer,
  },
})

let lastToken = store.getState().auth.token

store.subscribe(() => {
  const { user, token } = store.getState().auth
  if (token === lastToken) return
  lastToken = token

    try {
    if (token) {
      localStorage.setItem('auth', JSON.stringify({ user, token }))
    } else {
      localStorage.removeItem('auth')
    }
  } catch (error) {
    console.error('Could not save login:', error.name, error.message)
  }
})