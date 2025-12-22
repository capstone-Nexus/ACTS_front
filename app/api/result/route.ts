import { NextResponse } from "next/server";
import axios from "axios";


const url = process.env.NEXT_PUBLIC_AI_URL || "";

export async function POST(req: Request) {
  try {
    const response = await axios.post(
      url,
        { headers: { 'Content-Type': 'application/json' } }

    );
    return NextResponse.json({ data: response.data });
    } catch (error: any) {
    return NextResponse.json({ error: "에러 발생" }, { status: 500 });
  }
}
