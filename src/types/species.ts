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

// Internal/domain types used in the application

export type Species = {
  canonicalName: string;
  key: string;
  rank: string;
  conservationStatus?: string;
  classification: GbifSpeciesTaxon[];
  image: SpeciesImage | null;
};

export type SpeciesImage = {
  url: string;
  license: string;
  attribution: string;
};

// iNaturalist API response types

export type INaturalistSpeciesImage = {
  medium_url: string;
  license_code: string;
  attribution: string;
};

export type INaturalistTaxon = {
  id: number;
  is_active: boolean;
  name: string;
  rank: string;
  default_photo?: INaturalistSpeciesImage;
};

export type INaturalistTaxaResponse = {
  results: INaturalistTaxon[];
};
