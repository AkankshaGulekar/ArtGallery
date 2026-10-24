export default function PaintingCard({ painting }) {
  const { title, price, category, imageUrl, available } = painting

  return (
    <div className="painting-card">
      {imageUrl ? (
        <img src={imageUrl} alt={title} />
      ) : (
        <div className="no-image">No image</div>
      )}
      <h3>{title}</h3>
      <p>{category}</p>
      <p>
        {Number(price).toLocaleString('en-IN', {
          style: 'currency',
          currency: 'INR',
        })}
      </p>
      {!available && <p>Sold</p>}
    </div>
  )
}