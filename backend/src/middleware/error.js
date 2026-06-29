export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, _next) {
  if (error instanceof Error && error.message.startsWith("Only image files")) {
    return res.status(400).json({ message: error.message });
  }

  if (error?.name === "MulterError") {
    return res.status(400).json({ message: error.message });
  }

  const status = error.statusCode || error.status || 500;
  const message = error.message || "Internal server error";
  if (status >= 500) {
    console.error(`[${req.method}] ${req.originalUrl}`, error);
  }
  return res.status(status).json({ message });
}
