import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPaintings } from '../features/paintings/paintingsSlice'
import PaintingCard from '../components/PaintingCard'

const CATEGORIES = ['Landscape', 'Portrait', 'Abstract', 'Still Life']

export default function HomePage() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.paintings)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    dispatch(fetchPaintings({ search, category }))
  }, [dispatch, search, category])

  return (
    <div>
      <h1>Paintings</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && items.length === 0 && <p>No paintings found.</p>}

      <div className="painting-grid">
        {items.map((p) => (
          <PaintingCard key={p.id} painting={p} />
        ))}
      </div>
    </div>
  )
}