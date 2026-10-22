"use client";

import Link from "next/link";

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.png" alt="СтокПоток" className="h-12" />
          </Link>
          <Link href="/" className="text-sm font-medium text-black">
            На главную
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-black mb-2">Контакты</h1>
        <p className="text-neutral-500 mb-8">
          Свяжитесь с нами удобным способом — ответим быстро.
        </p>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-neutral-100">
            <p className="text-sm text-neutral-500 mb-1">Телефон</p>
            <a
              href="tel:+79996722737"
              className="text-lg font-semibold text-black hover:underline"
            >
              +7 (999) 672-27-37
            </a>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-100">
            <p className="text-sm text-neutral-500 mb-1">Telegram</p>
            <a
              href="https://t.me/stokpotok"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-black hover:underline block"
            >
              @stokpotok
            </a>
            <a
              href="https://t.me/AleksandrMBMRR"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-black hover:underline block mt-1"
            >
              @AleksandrMBMRR
            </a>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-100">
            <p className="text-sm text-neutral-500 mb-1">Email</p>
            <a
              href="mailto:hello@stokpotok.ru"
              className="text-lg font-semibold text-black hover:underline"
            >
              hello@stokpotok.ru
            </a>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-100">
            <p className="text-sm text-neutral-500 mb-1">Самовывоз</p>
            <p className="text-lg font-semibold text-black">
              деревня Соколово, Солнечногорский район
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              Пн–Пт: 10:00–19:00
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-100">
            <p className="text-sm text-neutral-500 mb-2">О нас</p>
            <p className="text-neutral-700 leading-relaxed">
              СтокПоток — поставщик стоковых паллет с одеждой, электроникой, бытовой техникой и детскими товарами. 
              Работаем напрямую со складами, без посредников. 
              <br /><br />
              Кроме паллет, занимаемся продажей товаров <strong>фурами</strong> — большие объёмы по выгодным ценам для оптовиков и магазинов. 
              Свежие поступления каждую неделю, личный осмотр и честные условия.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}