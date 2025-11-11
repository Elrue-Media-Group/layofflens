import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LayoffData {
  companyName?: string;
  layoffCount?: number;
  sector?: string;
}

/**
 * Extract layoff information from news article title and snippet using OpenAI
 */
export async function extractLayoffData(title: string, snippet: string): Promise<LayoffData> {
  try {
    const prompt = `Analyze this news article and extract layoff information. Return ONLY a JSON object with these fields:
- companyName: The company name if mentioned (null if not a specific company layoff)
- layoffCount: Number of employees laid off as an integer (null if not specified)
- sector: Industry sector from this list: Tech, Finance, Retail, Healthcare, Manufacturing, Energy, Transportation, Hospitality, Education, Media, Other (null if unclear)

Article:
Title: ${title}
Snippet: ${snippet}

Rules:
- Only extract if the article is ACTUALLY about layoffs/job cuts
- If it's general job market news or tips, return all nulls
- Be conservative with layoffCount - only include if a specific number is mentioned
- Use null for any field you're not confident about

Return only valid JSON, no explanation.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a data extraction assistant. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1, // Low temperature for consistent extraction
      max_tokens: 150,
    });

    const responseText = completion.choices[0]?.message?.content?.trim();
    if (!responseText) {
      return {};
    }

    // Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
    let jsonText = responseText;
    if (jsonText.startsWith("```")) {
      // Remove opening ```json or ```
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "");
      // Remove closing ```
      jsonText = jsonText.replace(/\n?```$/, "");
      jsonText = jsonText.trim();
    }

    // Parse JSON response
    const data = JSON.parse(jsonText);

    // Validate and clean the data
    const result: LayoffData = {};

    if (data.companyName && typeof data.companyName === "string") {
      result.companyName = data.companyName;
    }

    if (data.layoffCount && typeof data.layoffCount === "number" && data.layoffCount > 0) {
      result.layoffCount = Math.floor(data.layoffCount);
    }

    if (data.sector && typeof data.sector === "string") {
      result.sector = data.sector;
    }

    return result;
  } catch (error: any) {
    // Log error but don't fail the entire fetch process
    console.error("Error extracting layoff data:", error.message);
    return {};
  }
}
