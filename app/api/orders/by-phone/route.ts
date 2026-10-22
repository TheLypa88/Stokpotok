import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  // Оставляем только цифры
  const digits = phone.replace(/\D/g, "");

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });

  // Фильтруем на стороне сервера по цифрам
  const filtered = (data || []).filter((order: any) => {
    const orderDigits = (order.phone || "").replace(/\D/g, "");
    return orderDigits.includes(digits) || digits.includes(orderDigits);
  });

  return NextResponse.json(filtered);
}