//GBIF Species API response types

export type GbifSpeciesMatchResponse = {
  additionalStatus?: {
    status: string;
  }[];

  classification: GbifSpeciesTaxon[];

  diagnostics: {
    confidence: number;
    matchType: string;
  };

  usage: {
    canonicalName: string;
    key: string;
    rank: string;
  };
};

export type GbifSpeciesTaxon = {
  key: string;
  name: string;
  rank: string;
};
