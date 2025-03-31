import { NextRequest } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://med-analytics-2.dev.reflectai.pro";

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  console.log("Request method:", request.method);
  console.log("Request path:", request.nextUrl.pathname);

  const pathname = request.nextUrl.pathname;
  const apiPath = pathname.replace("/api", "");

  const url = new URL(apiPath, BACKEND_URL);
  url.search = request.nextUrl.search;

  console.log("Proxying to:", url.toString());

  try {
    let body = null;
    if (request.body) {
      body = await request.clone().text(); // клонируем запрос, чтобы не потерять тело
    }

    const response = await fetch(url.toString(), {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        host: new URL(BACKEND_URL).host,
      },
      body: body,
      //@ts-ignore
      duplex: "half" as const,
    });

    console.log("Backend response status:", response.status);
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Detailed error:", error);
    return new Response(
      //@ts-ignore
      JSON.stringify({ error: "Proxy error", details: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
