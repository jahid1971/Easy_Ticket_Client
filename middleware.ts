import { authKey } from "@/constants/authKey";
import { getCookie } from "@/utils/cookies";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = keyof typeof roleBasedPrivateRoutes;

const withoutTokenRoutes = ["/login", "/register", "/"];

const commonPrivateRoutes = [
    "/dashboard",
    "/dashboard/change-password",
    "/doctors",
];
const roleBasedPrivateRoutes = {
    PATIENT: [/^\/dashboard\/patient/, /^\/video/],
    DOCTOR: [/^\/dashboard\/doctor/, /^\/video/],
    ADMIN: [
        /^\/dashboard\/admin/,
        /^\/dashboard\/patient/,
        /^\/dashboard\/doctor/,
        /^\/video/,
    ],
    SUPER_ADMIN: [
        /^\/dashboard\/super_admin/,
        /^\/dashboard\/admin/,
        /^\/dashboard\/patient/,
        /^\/dashboard\/doctor/,
        /^\/video/,
    ],
};

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // const accessToken = cookies().get("accessToken")?.value;
    const accessToken = getCookie(authKey);

    if (!accessToken) {
        if (withoutTokenRoutes.includes(pathname)) {
            return NextResponse.next();
        } else {
            const loginUrl = new URL("/login", req.url);

            loginUrl.searchParams.set("redirect", pathname); // Capture intended route

            return NextResponse.redirect(loginUrl);
        }
    }

    if (accessToken && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (accessToken && commonPrivateRoutes.includes(pathname)) {
        return NextResponse.next();
    }
    if (accessToken && pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    let role = null;

    if (accessToken) role = (jwtDecode(accessToken) as any).role;

    if (!role) return NextResponse.redirect(new URL("/", req.url));

    if (role && roleBasedPrivateRoutes[role as Role]) {
        const routes = roleBasedPrivateRoutes[role as Role];
        if (routes.some((route) => pathname.match(route))) {
            return NextResponse.next();
        }
    }

    return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
    matcher: [
        "/login",
        "/register",
        "/dashboard/:page*",
        "/doctors",
        "/video/:path*",
        "/",
    ],
};
