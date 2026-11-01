import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API_URL = 'http://localhost:8080/api/auth'

function loadStored() {
  try {
    const stored = localStorage.getItem('auth')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const stored = loadStored()

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    if (response.status === 401) return rejectWithValue('Invalid email or password')
    if (!response.ok) return rejectWithValue('Login failed')
    return response.json()
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (details, { rejectWithValue }) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    })
    if (response.status === 409) return rejectWithValue('Email already registered')
    if (response.status === 400)
      return rejectWithValue('Enter a valid email and a password of at least 6 characters')
    if (!response.ok) return rejectWithValue('Registration failed')
    return response.json()
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored?.user ?? null,
    token: stored?.token ?? null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
    },
    clearError(state) {
      state.error = null
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Could not reach the server'
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Could not reach the server'
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer