import type { GbifSpeciesMatchResponse } from "../types/gbif";
import type { GbifSpecies } from "../types/species";

export class NoReliableMatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoReliableMatchError";
  }
}

//adapter/mapping layer:
export async function searchSpecies(query: string): Promise<GbifSpecies> {
  const url = `https://api.gbif.org/v2/species/match?scientificName=${encodeURIComponent(query)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data: GbifSpeciesMatchResponse = await response.json();

  if (
    data.diagnostics.matchType !== "EXACT" ||
    data.diagnostics.confidence < 95
  ) {
    throw new NoReliableMatchError("No reliable exact match found");
  }

  const species: GbifSpecies = {
    canonicalName: data.usage.canonicalName,
    key: data.usage.key,
    rank: data.usage.rank,
    classification: data.classification.map((taxon) => {
      return {
        key: taxon.key,
        name: taxon.name,
        rank: taxon.rank,
      };
    }),
    conservationStatus: data.additionalStatus?.[0]?.status,
  };

  return species;
}
