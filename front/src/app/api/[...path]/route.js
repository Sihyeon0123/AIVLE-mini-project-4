// src/app/api/[...path]/route.js
import { NextResponse } from "next/server";

const BACKEND_BASE_URL = "http://10.0.2.205:8080";

async function proxy(req, { params }) {
  const { path = [] } = params;

  // 🔑 핵심: 백엔드는 이미 /api/* 를 씀
  const backendPath = "/api/" + path.join("/");

  const url = new URL(req.url);
  const backendUrl = `${BACKEND_BASE_URL}${backendPath}${url.search}`;

  const res = await fetch(backendUrl, {
    method: req.method,
    headers: {
      cookie: req.headers.get("cookie") ?? "",
      authorization: req.headers.get("authorization") ?? "",
      "content-type": req.headers.get("content-type") ?? "application/json",
    },
    body: req.method === "GET" || req.method === "HEAD" ? null : await req.text(),
    cache: "no-store",
  });

  const body = await res.text();
  const response = new NextResponse(body, { status: res.status });

  const authHeader = res.headers.get("authorization");
  if (authHeader) response.headers.set("authorization", authHeader);

  return response;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
