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
  "/studio":                      ["ADMIN"],
  "/dashboard/settings":          ["ADMIN"],
  "/dashboard/admin-gallery":     ["ADMIN"],
  "/dashboard/admin-ministry":    ["ADMIN", "DEPT_HEAD"],
  "/dashboard/members":           ["ADMIN", "FINANCE_OFFICER", "DEPT_HEAD"],
  "/dashboard/services":          ["ADMIN", "DEPT_HEAD"],
  "/dashboard/attendance":        ["ADMIN", "DEPT_HEAD"],
  "/dashboard/admin-events":      ["ADMIN", "DEPT_HEAD"],
  "/dashboard/contributions":     ["ADMIN", "FINANCE_OFFICER"],
  "/dashboard/receipts":          ["ADMIN", "FINANCE_OFFICER"],
  "/dashboard/expenses":          ["ADMIN", "FINANCE_OFFICER"],
  "/dashboard/funds":             ["ADMIN", "FINANCE_OFFICER"],
  "/dashboard/remittances":       ["ADMIN", "FINANCE_OFFICER"],
  "/dashboard/reports":           ["ADMIN", "FINANCE_OFFICER"],
}

const ROLE_HOME: Record<string, string> = {
  ADMIN:           "/dashboard",
  FINANCE_OFFICER: "/dashboard",
  DEPT_HEAD:       "/dashboard",
  MEMBER:          "/dashboard",
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Allow public routes
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith('/events/') ||
    pathname.startsWith('/gallery') ||
    pathname.startsWith('/ministries')

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