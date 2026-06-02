type LogContext = Record<string, string | number | boolean | null | undefined>;

function errorDetails(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      cause:
        error.cause instanceof Error
          ? { name: error.cause.name, message: error.cause.message }
          : undefined,
    };
  }

  return {
    name: "UnknownError",
    message: String(error),
  };
}

export function logServerError(
  event: string,
  error: unknown,
  context: LogContext = {},
) {
  console.error(
    JSON.stringify({
      level: "error",
      event,
      context,
      error: errorDetails(error),
    }),
  );
}
