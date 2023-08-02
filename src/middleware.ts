import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    const notToLoadIfLogged = ["/login", "/signup"];
    const LoggedpathComparison = notToLoadIfLogged?.some((path) => pathname == path);
    const res = NextResponse.next();
    if (LoggedpathComparison) {
        const token = await getToken({ req })
        if (token) {
            const url = new URL(`profile/${token.username}`, req.url);
            return NextResponse.redirect(url);
        }
        return res;
    } else if (pathname.startsWith('/profile')){
        const token = await getToken({ req })
        if (token === null) {
            const url = new URL(`/login`, req.url);
            return NextResponse.redirect(url);
        }
    }
}
 