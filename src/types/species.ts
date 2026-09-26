// Internal/domain types used in the application

export type GbifSpecies = {
  canonicalName: string;
  key: string;
  rank: string;
  conservationStatus?: string;
  classification: Taxon[];
};

export type Taxon = {
  key: string;
  name: string;
  rank: string;
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
