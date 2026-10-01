import type { WikipediaSummaryResponse } from "../types/wikipedia";

export async function getSpeciesSummary(
  canonicalName: string,
): Promise<string> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(canonicalName)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch summary for ${canonicalName}: ${response.status} ${response.statusText}`,
    );
  }

  const data: WikipediaSummaryResponse = await response.json();

  if (!data.extract) {
    throw new Error("No summary found for the given canonical name");
  }

  return data.extract;
}
