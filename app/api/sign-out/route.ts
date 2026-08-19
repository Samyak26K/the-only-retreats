import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
    {
      status: 302,
      headers: {
        "Set-Cookie": "__session=; Max-Age=0; Path=/; HttpOnly",
      },
    },
  );
}
