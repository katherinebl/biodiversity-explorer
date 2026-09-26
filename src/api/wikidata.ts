export class CommonNameNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommonNameNotFoundError";
  }
}

export class TaxonIsNotSpeciesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaxonIsNotSpeciesError";
  }
}

type WikidataResponse = {
  entities: {
    [key: string]: WikidataEntity;
  };
};

type WikidataEntity = {
  claims: {
    P225?: TaxonNameClaim[];
    P105?: TaxonRankClaim[];
  };
};

type TaxonNameClaim = {
  mainsnak: {
    datavalue: {
      value: string;
    };
  };
};

type TaxonRankClaim = {
  mainsnak: {
    datavalue: {
      value: {
        id: string;
      };
    };
  };
};

export async function resolveScientificName(query: string): Promise<string> {
  const SPECIES_RANK_ID = "Q7432";

  const url = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query)}&limit=5`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  const wikipediaTitle = data.pages[0]?.title;

  if (!wikipediaTitle) {
    throw new CommonNameNotFoundError(
      "No Wikipedia page found for the given query",
    );
  }

  const wikidataURL = `https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&titles=${encodeURIComponent(wikipediaTitle)}&props=claims&format=json&origin=*`;
  const wikidataResponse = await fetch(wikidataURL);
  const wikidataData: WikidataResponse = await wikidataResponse.json();

  const entity = Object.values(wikidataData.entities)[0];
  const scientificName = entity.claims.P225?.[0].mainsnak.datavalue.value;
  const taxonRank = entity.claims.P105?.[0].mainsnak.datavalue.value.id;

  if (!scientificName || !taxonRank) {
    throw new CommonNameNotFoundError(
      "No valid taxon found for the given query",
    );
  }

  if (taxonRank !== SPECIES_RANK_ID) {
    throw new TaxonIsNotSpeciesError("The resolved taxon is not a species");
  }

  return scientificName;
}
