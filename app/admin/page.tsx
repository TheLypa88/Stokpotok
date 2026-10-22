"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  const login = async () => {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAuth(true);
      setError("");
      load();
    } else {
      setError("Неверный пароль");
    }
  };

  const load = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  const changeStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm border">
          <h1 className="text-xl font-bold text-black mb-4 text-center">Админка</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Пароль"
            className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-black outline-none focus:border-black mb-3"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            onClick={login}
            className="w-full bg-black text-white py-3 rounded-xl font-medium"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-black">Заказы</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-5 border border-neutral-200">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-medium text-black">#{order.id.slice(-6)}</p>
                  <p className="text-sm text-neutral-500">{order.date}</p>
                </div>
                <p className="font-bold text-black">{order.total?.toLocaleString("ru-RU")} ₽</p>
              </div>
              <p className="text-sm text-black mb-1">{order.name} · {order.phone}</p>
              <p className="text-sm text-neutral-600 mb-3">
                {order.items?.map((i: any) => i.title).join(", ")}
              </p>
              <div className="flex gap-2 flex-wrap">
                {["Ожидает оплаты", "Оплачен", "Собирается", "Отправлен", "Доставлен", "Отменён"].map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(order.id, s)}
                    className={`text-xs px-3 py-1 rounded-full border border-black ${
                      order.status === s
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-neutral-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}