const CONTENT_PROXY_URL = process.env.NEXT_PUBLIC_IMAGE_PREFIX;

export const getContentUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder.svg';

  // Если путь уже является полным URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (!CONTENT_PROXY_URL) {
    console.warn(
      'NEXT_PUBLIC_IMAGE_PREFIX is not defined in environment variables'
    );
    return path;
  }

  // Если путь начинается с '/', убираем его для корректного соединения с базовым URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${CONTENT_PROXY_URL}/${cleanPath}`;
};
