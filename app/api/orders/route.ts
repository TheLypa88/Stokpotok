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
  return NextResponse.json(data);
}