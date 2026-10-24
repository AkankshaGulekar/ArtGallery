import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { fetchPaintingById } from '../features/paintings/paintingsSlice'

export default function PaintingDetailsPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selected, selectedStatus, selectedError } = useSelector(
    (state) => state.paintings
  )

  useEffect(() => {
    dispatch(fetchPaintingById(id))
  }, [dispatch, id])

  return (
    <div>
      <Link to="/">&larr; Back to paintings</Link>

      {selectedStatus === 'loading' && <p>Loading...</p>}
      {selectedStatus === 'failed' && <p>Error: {selectedError}</p>}

      {selected && (
        <div className="painting-details">
          {selected.imageUrl ? (
            <img src={selected.imageUrl} alt={selected.title} />
          ) : (
            <div className="no-image">No image</div>
          )}
          <div>
            <h1>{selected.title}</h1>
            <p>{selected.category}</p>
            <p>{selected.description}</p>
            <h2>
              {Number(selected.price).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              })}
            </h2>
            {!selected.available && <p>Sold</p>}
          </div>
        </div>
      )}
    </div>
  )
}