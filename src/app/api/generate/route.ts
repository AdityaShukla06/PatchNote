import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workspaceId, dateFrom, dateTo, rawTickets } = body;

    if (!workspaceId || !dateFrom || !dateTo || !rawTickets) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are a product changelog writer. Given the following completed tickets and PRs, 
generate THREE versions of a changelog.

<tickets>
${JSON.stringify(rawTickets, null, 2)}
</tickets>

Respond ONLY with a valid JSON object. No markdown fences around the JSON. No preamble. Schema:
{
  "user_changelog": "markdown string - friendly, benefit-focused, no jargon",
  "dev_changelog": "markdown string - technical, references component names, breaking changes flagged",
  "exec_summary": "markdown string - 3-5 bullets max, outcome-focused, no feature names"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    let parsedData;
    
    try {
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleanText);
    } catch {
      console.error("Failed to parse Gemini output:", text);
      return new NextResponse("AI Output Error", { status: 500 });
    }

    const slug = `changelog-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substring(7)}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("changelogs").insert({
      workspace_id: workspaceId,
      date_from: dateFrom,
      date_to: dateTo,
      raw_tickets: rawTickets,
      user_changelog: parsedData.user_changelog,
      dev_changelog: parsedData.dev_changelog,
      exec_summary: parsedData.exec_summary,
      slug: slug
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return new NextResponse("Database error", { status: 500 });
    }

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Generate error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
