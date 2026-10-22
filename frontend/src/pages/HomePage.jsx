import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPaintings } from '../features/paintings/paintingsSlice'

export default function HomePage() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.paintings)

  useEffect(() => {
    dispatch(fetchPaintings())
  }, [dispatch])

  if (status === 'loading') return <p>Loading paintings...</p>
  if (status === 'failed') return <p>Error: {error}</p>

  return (
    <div>
      <h1>Paintings</h1>
      {items.length === 0 ? (
        <p>No paintings yet.</p>
      ) : (
        <ul>
          {items.map((p) => (
            <li key={p.id}>
              {p.title} - {p.price} ({p.category})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}