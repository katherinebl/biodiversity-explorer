import type {
  INaturalistTaxaResponse,
  INaturalistTaxon,
  SpeciesImage,
} from "../types/species";

async function searchTaxa(
  canonicalName: string,
  rank: string,
): Promise<SpeciesImage | null> {
  const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(canonicalName)}&is_active=true&rank=${encodeURIComponent(rank.toLowerCase())}&order=desc&order_by=observations_count`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data: INaturalistTaxaResponse = await response.json();

    if (data.results.length > 0) {
      console.log("iNaturalist API response:", data);

      const foundTaxon: INaturalistTaxon | undefined = data.results.find(
        (taxon) => taxon.name === canonicalName,
      );
      console.log("Found taxon:", foundTaxon);

      const speciesImage: SpeciesImage | null = foundTaxon?.default_photo
        ? {
            url: foundTaxon.default_photo.medium_url,
            license: foundTaxon.default_photo.license_code,
            attribution: foundTaxon.default_photo.attribution,
          }
        : null;

      return speciesImage;
    }
  } catch (error) {
    console.error("Error fetching taxa data:", error);
    throw error;
  }

  return null;
}

export default searchTaxa;
