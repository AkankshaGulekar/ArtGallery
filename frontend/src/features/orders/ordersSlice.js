import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from '../auth/authSlice'

const API_URL = 'http://localhost:8080/api/orders'

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (details, { getState, rejectWithValue }) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getState().auth.token}`,
      },
      body: JSON.stringify(details),
    })
    if (response.status === 400)
      return rejectWithValue('Check your address and phone (10 digits), and that your cart is not empty')
    if (response.status === 409)
      return rejectWithValue('A painting in your cart was just sold. Remove it and try again')
    if (!response.ok) return rejectWithValue('Could not place the order')
    return response.json()
  }
)

export const fetchOrders = createAsyncThunk('orders/fetch', async (_, { getState }) => {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${getState().auth.token}` },
  })
  if (!response.ok) throw new Error('Could not load your orders')
  return response.json()
})

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [], lastOrder: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.items = []
        state.lastOrder = null
        state.status = 'idle'
        state.error = null
      })
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.lastOrder = action.payload
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Could not reach the server'
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default ordersSlice.reducer