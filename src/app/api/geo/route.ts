import { NextRequest, NextResponse } from "next/server";
import { countryName } from "@/data/countries";

export const dynamic = "force-dynamic";

/**
 * Edge/CDN country headers, in order of trust. Vercel sets the first one in
 * production; the Cloudflare and generic variants keep this working behind
 * other proxies and in local tunnels.
 */
const COUNTRY_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-country-code",
  "x-geo-country",
];

export async function GET(request: NextRequest) {
  let code: string | null = null;

  for (const header of COUNTRY_HEADERS) {
    const value = request.headers.get(header);
    if (value && /^[A-Za-z]{2}$/.test(value) && value.toUpperCase() !== "XX") {
      code = value.toUpperCase();
      break;
    }
  }

  return NextResponse.json(
    { country: code, countryName: countryName(code) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
