import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/events",
  "/ministries",
  "/gallery",
]

const roleRoutes: Record<string, string[]> = {
  "/studio":          ["ADMIN"],
  "/settings":        ["ADMIN"],
  "/admin-gallery":   ["ADMIN"],
  "/members":         ["ADMIN", "FINANCE_OFFICER", "DEPT_HEAD"],
  "/ministry":        ["ADMIN", "DEPT_HEAD"],
  "/contributions":   ["ADMIN", "FINANCE_OFFICER"],
  "/receipts":        ["ADMIN", "FINANCE_OFFICER"],
  "/expenses":        ["ADMIN", "FINANCE_OFFICER"],
  "/funds":           ["ADMIN", "FINANCE_OFFICER"],
  "/remittances":     ["ADMIN", "FINANCE_OFFICER"],
  "/reports":         ["ADMIN", "FINANCE_OFFICER"],
}

const ROLE_HOME: Record<string, string> = {
  ADMIN:            "/dashboard",
  FINANCE_OFFICER:  "/dashboard",
  DEPT_HEAD:        "/dashboard",
  MEMBER:           "/dashboard",
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  const isPublicRoute = publicRoutes.includes(pathname)

  // Not logged in → redirect to login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Logged in → don't let them back to login/register
  if (session && (pathname === "/login" || pathname === "/register")) {
    const role = session.user.role as string
    return NextResponse.redirect(
      new URL(ROLE_HOME[role] ?? "/dashboard", req.url)
    )
  }

  // Role-based protection
  if (session) {
    const role = session.user.role as string
    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|aiclogo.png).*)"],
}