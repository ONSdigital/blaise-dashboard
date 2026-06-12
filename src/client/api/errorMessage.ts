export function extractResponseErrorMessage(
  reason: unknown,
  fallbackMessage: string,
): string {
  if (typeof reason === "object" && reason !== null && "response" in reason) {
    const response = (reason as { response?: { data?: unknown } }).response;
    if (typeof response?.data === "string" && response.data.trim().length > 0) {
      return response.data;
    }
  }

  return fallbackMessage;
}
