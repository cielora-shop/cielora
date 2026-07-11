import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Clone headers to pass down to Server Components
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", req.nextUrl.pathname);

    const res = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    const isAuth = !!req.nextauth.token;
    const isLoginPage = req.nextUrl.pathname === "/admin/login";

    if (isLoginPage && isAuth) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return res;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin") && path !== "/admin/login") {
          return !!token;
        }
        return true;
      }
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
