import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);
    const allowedHosts = ["magsrv.com", "a.magsrv.com", "racketgutter.com", "yearlybeak.com", "adsterra.com"];
    
    const isAllowed = allowedHosts.some((host) => parsed.hostname.endsWith(host));
    if (!isAllowed) {
      return new NextResponse("Forbidden target host", { status: 403 });
    }

    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || "";

    const headers: Record<string, string> = {
      "User-Agent": request.headers.get("user-agent") || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "*/*",
      "Accept-Language": request.headers.get("accept-language") || "en-US,en;q=0.9",
    };

    if (clientIp) {
      headers["X-Forwarded-For"] = clientIp;
      headers["X-Real-IP"] = clientIp.split(",")[0].trim();
    }

    const res = await fetch(targetUrl, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return new NextResponse(`Failed to fetch target script (${res.status})`, { status: res.status });
    }

    let contentType = res.headers.get("content-type") || "application/javascript";
    let body = await res.text();

    // Replace hardcoded domain references inside script if necessary
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=1800, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new NextResponse("Proxy Error", { status: 500 });
  }
}
