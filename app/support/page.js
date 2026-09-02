export default function SupportPage() {
  return (
    <main className="container">
      <div className="panel" style={{maxWidth: 900, margin: "30px auto"}}>
        <a href="/">← Về NEXORA</a>

        <h1 style={{marginTop: 20}}>💬 Hỗ trợ khách hàng</h1>
        <p className="muted">
          Trung tâm hỗ trợ NEXORA — chúng tôi luôn sẵn sàng hỗ trợ bạn.
        </p>

        <div className="grid" style={{marginTop: 25}}>
          <div className="card">
            <div style={{fontSize: 36}}>💬</div>
            <h3>Chat hỗ trợ</h3>
            <p className="muted">Liên hệ nhanh với đội ngũ NEXORA.</p>
            <a className="btn" href="https://zalo.me/" target="_blank" rel="noreferrer">
              Mở Zalo
            </a>
          </div>

          <div className="card">
            <div style={{fontSize: 36}}>📧</div>
            <h3>Email hỗ trợ</h3>
            <p className="muted">Gửi yêu cầu hỗ trợ cho NEXORA.</p>
            <a className="btn" href="mailto:support@nexora.vn">
              Gửi Email
            </a>
          </div>

          <div className="card">
            <div style={{fontSize: 36}}>🛒</div>
            <h3>Hỗ trợ đơn hàng</h3>
            <p className="muted">Kiểm tra đơn hàng và trạng thái xử lý.</p>
            <a className="btn" href="/orders">
              Xem đơn hàng
            </a>
          </div>

          <div className="card">
            <div style={{fontSize: 36}}>💰</div>
            <h3>Nạp tiền & thanh toán</h3>
            <p className="muted">Hỗ trợ các vấn đề về nạp tiền và thanh toán.</p>
            <a className="btn" href="/wallet">
              Mở ví
            </a>
          </div>
        </div>

        <div className="card" style={{marginTop: 25}}>
          <h2>❓ Câu hỏi thường gặp</h2>

          <details>
            <summary>Thanh toán xong nhưng chưa nhận được sản phẩm?</summary>
            <p className="muted">Vào Đơn hàng để kiểm tra trạng thái.</p>
          </details>

          <details>
            <summary>Nạp tiền nhưng số dư chưa cập nhật?</summary>
            <p className="muted">Kiểm tra giao dịch và liên hệ hỗ trợ nếu cần.</p>
          </details>

          <details>
            <summary>Tôi gặp lỗi khi mua hàng?</summary>
            <p className="muted">Gửi mã đơn hàng và ảnh lỗi cho bộ phận hỗ trợ.</p>
          </details>
        </div>

        <div className="panel" style={{marginTop: 25, textAlign: "center"}}>
          <h3>🕐 Thời gian hỗ trợ</h3>
          <p className="muted">08:00 – 22:00 mỗi ngày</p>
        </div>
      </div>
    </main>
  );
}
