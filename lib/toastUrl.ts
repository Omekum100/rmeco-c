export function withToast(path: string, message: string, tone: "success" | "error" = "success") {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}toast=${tone}&message=${encodeURIComponent(message)}`;
}
