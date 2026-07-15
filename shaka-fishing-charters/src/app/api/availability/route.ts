import { NextRequest, NextResponse } from "next/server";
import { getUnavailableDaysInRange, parseDayKey } from "@/lib/bookings";

const MAX_RANGE_DAYS = 100;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");

  if (!startParam || !endParam) {
    return NextResponse.json(
      { error: "Missing required 'start' and 'end' query params (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  let start: Date;
  let end: Date;
  try {
    start = parseDayKey(startParam);
    end = parseDayKey(endParam);
  } catch {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  const rangeDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  if (rangeDays < 0 || rangeDays > MAX_RANGE_DAYS) {
    return NextResponse.json({ error: "Range too large" }, { status: 400 });
  }

  const unavailable = await getUnavailableDaysInRange(start, end);

  return NextResponse.json({ unavailable: Array.from(unavailable) });
}
