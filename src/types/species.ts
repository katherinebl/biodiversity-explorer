export type GbifSpeciesMatchResponse = { 
  additionalStatus?: {
    status: string,
  }[],

  classification: Taxon[],

  diagnostics: { 
    confidence: number, 
    matchType: string 
  },

  usage: {
    canonicalName: string,
    key: string,
    rank: string,
  },
}

export type Species = {
  canonicalName: string
  key: string
  rank: string
  conservationStatus?: string
  classification: Taxon[]
}
export type Taxon = {
  key: string
  name: string
  rank: string
}
