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
import { getSpeciesSummary } from "../api/wikipedia";
import SpeciesCardSkeleton from "./SpeciesCardSkeleton";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("species-search") as HTMLInputElement;
    const query = input.value.trim();

    setError(null);
    setData(null);

    if (!query) {
      return;
    }

    setIsLoading(true);

    try {
      const gbifData = await resolveSpecies(query);
      const iNaturalistData = await searchTaxon(
        gbifData.canonicalName,
        gbifData.rank,
      );

      const safeINaturalistData = iNaturalistData ?? {
        iNaturalistObservations: 0,
        image: null,
      };

      let summary: string | null = null;

      try {
        summary = await getSpeciesSummary(gbifData.canonicalName);
      } catch (error) {
        console.error(
          `Failed to fetch summary for ${gbifData.canonicalName}:`,
          error,
        );
      }

      setData({
        ...gbifData,
        ...safeINaturalistData,
        summary: summary,
      });
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
    } finally {
      setIsLoading(false);
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
        <button
          type="submit"
          className="species-search-button"
          disabled={isLoading}
        >
          Search
        </button>
      </form>

      {isLoading && <SpeciesCardSkeleton />}
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
