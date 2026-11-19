import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchProducts } from '../features/products/productsSlice'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((s) => s.products)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  const filtered = items.filter((p) =>
    p.title.toLowerCase().includes(keyword.trim().toLowerCase()),
  )

  return (
    <section>
      <h1>Sản phẩm</h1>
      <input
        className="search"
        type="search"
        placeholder="Tìm kiếm theo tên sản phẩm..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {status === 'loading' && <p>Đang tải sản phẩm...</p>}
      {status === 'failed' && (
        <p>
          Tải sản phẩm thất bại: {error}{' '}
          <button type="button" onClick={() => dispatch(fetchProducts())}>
            Thử lại
          </button>
        </p>
      )}
      {status === 'succeeded' && filtered.length === 0 && (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}
      <div className="grid">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
