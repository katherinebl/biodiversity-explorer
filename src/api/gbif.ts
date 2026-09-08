async function searchSpecies(query: string) {
    const url = `https://api.gbif.org/v2/species/match?scientificName=${encodeURIComponent(query)}`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching species data:', error)
        throw error
    }
}

export default searchSpecies