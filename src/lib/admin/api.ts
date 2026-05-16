import { NextResponse } from "next/server";
import type { ApiResult } from "@/lib/content/types";

export function ok<T>(data: T) {
  return NextResponse.json<ApiResult<T>>({ ok: true, data });
}

export function fail(error: string, status = 400) {
  return NextResponse.json<ApiResult<never>>({ ok: false, error }, { status });
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unexpected error";
}
