import { NextRequest } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_URL || 'https://med-analytics-2.dev.reflectai.pro';

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
  console.log('Request method:', request.method);
  console.log('Request path:', request.nextUrl.pathname);

  const pathname = request.nextUrl.pathname;
  const apiPath = pathname.replace('/api', '');

  const url = new URL(apiPath, BACKEND_URL);
  url.search = request.nextUrl.search;

  console.log('Proxying to:', url.toString());

  try {
    let body = null;
    if (request.body) {
      body = await request.clone().text(); // клонируем запрос, чтобы не потерять тело
    }

    // Фильтруем проблемные заголовки
    const filteredHeaders = filterHeaders(request.headers);
    // Добавляем host заголовок вручную
    filteredHeaders.set('host', new URL(BACKEND_URL).host);

    const response = await fetch(url.toString(), {
      method: request.method,
      headers: filteredHeaders,
      body: body,
      //@ts-ignore
      duplex: 'half' as const,
    });

    console.log('Backend response status:', response.status);
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return new Response(
      //@ts-ignore
      JSON.stringify({ error: 'Proxy error', details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * Фильтрует проблемные HTTP-заголовки, которые не следует передавать в fetch
 */
function filterHeaders(headers: Headers): Headers {
  const filteredHeaders = new Headers();
  
  // Список заголовков, которые следует исключить
  const forbiddenHeaders = [
    'connection',
    'content-length',
    'host',
    'transfer-encoding',
    'upgrade',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailer',
    'sec-fetch-dest',
    'sec-fetch-mode',
    'sec-fetch-site',
  ].map(h => h.toLowerCase());

  // Копируем все заголовки, кроме исключенных
  headers.forEach((value, key) => {
    if (!forbiddenHeaders.includes(key.toLowerCase())) {
      filteredHeaders.append(key, value);
    }
  });

  return filteredHeaders;
}
