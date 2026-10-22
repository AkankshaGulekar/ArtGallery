import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API_URL = 'http://localhost:8080/api/paintings'

export const fetchPaintings = createAsyncThunk(
  'paintings/fetchAll',
  async ({ search = '', category = '' } = {}) => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (category) params.append('category', category)

    const response = await fetch(`${API_URL}?${params}`)
    if (!response.ok) throw new Error('Failed to load paintings')
    return response.json()
  }
)

const paintingsSlice = createSlice({
  name: 'paintings',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaintings.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPaintings.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchPaintings.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default paintingsSlice.reducer