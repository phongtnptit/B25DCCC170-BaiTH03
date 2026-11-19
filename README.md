# ShopMini — Bài thực hành 03

Cửa hàng mini viết bằng React + TypeScript (Vite).
State quản lý bằng Context API và Redux Toolkit.
Sản phẩm lấy từ API https://fakestoreapi.com/products

## Chạy dự án

Cài thư viện rồi chạy dev server:

```bash
npm install
npm run dev
```

Sau đó mở http://localhost:5173

Đăng nhập thử: nhập tên bất kỳ, mật khẩu là 123456.

## Dữ liệu nào để ở đâu, và vì sao

Chia state ra làm 3 chỗ, chỗ nào dùng ít thì để gần, chỗ nào dùng nhiều thì đưa lên cao.

Từ khoá tìm kiếm thì để ở useState trong HomePage thôi.
Nó chỉ dùng trong đúng trang đó, không trang nào khác cần đọc, nên để local là đủ, đưa lên trên chỉ rối thêm.

Họ tên và địa chỉ ở form thanh toán cũng vậy, để useState trong CheckoutPage.
Nhập xong bấm Đặt hàng là xong, không cần giữ lại hay chia sẻ cho trang khác.

Trạng thái "đã đặt hàng" cũng để useState trong CheckoutPage.
Nó chỉ để đổi màn hình sang thông báo thành công sau khi bấm nút, không liên quan tới chỗ nào khác.

Thông báo lỗi đăng nhập thì để useState trong LoginPage.
Sai mật khẩu thì hiện lỗi ngay tại form đó, xong là thôi.

Theme sáng/tối thì để ở Context (ThemeContext, dùng qua hook useTheme).
Header cần nút đổi theme, còn toàn bộ app thì cần đổi màu theo theme, nên để Context cho tiện, khỏi truyền props lòng vòng.
Dữ liệu này rất đơn giản, chỉ có một giá trị và một hàm đổi, không cần gọi API hay cache gì, nên Context là đủ, không cần Redux.

Người dùng đang đăng nhập thì để ở Context (AuthContext, dùng qua hook useAuth).
Header cần hiện tên người dùng và nút đăng xuất, ProtectedRoute cần biết đã đăng nhập chưa để chặn trang thanh toán, LoginPage thì cần hàm login.
Dữ liệu nhỏ, thay đổi ít, không liên quan tới dữ liệu khác, nên Context là đủ.

Danh sách sản phẩm thì để ở Redux (productsSlice).
Sản phẩm lấy bất đồng bộ từ API, dùng chung ở cả Trang chủ lẫn Chi tiết sản phẩm, lại cần quản lý rõ 3 trạng thái đang tải, tải xong và tải lỗi, với cả cache lại để chuyển trang không phải gọi API lại.
Mấy việc này đúng sở trường của Redux với createAsyncThunk, lại có DevTools để xem state khi debug.

Giỏ hàng thì để ở Redux (cartSlice).
Giỏ hàng là thứ dùng chung nhiều nhất: Header đếm số món, Trang chủ và Chi tiết thêm món vào, trang Giỏ hàng sửa số lượng với xoá món, trang Thanh toán thì xoá sạch giỏ sau khi đặt hàng.
Nhiều chỗ cùng đọc cùng sửa một dữ liệu thì nên có một nguồn sự thật duy nhất, logic cập nhật tập trung một chỗ, đó là trường hợp điển hình để dùng Redux.
Tổng số lượng và tổng tiền thì không lưu riêng, mà tính bằng selector (selectCartCount, selectCartTotal) từ state giỏ hàng, như vậy không bao giờ bị lệch.

Tóm lại thì nguyên tắc của mình là: state chỉ dùng trong một component thì để useState, state dùng xuyên app nhưng đơn giản thì để Context, còn state dùng chung phức tạp hoặc bất đồng bộ thì để Redux Toolkit.

## Cấu trúc thư mục

Thư mục src chia như sau:

- app/store.ts là store Redux, app/hooks.ts là hai hook useAppDispatch và useAppSelector.
- features/products/productsSlice.ts là slice sản phẩm, gọi API bằng createAsyncThunk.
- features/cart/cartSlice.ts là slice giỏ hàng, có addToCart, removeFromCart, updateQuantity, clearCart và selector tính tổng.
- contexts/ThemeContext.tsx và contexts/AuthContext.tsx là hai Context theme và đăng nhập.
- components/Header.tsx là header dùng chung, ProductCard.tsx là thẻ sản phẩm, ProtectedRoute.tsx là route chặn khi chưa đăng nhập.
- layouts/MainLayout.tsx là layout chung bọc header và nội dung trang.
- pages/ có 6 trang: HomePage, ProductDetailPage, CartPage, LoginPage, CheckoutPage, NotFoundPage.
- types/index.ts định nghĩa 3 kiểu Product, CartItem, User.
- App.tsx khai báo các Routes, main.tsx bọc Provider, ThemeProvider, AuthProvider và BrowserRouter.

## Các route

Trang chủ là /, hiện lưới sản phẩm và ô tìm kiếm theo tên.
Lưới này responsive: điện thoại 1 cột, tablet 2 cột, desktop 4 cột.

Chi tiết sản phẩm là /products/:id, bấm vào một sản phẩm ở trang chủ thì sang đây.

Giỏ hàng là /cart, xem món đã thêm, sửa số lượng, xoá món, xem tổng tiền.

Đăng nhập là /login, đăng nhập giả lập, mật khẩu đúng là 123456.

Thanh toán là /checkout, đây là route bảo vệ.
Chưa đăng nhập mà vào thì bị chuyển sang /login, đăng nhập xong sẽ quay lại đúng trang trước đó.
Bấm nút Đặt hàng thì giỏ hàng bị xoá và hiện thông báo đặt hàng thành công.

Đường dẫn nào không khớp thì rơi vào trang 404.
