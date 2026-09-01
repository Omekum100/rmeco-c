export function isDatabaseSetupError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("database_url") ||
    message.includes("can't reach database server") ||
    message.includes("cannot reach database server") ||
    message.includes("connection refused") ||
    message.includes("authentication failed")
  );
}
