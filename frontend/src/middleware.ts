import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Se o usuário tenta acessar rotas de API protegidas sem token
  if (request.nextUrl.pathname.startsWith("/api/rodas") && !token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  return NextResponse.next();
}

// Configura quais rotas o middleware deve observar
export const config = {
  matcher: ["/api/rodas/:path*", "/dashboard/:path*"],
};
