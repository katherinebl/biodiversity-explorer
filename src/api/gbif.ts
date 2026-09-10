import type { GbifSpeciesMatchResponse, Species } from "../types/species"

async function searchSpecies(query: string) {
    const url = `https://api.gbif.org/v2/species/match?scientificName=${encodeURIComponent(query)}`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data: GbifSpeciesMatchResponse = await response.json()

        if(data.diagnostics.matchType !== 'EXACT' || data.diagnostics.confidence < 95) {
            throw new Error('No reliable exact match found')
        }

        const species: Species = {
            canonicalName: data.usage.canonicalName,
            key: data.usage.key,
            rank: data.usage.rank,
            classification: data.classification,
            conservationStatus: data.additionalStatus?.[0]?.status 
        }

        return species
    } catch (error) {
        console.error('Error fetching species data:', error)
        throw error
    }
}

export default searchSpecies