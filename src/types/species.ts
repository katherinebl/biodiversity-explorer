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
