import { NextResponse, NextRequest } from 'next/server';

// Middleware function
export async function middleware(req: NextRequest) {
    const start = Date.now();
  
    const response = NextResponse.next();
  
    response.headers.set('X-Request-Start', start.toString());
    response.headers.set('X-Logging', "true");


    return response;
}