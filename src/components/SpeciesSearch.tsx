import { useState } from "react";
import searchSpecies from "../api/gbif";
import type { Species } from "../types/species";
import SpeciesCard from "./SpeciesCard";
import searchTaxon from "../api/inaturalist";

function SpeciesSearch() {
  const [data, setData] = useState<Species | null>(null);
  console.log("Species data:", data);

  async function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("species-search") as HTMLInputElement;
    const query = input.value.trim();

    if (query) {
      console.log(`Searching for species: ${query}`);
      const gbifData = await searchSpecies(query);
      const iNaturalistData = await searchTaxon(
        gbifData.canonicalName,
        gbifData.rank,
      );
      const safeINaturalistData = iNaturalistData ?? {
        iNaturalistObservations: 0,
        image: null,
      };

      setData({
        ...gbifData,
        ...safeINaturalistData,
      });

      const canonicalName = gbifData?.canonicalName;
      const rank = gbifData?.rank;

      if (canonicalName && rank) {
        console.log(
          `Searching for taxa with canonical name: ${canonicalName} and rank: ${rank}`,
        );
        const taxaResult = await searchTaxon(canonicalName, rank);
        console.log("iNaturalist taxa search result:", taxaResult);
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <label htmlFor="species-search">Search</label>
        <input id="species-search" type="search" />
        <button type="submit">Search</button>
      </form>

      {data && <SpeciesCard species={data} />}
    </>
  );
}

export default SpeciesSearch;
