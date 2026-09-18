import type {
  INaturalistSpecies,
  INaturalistTaxaResponse,
  INaturalistTaxon,
} from "../types/species";

async function searchTaxon(
  canonicalName: string,
  rank: string,
): Promise<INaturalistSpecies | null> {
  const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(canonicalName)}&is_active=true&rank=${encodeURIComponent(rank.toLowerCase())}&order=desc&order_by=observations_count`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data: INaturalistTaxaResponse = await response.json();

    const foundTaxon: INaturalistTaxon | undefined = data.results.find(
      (taxon) => taxon.name === canonicalName,
    );

    if (!foundTaxon) {
      return null;
    }

    const species: INaturalistSpecies = {
      commonName: foundTaxon.preferred_common_name,
      wikipediaURL: foundTaxon.wikipedia_url,
      iNaturalistObservations: foundTaxon.observations_count,
      image: foundTaxon.default_photo
        ? {
            url: foundTaxon.default_photo.medium_url,
            license: foundTaxon.default_photo.license_code,
            attribution: foundTaxon.default_photo.attribution,
          }
        : null,
    };

    return species;
  } catch (error) {
    console.error("Error fetching taxa data:", error);
    throw error;
  }
}

export default searchTaxon;
