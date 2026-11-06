"use client";

import { useState } from "react";

export default function Page() {
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code }),
      });
      const data = await response.json();
      setOk(response.ok);
      setMessage(data.message || "Không kích hoạt được");
      if (response.ok) setCode("");
    } catch {
      setOk(false);
      setMessage("Không gọi được trang web");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <form onSubmit={onSubmit}>
        <h1>Kích hoạt VIP</h1>
        <p>Nhập mã trên màn hình robot.</p>
        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label>
          Mã VIP
          <input
            maxLength={6}
            value={code}
            placeholder="RBA5E9"
            autoCapitalize="characters"
            onChange={(event) =>
              setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))
            }
          />
        </label>
        <button type="submit" disabled={loading || code.length !== 6}>
          {loading ? "Đang kích hoạt..." : "Kích hoạt"}
        </button>
        {message ? <p className={ok ? "result ok" : "result error"}>{message}</p> : null}
      </form>
    </main>
  );
}
