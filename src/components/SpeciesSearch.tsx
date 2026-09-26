import { useState } from "react";
import { searchSpecies, NoReliableMatchError } from "../api/gbif";
import type { Species } from "../types/species";
import SpeciesCard from "./SpeciesCard";
import searchTaxon from "../api/inaturalist";
import "./SpeciesSearch.css";
import { resolveScientificName } from "../api/wikidata";

function SpeciesSearch() {
  const [data, setData] = useState<Species | null>(null);

  async function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("species-search") as HTMLInputElement;
    const query = input.value.trim();
    let gbifData;

    if (query) {
      try {
        gbifData = await searchSpecies(query);
      } catch (error) {
        if (error instanceof NoReliableMatchError) {
          const scientificName = await resolveScientificName(query);
          gbifData = await searchSpecies(scientificName);
        } else {
          console.error("Unexpected error occurred:", error);
          return;
        }
      }
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
    }
  }

  return (
    <div className="species-search">
      <form onSubmit={handleSearch} className="species-search-form">
        <label htmlFor="species-search" className="species-search-label">
          Search
        </label>
        <input
          id="species-search"
          type="search"
          placeholder="E.g. Panthera leo"
          className="species-search-input"
        />
        <button type="submit" className="species-search-button">
          Search
        </button>
      </form>

      {data && <SpeciesCard species={data} />}
    </div>
  );
}

export default SpeciesSearch;
