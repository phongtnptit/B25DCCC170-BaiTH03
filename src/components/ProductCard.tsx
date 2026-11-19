import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useAppDispatch } from '../app/hooks'
import { addToCart } from '../features/cart/cartSlice'

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch()

  return (
    <article className="card">
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt={product.title} loading="lazy" />
        <h3>{product.title}</h3>
      </Link>
      <p className="category">{product.category}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <button type="button" onClick={() => dispatch(addToCart(product))}>
        Thêm vào giỏ
      </button>
    </article>
  )
}
