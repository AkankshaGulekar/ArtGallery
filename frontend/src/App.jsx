import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PaintingDetailsPage from './pages/PaintingDetailsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/paintings/:id" element={<PaintingDetailsPage />} />
    </Routes>
  )
}