import { configureStore } from '@reduxjs/toolkit'
import paintingsReducer from '../features/paintings/paintingsSlice'

export const store = configureStore({
  reducer: {
    paintings: paintingsReducer,
  },
})