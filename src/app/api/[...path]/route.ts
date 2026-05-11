import { NextRequest, NextResponse } from "next/server";

//This proxy is for DEVELOPMENT purposes only (http backend and https frontend data transfers). In production: requests go directly to backend URL /api proxy is never used
const API_URL = "http://127.0.0.1:3000";

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  const response = await fetch(
    `${API_URL}/${path.join("/")}${req.nextUrl.search}`,
    {
      method: req.method,
      headers: req.headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined,
    }
  );

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: response.headers,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};