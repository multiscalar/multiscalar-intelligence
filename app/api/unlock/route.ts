import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, ACCESS_MAX_AGE, accessToken, normalizePassword, safeNext } from "@/lib/access";

// Checks the password from the /unlock form and sets the access cookie.
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const next = safeNext(String(form.get("next") ?? ""));
  const password = process.env.SITE_PASSWORD;
  const given = String(form.get("password") ?? "");

  if (!password || normalizePassword(given) !== normalizePassword(password)) {
    const back = new URL("/unlock/", request.url);
    back.searchParams.set("next", next);
    back.searchParams.set("error", "1");
    return NextResponse.redirect(back, 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(ACCESS_COOKIE, await accessToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
  return response;
}
