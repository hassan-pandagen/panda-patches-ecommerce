import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { formType, rating, comment, pageUrl } = await req.json();

    if (!formType || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validRatings = ["easy", "okay", "difficult"];
    if (!validRatings.includes(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const { error } = await supabase.from("form_feedback").insert({
      form_type: formType,
      rating,
      comment: comment?.slice(0, 300) || null,
      page_url: pageUrl || null,
    });

    if (error) {
      console.error("Feedback insert error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
