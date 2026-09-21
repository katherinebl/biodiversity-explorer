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

export type GbifSpecies = {
  canonicalName: string;
  key: string;
  rank: string;
  conservationStatus?: string;
  classification: GbifSpeciesTaxon[];
};

export type INaturalistSpecies = {
  commonName?: string;
  wikipediaURL?: string;
  iNaturalistObservations: number;
  image: SpeciesImage | null;
};

export type SpeciesImage = {
  url: string;
  license: string;
  attribution: string;
  originalDimensions: {
    width: number;
    height: number;
  };
};

export type Species = GbifSpecies & INaturalistSpecies;

// iNaturalist API response types

export type INaturalistTaxaResponse = {
  results: INaturalistTaxon[];
};

export type INaturalistTaxon = {
  id: number;
  is_active: boolean;
  name: string;
  rank: string;
  default_photo?: INaturalistSpeciesImage;
  preferred_common_name?: string;
  wikipedia_url?: string;
  observations_count: number;
};

export type INaturalistSpeciesImage = {
  medium_url: string;
  license_code: string;
  attribution: string;
  original_dimensions: {
    width: number;
    height: number;
  };
};
