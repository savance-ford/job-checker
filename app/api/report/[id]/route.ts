import { z } from "zod";

import { getScanReport } from "@/lib/supabase/reports";
import { SupabaseConfigurationError } from "@/lib/supabase/server";

const idSchema = z.uuid();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!idSchema.safeParse(id).success) {
    return Response.json({ error: "Report not found." }, { status: 404 });
  }

  try {
    const report = await getScanReport(id);

    if (!report) {
      return Response.json({ error: "Report not found." }, { status: 404 });
    }

    return Response.json(report);
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return Response.json({ error: error.message }, { status: 503 });
    }

    console.error("Report lookup failed", error);
    return Response.json(
      { error: "The report could not be loaded." },
      { status: 500 },
    );
  }
}
