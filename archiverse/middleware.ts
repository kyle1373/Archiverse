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

  const maintenanceMode = false; // Set this to false or true based on your requirements

  // Maintenance mode logic
  if (maintenanceMode) {
    if (pathname !== "/maintenance") {
      // Redirect to /maintenance if the current path is not /maintenance
      return NextResponse.redirect(new URL("/maintenance", req.nextUrl.origin));
    }
  } else {
    // Redirect to base directory if the current path is /maintenance
    if (pathname === "/maintenance") {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  return response;
}
