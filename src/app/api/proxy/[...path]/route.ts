// src/app/api/proxy/[...path]/route.ts

import { NextRequest } from "next/server";

const ODOO_BASE_URL = "http://203.99.53.212:8069";

async function handleRequest(req: NextRequest, method: string) {
  const { pathname, search } = new URL(req.url);

  // Extract the path after /api/proxy
  const proxyPath = pathname.replace(/^\/api\/proxy/, "");

  const targetUrl = `${ODOO_BASE_URL}${proxyPath}${search}`;

  const headers = new Headers(req.headers);
  headers.set("host", "http://203.99.53.212:8069"); // optional

  const body =
    method !== "GET" && method !== "HEAD" ? await req.text() : undefined;

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    const resHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      resHeaders[key] = value;
    });

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (err: any) {
    return new Response(`Proxy Error: ${err.message}`, { status: 500 });
  }
}

// Export named methods
export async function GET(req: NextRequest) {
  return handleRequest(req, "GET");
}

export async function POST(req: NextRequest) {
  return handleRequest(req, "POST");
}

export async function PUT(req: NextRequest) {
  return handleRequest(req, "PUT");
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req, "DELETE");
}

export async function PATCH(req: NextRequest) {
  return handleRequest(req, "PATCH");
}



// export const config = {
//   runtime: "edge",
// };

// export default async function handler(req: Request) {
//   const url = new URL(req.url);
//   const pathname = url.pathname;

//   // Extract the proxy path after /api/proxy/
//   const proxyPath = pathname.replace(/^\/api\/proxy/, "");

//   if (!proxyPath) {
//     return new Response("Missing proxy path", { status: 400 });
//   }
// console.log("Proxy path:", proxyPath);
//   const odooBaseUrl = "http://203.99.53.212:8069";
//   const targetUrl = `${odooBaseUrl}${proxyPath}`;

//   const method = req.method;
//   const headers = new Headers(req.headers);
//   headers.set("host", "http://203.99.53.212:8069"); // Optional

//   let body: BodyInit | null = null;
//   if (method !== "GET" && method !== "HEAD") {
//     body = await req.text();
//   }

//   try {
//     const response = await fetch(targetUrl, {
//       method,
//       headers,
//       body: body ? body : undefined,
//     });

//     const contentType = response.headers.get("content-type") || "text/plain";
//     const responseBody = await response.text();

//     return new Response(responseBody, {
//       status: response.status,
//       headers: {
//         "content-type": contentType,
//       },
//     });
//   } catch (error) {
//     return new Response(`Error: ${error}`, { status: 500 });
//   }
// }
