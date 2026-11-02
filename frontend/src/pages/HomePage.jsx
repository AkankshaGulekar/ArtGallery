import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchPaintings } from '../features/paintings/paintingsSlice'
import PaintingCard from '../components/PaintingCard'

export default function HomePage() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.paintings)

  useEffect(() => {
    dispatch(fetchPaintings())
  }, [dispatch])

  const newest = [...items].reverse().slice(0, 4)

  return (
    <div>
      <section className="hero">
        <h1>XYZXYZXYZXYZXYZXYZXYZXYZ</h1>
        <Link to="/shop" className="button">
          Shop new arrivals
        </Link>
      </section>

      <section className="tiles">
        <Link to="/shop?category=Originals" className="tile">
          <h2>Originals</h2>
          <p>One-of-a-kind paintings</p>
        </Link>
        <Link to="/shop?category=Prints" className="tile">
          <h2>Prints</h2>
          <p>Prints of the artist's work</p>
        </Link>
      </section>

      <section>
        <h2>Newly launched</h2>
        {status === 'failed' && <p>Error: {error}</p>}
        <div className="painting-grid">
          {newest.map((p) => (
            <PaintingCard key={p.id} painting={p} />
          ))}
        </div>
        <p>
          <Link to="/shop">See more</Link>
        </p>
      </section>
    </div>
  )
}