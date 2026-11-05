import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'
import { logout } from '../auth/authSlice'

const API_URL = 'http://localhost:8080/api/cart'

async function request(token, path = '', method = 'GET', body) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (response.status === 401 || response.status === 403) throw new Error('Please log in')
  if (response.status === 409) throw new Error('Already in your cart, or sold')
  if (!response.ok) throw new Error('Something went wrong')
  return response.json()
}

export const fetchCart = createAsyncThunk('cart/fetch', (_, { getState }) =>
  request(getState().auth.token)
)

export const addToCart = createAsyncThunk('cart/add', (paintingId, { getState }) =>
  request(getState().auth.token, `/${paintingId}`, 'POST')
)

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  ({ paintingId, quantity }, { getState }) =>
    request(getState().auth.token, `/${paintingId}`, 'PUT', { quantity })
)

export const removeFromCart = createAsyncThunk('cart/remove', (paintingId, { getState }) =>
  request(getState().auth.token, `/${paintingId}`, 'DELETE')
)

const cartActions = [fetchCart, addToCart, updateQuantity, removeFromCart]

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.items = []
        state.status = 'idle'
        state.error = null
      })
      .addMatcher(isPending(...cartActions), (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addMatcher(isFulfilled(...cartActions), (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addMatcher(isRejected(...cartActions), (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default cartSlice.reducer