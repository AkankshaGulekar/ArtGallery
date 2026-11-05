import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchPaintings } from '../features/paintings/paintingsSlice'
import PaintingCard from '../components/PaintingCard'

const CATEGORIES = ['Originals', 'Prints']

export default function ShopPage() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.paintings)
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''

  useEffect(() => {
    dispatch(fetchPaintings({ category }))
  }, [dispatch, category])

  function handleChange(e) {
    const value = e.target.value
    setSearchParams(value ? { category: value } : {})
  }

  return (
    <div>
      <h1>Shop</h1>

      <div className="filters">
        <select value={category} onChange={handleChange}>
          <option value="">All paintings</option>
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