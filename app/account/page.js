"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase";

const money = (n) =>
  new Intl.NumberFormat("vi-VN").format(Number(n || 0)) + "đ";

export default function Account() {
  const sb = supabaseBrowser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [profile, setProfile] = useState(null);
  const [msg, setMsg] = useState("");
  const [mode, setMode] = useState("login");

  useEffect(() => {
    sb.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;

      setEmail(data.user.email || "");

      const { data: p } = await sb
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setProfile(p);
      setName(p?.full_name || "");
    });
  }, []);

  async function submit() {
    setMsg("");

    if (!email || !pw) {
      setMsg("Vui lòng nhập email và mật khẩu.");
      return;
    }

    if (mode === "login") {
      const { error } = await sb.auth.signInWithPassword({
        email,
        password: pw,
      });

      if (error) {
        setMsg(
          error.message === "Invalid login credentials"
            ? "Tài khoản hoặc mật khẩu sai kìa ní ơi xem lại đi"
            : error.message
        );
        return;
      }

      router.replace("/");
      router.refresh();
      return;
    }

    const { error } = await sb.auth.signUp({
      email,
      password: pw,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setMsg(
      error
        ? error.message
        : "Đăng ký thành công. Kiểm tra email nếu hệ thống yêu cầu xác nhận."
    );
  }

  async function save() {
    const {
      data: { user },
    } = await sb.auth.getUser();

    if (!user) {
      setMsg("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    const { error } = await sb
      .from("profiles")
      .update({ full_name: name })
      .eq("id", user.id);

    setMsg(error ? error.message : "Đã lưu thông tin");
  }

  async function out() {
    await sb.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (profile) {
    return (
      <>
        <SimpleHeader />
        <main className="auth">
          <div className="panel">
            <div className="avatar">
              {(name || email || "N").slice(0, 1).toUpperCase()}
            </div>

            <h1>Tài khoản</h1>
            <p className="muted">{email}</p>

            <label>Họ tên</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên của bạn"
            />

            <label>Email</label>
            <input value={email} disabled />

            <div className="actions">
              <button className="btn" onClick={save}>
                Lưu thay đổi
              </button>

              <a className="btn ghost" href="/wallet">
                Ví: {money(profile.balance)}
              </a>

              <a className="btn ghost" href="/orders">
                Đơn hàng
              </a>
            </div>

            {profile.role === "admin" && (
              <a className="adminLink" href="/admin">
                ⚙ Mở trang quản trị
              </a>
            )}

            {msg && <div className="notice">{msg}</div>}

            <button className="danger" onClick={out}>
              Đăng xuất
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SimpleHeader />

      <main className="auth">
        <div className="panel">
          <a className="homeBack" href="/">
            🏠 Trang chủ
          </a>

          <div className="eyebrow">WELCOME TO NEXORA</div>

          <h1>
            {mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản"}
          </h1>

          <p className="muted">
            {mode === "login"
              ? "Đăng nhập để mua hàng và quản lý ví."
              : "Đăng ký tài khoản để bắt đầu."}
          </p>

          {mode !== "login" && (
            <>
              <label>Họ tên</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên của bạn"
              />
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />

          <label>Mật khẩu</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Tối thiểu 6 ký tự"
          />

          <button className="btn full" onClick={submit}>
            {mode === "login" ? "Đăng nhập →" : "Đăng ký →"}
          </button>

          <button
            className="switch"
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
          >
            {mode === "login"
              ? "Chưa có tài khoản? Đăng ký"
              : "Đã có tài khoản? Đăng nhập"}
          </button>

          {msg && <div className="notice">{msg}</div>}
        </div>
      </main>
    </>
  );
}

function SimpleHeader() {
  return (
    <header>
      <a className="brand" href="/">
        <span>N</span>
        <div>
          <b>NEXORA</b>
          <small>DIGITAL MARKETPLACE</small>
        </div>
      </a>

      <nav>
        <a href="/">Trang chủ</a>
        <a href="/products">Sản phẩm</a>
        <a href="/wallet">Ví</a>
        <a href="/orders">Đơn hàng</a>
        <a href="/support">💬 Hỗ trợ</a>
      </nav>
    </header>
  );
}
