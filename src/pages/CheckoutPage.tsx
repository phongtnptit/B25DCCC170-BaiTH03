import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  clearCart,
  selectCartItems,
  selectCartTotal,
} from '../features/cart/cartSlice'

export default function CheckoutPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [ordered, setOrdered] = useState(false)

  if (ordered) {
    return (
      <section>
        <h1>Đặt hàng thành công!</h1>
        <p>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</p>
        <Link to="/">Tiếp tục mua sắm</Link>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section>
        <h1>Thanh toán</h1>
        <p>Giỏ hàng đang trống, không có gì để thanh toán.</p>
        <Link to="/">Về trang chủ</Link>
      </section>
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    dispatch(clearCart())
    setOrdered(true)
  }

  return (
    <section className="form-page">
      <h1>Thanh toán</h1>
      <ul>
        {items.map((i) => (
          <li key={i.product.id}>
            {i.product.title} × {i.quantity} — $
            {(i.product.price * i.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="total">Tổng tiền: ${total.toFixed(2)}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Họ tên người nhận
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Địa chỉ giao hàng
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <button type="submit">Đặt hàng</button>
      </form>
    </section>
  )
}
