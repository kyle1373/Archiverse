import { NextResponse, NextRequest } from "next/server";

// Middleware function
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pass through requests for Next.js static assets
  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Check if the request is for a static asset based on the file extension
  const fileExtensionPattern = /\.(png|jpg|jpeg|gif|mp4|webm|svg)$/i;

  if (fileExtensionPattern.test(pathname)) {
    // If the request is for a file, allow it to proceed
    return NextResponse.next();
  }

  const start = Date.now();

  const response = NextResponse.next();
  response.headers.set("X-Request-Start", start.toString());
  response.headers.set("X-Logging", "true");

  // Exclude the /maintenance path from the redirect
  if (pathname !== "/maintenance") {
    const maintenanceMode = false;
    if (maintenanceMode) {
      // Redirect to /maintenance
      return NextResponse.redirect(new URL("/maintenance", req.nextUrl.origin));
    }
  }

  return response;
}
