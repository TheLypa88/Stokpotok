import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newOrder = {
    id: Date.now().toString(),
    date: new Date().toLocaleString("ru-RU"),
    name: body.name,
    phone: body.phone,
    delivery_type: body.deliveryType,
    address: body.address,
    items: body.items,
    total: body.total,
    status: "Ожидает оплаты",
  };

  const { data, error } = await supabase
    .from("orders")
    .insert(newOrder)
    .select()
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });

  // Уведомление в Telegram
  const message = `
🆕 Новый заказ #${newOrder.id.slice(-6)}

👤 ${newOrder.name}
📞 ${newOrder.phone}
📦 ${newOrder.items.map((i: any) => i.title).join(", ")}
💰 ${newOrder.total.toLocaleString("ru-RU")} ₽
🚚 ${newOrder.delivery_type === "delivery" ? "Доставка" : "Самовывоз"}
📍 ${newOrder.address}
  `.trim();

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
    }),
  });

  return NextResponse.json(data);
}