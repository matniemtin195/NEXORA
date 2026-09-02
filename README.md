# NEXORA — Digital Marketplace V3

Marketplace Next.js + Supabase, tối ưu mobile.

## Đã có
- Trang chủ / sản phẩm / tìm kiếm / lọc danh mục
- Đăng ký, đăng nhập, tài khoản
- Ví số dư
- Tạo lệnh nạp + VietQR
- Lịch sử nạp + biến động số dư
- Mua sản phẩm bằng số dư qua RPC atomic
- Đơn hàng + thông tin bàn giao
- Admin: thêm/sửa/ẩn/hiện sản phẩm, duyệt/từ chối topup
- Webhook topup có secret
- RLS và index cho các bảng chính

## Cài đặt
1. Copy `.env.example` thành `.env.local` và điền biến môi trường.
2. Chạy migration/schema phù hợp trong Supabase.
3. `npm install`
4. `npm run dev`

Không đưa `SUPABASE_SERVICE_ROLE_KEY` lên client.


## VietQR PVcomBank
The deposit page uses `public/nexora-vietqr-pvcombank.png` supplied by the site owner. Static QR does not itself provide automatic bank reconciliation; configure a trusted payment webhook/provider before auto-crediting balances.
