"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Pallet = {
  id: number;
  title: string;
  price: number;
  description: string;
  color: string;
  image: string;
};

export default function Home() {
  const [cart, setCart] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");

  const pallets: Pallet[] = [
    {
      id: 1,
      title: "Паллета Small",
      price: 55000,
      description: "🔥 Компактная паллета с одеждой и аксессуарами. Хиты сезона, которые быстро уходят с полок. Идеально для старта или добора ассортимента. Выгода до 60% от розницы!",
      color: "bg-orange-100",
      image: "/pallet-small.jpg",
    },
    {
      id: 2,
      title: "Паллета Medium",
      price: 90000,
      description: "🔥 Средняя паллета с электроникой и бытовой техникой. Ноутбуки, планшеты, наушники, мелкая и средняя техника. Стабильный спрос и хорошая маржа. Отличный вариант для перепродажи!",
      color: "bg-blue-100",
      image: "/pallet-medium.jpg",
    },
    {
      id: 3,
      title: "Паллета Large",
      price: 110000,
      description: "🔥 Большая паллета с миксом товаров: одежда, техника, детские товары и многое другое. Максимальный объём и разнообразие. Закроешь десятки заказов с одной паллеты. Выгода до 70%!",
      color: "bg-green-100",
      image: "/pallet-large.jpg",
    },
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem("pallet-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pallet-cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    let result = "";
    if (numbers.length > 0) {
      result = "+7";
      if (numbers.length > 1) {
        result += " (" + numbers.substring(1, 4);
      }
      if (numbers.length >= 4) {
        result += ") " + numbers.substring(4, 7);
      }
      if (numbers.length >= 7) {
        result += "-" + numbers.substring(7, 9);
      }
      if (numbers.length >= 9) {
        result += "-" + numbers.substring(9, 11);
      }
    }
    return result;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const addToCart = (id: number) => {
    setCart((prev) => [...prev, id]);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) return prev;
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const cartItems = cart
    .map((id) => pallets.find((p) => p.id === id))
    .filter(Boolean) as Pallet[];

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const isFormValid =
    name.trim().length > 1 &&
    phone.replace(/\D/g, "").length === 11 &&
    (deliveryType === "pickup" || address.trim().length > 5);

  const handleSubmitOrder = async () => {
    if (!isFormValid) {
      alert("Заполни все обязательные поля правильно");
      return;
    }

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        deliveryType,
        address: deliveryType === "delivery" ? address : "Самовывоз",
        items: cartItems,
        total,
      }),
    });

    setOrderSuccess(true);
    setCart([]);
    setName("");
    setPhone("");
    setAddress("");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-xl font-bold text-black">СтокПоток</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/contacts" className="text-sm font-medium text-black">
              Контакты
            </Link>
            <button
              onClick={() => setIsOrdersOpen(true)}
              className="text-sm font-medium text-black"
            >
              Мои заказы
            </button>
            <button
              onClick={() => {
                setIsCartOpen(true);
                setIsCheckout(false);
                setOrderSuccess(false);
              }}
              className="text-sm font-medium text-black"
            >
              Корзина ({cart.length})
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {pallets.map((pallet) => (
          <article
            key={pallet.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100"
          >
            <div className="aspect-[4/5] bg-neutral-100">
              <img
                src={pallet.image}
                alt={pallet.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h2 className="font-semibold text-lg text-black">{pallet.title}</h2>
                <span className="font-bold text-lg text-black">
                  {pallet.price.toLocaleString("ru-RU")} ₽
                </span>
              </div>
              <p className="text-neutral-500 text-sm mb-4">{pallet.description}</p>
              <button
                onClick={() => addToCart(pallet.id)}
                className="w-full bg-black text-white py-3 rounded-xl font-medium active:scale-[0.98] transition"
              >
                В корзину
              </button>
            </div>
          </article>
        ))}
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-lg mx-auto bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            {orderSuccess ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-black mb-2">Заказ принят!</h2>
                <p className="text-neutral-500 mb-1">
                  Статус: <span className="text-black font-medium">Ожидает оплаты</span>
                </p>
                <p className="text-sm text-neutral-400 mb-6">Мы скоро свяжемся с тобой</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setOrderSuccess(false);
                    setIsCheckout(false);
                  }}
                  className="w-full bg-black text-white py-3.5 rounded-xl font-medium"
                >
                  Вернуться в магазин
                </button>
              </div>
            ) : isCheckout ? (
              <>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-black">Оформление</h2>
                  <button onClick={() => setIsCheckout(false)} className="text-neutral-500 text-sm">
                    Назад
                  </button>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">
                      Имя <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-black outline-none focus:border-black"
                      placeholder="Как тебя зовут"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-1">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-black outline-none focus:border-black"
                      placeholder="+7 (900) 000-00-00"
                      maxLength={18}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-2">Способ получения</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType("delivery")}
                        className={`flex-1 py-3 rounded-xl border text-sm font-medium transition ${
                          deliveryType === "delivery"
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-neutral-200"
                        }`}
                      >
                        Доставка
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType("pickup")}
                        className={`flex-1 py-3 rounded-xl border text-sm font-medium transition ${
                          deliveryType === "pickup"
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-neutral-200"
                        }`}
                      >
                        Самовывоз
                      </button>
                    </div>
                  </div>
                  {deliveryType === "delivery" && (
                    <div>
                      <label className="block text-sm text-neutral-500 mb-1">
                        Адрес доставки <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-black outline-none focus:border-black resize-none"
                        rows={3}
                        placeholder="Город, улица, дом, квартира"
                      />
                    </div>
                  )}
                </div>
                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-black">Итого</span>
                    <span className="font-bold text-lg text-black">
                      {total.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={!isFormValid}
                    className={`w-full py-3.5 rounded-xl font-medium transition ${
                      isFormValid
                        ? "bg-black text-white"
                        : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    }`}
                  >
                    Подтвердить заказ
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-black">Корзина</h2>
                  <button onClick={() => setIsCartOpen(false)} className="text-neutral-500 text-sm">
                    Закрыть
                  </button>
                </div>
                {cartItems.length === 0 ? (
                  <p className="text-neutral-500 text-center py-10">Пока пусто</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-black">{item.title}</p>
                            <p className="text-sm text-neutral-500">
                              {item.price.toLocaleString("ru-RU")} ₽
                            </p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">
                            Удалить
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-neutral-200 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium text-black">Итого</span>
                        <span className="font-bold text-lg text-black">
                          {total.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                      <button
                        onClick={() => setIsCheckout(true)}
                        className="w-full bg-black text-white py-3.5 rounded-xl font-medium"
                      >
                        Оформить заказ
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {isOrdersOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOrdersOpen(false)} />
          <div className="relative w-full max-w-lg mx-auto bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-black">Мои заказы</h2>
              <button onClick={() => setIsOrdersOpen(false)} className="text-neutral-500 text-sm">
                Закрыть
              </button>
            </div>
            <OrdersByPhone />
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersByPhone() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (phone.replace(/\D/g, "").length < 11) {
      alert("Введите полный номер телефона");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/orders/by-phone?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (900) 000-00-00"
          className="flex-1 border border-neutral-200 rounded-xl px-4 py-3 text-black outline-none focus:border-black"
        />
        <button onClick={search} className="bg-black text-white px-5 rounded-xl font-medium">
          Найти
        </button>
      </div>

      {loading && <p className="text-neutral-500 text-center">Загрузка...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-neutral-500 text-center py-10">Заказов не найдено</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-neutral-200 rounded-2xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-black">Заказ #{order.id.slice(-6)}</p>
                <p className="text-xs text-neutral-400">{order.date}</p>
              </div>
              <span className="text-sm font-medium text-black bg-neutral-100 px-2.5 py-1 rounded-full">
                {order.status}
              </span>
            </div>
            <p className="text-sm text-neutral-500 mb-1">
              {order.items?.map((i: any) => i.title).join(", ")}
            </p>
            <p className="font-bold text-black">{order.total?.toLocaleString("ru-RU")} ₽</p>
          </div>
        ))}
      </div>
    </div>
  );
}