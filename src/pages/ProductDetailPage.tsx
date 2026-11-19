import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchProducts } from '../features/products/productsSlice'
import { addToCart } from '../features/cart/cartSlice'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((s) => s.products)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  if (status === 'loading') return <p>Đang tải sản phẩm...</p>
  if (status === 'failed') return <p>Tải sản phẩm thất bại: {error}</p>

  const product = items.find((p) => p.id === Number(id))
  if (!product) return <p>Không tìm thấy sản phẩm. <Link to="/">Về trang chủ</Link></p>

  return (
    <section className="detail">
      <img src={product.image} alt={product.title} />
      <div>
        <h1>{product.title}</h1>
        <p className="category">{product.category}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <p>{product.description}</p>
        <button type="button" onClick={() => dispatch(addToCart(product))}>
          Thêm vào giỏ
        </button>{' '}
        <Link to="/cart">Xem giỏ hàng</Link>
      </div>
    </section>
  )
}
