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
