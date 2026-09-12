import { useState } from "react";
import searchSpecies from "../api/gbif";
import type { Species } from "../types/species";

function SpeciesSearch() {
  const [data, setData] = useState<Species | null>(null);

  async function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("species-search") as HTMLInputElement;
    const query = input.value.trim();

    if (query) {
      console.log(`Searching for species: ${query}`);
      const result = await searchSpecies(query);
      setData(result);
    }
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <label htmlFor="species-search">Search</label>
        <input id="species-search" type="search" />
        <button type="submit">Search</button>
      </form>

      {data && <p>{data.canonicalName}</p>}
    </>
  );
}

export default SpeciesSearch;
