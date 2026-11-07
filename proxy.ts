import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, accessToken } from "@/lib/access";

// While SITE_PASSWORD is set, every page needs the access cookie; without it,
// visitors are sent to /unlock and back to the page they asked for after.
export async function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/unlock") || pathname.startsWith("/api/unlock")) {
    return NextResponse.next();
  }
  const cookie = request.cookies.get(ACCESS_COOKIE)?.value;
  if (cookie && cookie === (await accessToken(password))) return NextResponse.next();

  const url = new URL("/unlock/", request.url);
  url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next's own assets and images, which the unlock page
  // needs and which reveal nothing on their own.
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:webp|jpg|jpeg|png|svg|ico)$).*)"],
};
