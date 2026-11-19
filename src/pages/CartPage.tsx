import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '../features/cart/cartSlice'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)

  if (items.length === 0) {
    return (
      <section>
        <h1>Giỏ hàng</h1>
        <p>Giỏ hàng đang trống.</p>
        <Link to="/">Tiếp tục mua sắm</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>Giỏ hàng</h1>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.product.id} className="cart-item">
            <img src={item.product.image} alt={item.product.title} />
            <div>
              <Link to={`/products/${item.product.id}`}>{item.product.title}</Link>
              <p>${item.product.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              aria-label="Số lượng"
              onChange={(e) =>
                dispatch(
                  updateQuantity({
                    id: item.product.id,
                    quantity: Number(e.target.value),
                  }),
                )
              }
            />
            <p>${(item.product.price * item.quantity).toFixed(2)}</p>
            <button
              type="button"
              onClick={() => dispatch(removeFromCart(item.product.id))}
            >
              Xoá
            </button>
          </li>
        ))}
      </ul>
      <p className="total">Tổng tiền: ${total.toFixed(2)}</p>
      <Link className="btn" to="/checkout">
        Thanh toán
      </Link>
    </section>
  )
}
