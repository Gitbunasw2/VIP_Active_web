export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const password = String(body.password || "");
  const code = String(body.code || "").trim();
  const sitePassword = process.env.SITE_PASSWORD || "rb5320";
  const adminUrl = process.env.VPS_ADMIN_URL || "";
  const adminToken = process.env.VPS_ADMIN_TOKEN || "";

  if (!sitePassword || password !== sitePassword) {
    return Response.json({ message: "Sai mật khẩu" }, { status: 401 });
  }
  if (!/^\d{6}$/.test(code)) {
    return Response.json({ message: "Mã phải là 6 số" }, { status: 400 });
  }
  if (!adminUrl || !adminToken) {
    return Response.json({ message: "Trang web chưa cấu hình server" }, { status: 500 });
  }

  const url = new URL("/admin/allow", adminUrl);
  url.searchParams.set("code", code);
  url.searchParams.set("token", adminToken);

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return Response.json({ message: "Server nhạc từ chối mã này" }, { status: 502 });
    }
    return Response.json({ message: `Đã kích hoạt ${code}` });
  } catch {
    return Response.json({ message: "Không kết nối được server nhạc" }, { status: 502 });
  }
}
