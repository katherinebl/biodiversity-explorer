// Wikidata API response types

export type WikidataResponse = {
  entities: {
    [key: string]: WikidataEntity;
  };
};

export type WikidataEntity = {
  claims: {
    P225?: TaxonNameClaim[];
    P105?: TaxonRankClaim[];
  };
};

export type TaxonNameClaim = {
  mainsnak: {
    datavalue: {
      value: string;
    };
  };
};

export type TaxonRankClaim = {
  mainsnak: {
    datavalue: {
      value: {
        id: string;
      };
    };
  };
};
