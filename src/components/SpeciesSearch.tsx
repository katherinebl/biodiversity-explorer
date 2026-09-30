import { useState } from "react";
import { searchSpecies, NoReliableMatchError } from "../api/gbif";
import type { GbifSpecies, Species } from "../types/species";
import SpeciesCard from "./SpeciesCard";
import searchTaxon from "../api/inaturalist";
import "./SpeciesSearch.css";
import {
  CommonNameNotFoundError,
  resolveScientificName,
  TaxonIsNotSpeciesError,
} from "../api/wikidata";
import InfoIcon from "./InfoIcon";

async function resolveSpecies(query: string): Promise<GbifSpecies> {
  try {
    return await searchSpecies(query);
  } catch (error) {
    if (error instanceof NoReliableMatchError) {
      const scientificName = await resolveScientificName(query);
      return await searchSpecies(scientificName);
    }
    throw error;
  }
}

function SpeciesSearch() {
  const [data, setData] = useState<Species | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("species-search") as HTMLInputElement;
    const query = input.value.trim();
    let gbifData;

    if (query) {
      setError(null);
      setData(null);

      try {
        gbifData = await resolveSpecies(query);
      } catch (error) {
        if (
          error instanceof TaxonIsNotSpeciesError ||
          error instanceof CommonNameNotFoundError
        ) {
          setError(
            "We couldn't find a species matching your search. Try a scientific name or a more specific common name.",
          );
          return;
        }

        throw error;
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
      {error && (
        <>
          <p role="alert" className="species-search-error">
            <InfoIcon />
            {error}
          </p>
        </>
      )}
    </div>
  );
}

export default SpeciesSearch;
