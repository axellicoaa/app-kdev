import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 📌 Rutas públicas (se puede acceder sin login)
  if (pathname.startsWith("/login") || pathname === "/") {
    if (token) {
      // Si ya tiene token e intenta ir a login, lo mandamos al dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 📌 Rutas protegidas
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// 📌 Configurar a qué rutas se aplica el middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/nuevo-proyecto",
    "/login",
    "/",
  ],
};
