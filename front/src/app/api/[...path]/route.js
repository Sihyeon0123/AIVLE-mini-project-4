import { NextResponse } from "next/server";

const BACKEND_BASE_URL = "http://10.0.2.205:8080"; // 백엔드 private IP

async function proxy(req, { params }) {
  const { path = [] } = params;

  // /api/books?page=1 → /books?page=1
  const backendPath = "/" + path.join("/");

  const url = new URL(req.url);
  const backendUrl = `${BACKEND_BASE_URL}${backendPath}${url.search}`;

  try {
    const res = await fetch(backendUrl, {
      method: req.method,
      headers: {
        // 인증/쿠키 전달
        cookie: req.headers.get("cookie") ?? "",
        authorization: req.headers.get("authorization") ?? "",
        "content-type": req.headers.get("content-type") ?? "application/json",
      },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? null
          : await req.text(),
      cache: "no-store",
    });

    const responseBody = await res.text();

    const response = new NextResponse(responseBody, {
      status: res.status,
    });

    // Authorization 헤더 전달 (토큰 재발급 대응)
    const authHeader = res.headers.get("authorization");
    if (authHeader) {
      response.headers.set("authorization", authHeader);
    }

    return response;
  } catch (err) {
    console.error("❌ Backend proxy error:", err);
    return NextResponse.json(
      { message: "Backend server unreachable" },
      { status: 502 }
    );
  }
}

// 모든 HTTP 메서드 지원
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
