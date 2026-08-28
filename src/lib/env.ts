const rawBaseUrl = process.env.NEXT_PUBLIC_MOCK_API_BASE_URL;

function resolveBaseUrl(value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(
      "NEXT_PUBLIC_MOCK_API_BASE_URL is not set. Copy .env.example to .env.local and provide the MockAPI base URL.",
    );
  }

  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    throw new Error(
      `NEXT_PUBLIC_MOCK_API_BASE_URL is not a valid URL: "${value}".`,
    );
  }
}

export const env = {
  mockApiBaseUrl: resolveBaseUrl(rawBaseUrl),
} as const;
