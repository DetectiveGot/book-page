import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./lib/auth0"

export async function proxy(req: NextRequest) {
    const res = await auth0.middleware(req);
    const url = new URL(req.url);
    const pathname = url.pathname;

    const isProtected = pathname.startsWith("/bookmark") || pathname.startsWith("/api/bookmarks");
    const isAuthRoute = pathname.startsWith("/auth");

    if(isProtected && !isAuthRoute) {
        const session = await auth0.getSession(req);
        if(!session) {
            if(pathname.startsWith("/api")) {
                return NextResponse.json({error: "Unauthorized"}, {status: 401});
            }
            const loginUrl = new URL("/auth/login", url.origin);
            loginUrl.searchParams.set("returnTo", pathname+url.search);
            return NextResponse.redirect(loginUrl, 302);
        }
    }
    return res;
}

export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico, sitemap.xml, robots.txt (metadata files)
        */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};