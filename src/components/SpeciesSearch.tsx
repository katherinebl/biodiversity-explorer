import searchSpecies from "../api/gbif"

function SpeciesSearch() {
	return (
		<form onSubmit={handleSearch}>
			<label htmlFor="species-search">Search</label>
			<input id="species-search" type="search" />
			<button type="submit">Search</button>
		</form>
	)
}

async function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const input = form.elements.namedItem('species-search') as HTMLInputElement
    const query = input.value.trim()
    if (query) {
        console.log(`Searching for species: ${query}`)
        const data = await searchSpecies(query)
        console.log('Search results:', data)
    }
}

export default SpeciesSearch
