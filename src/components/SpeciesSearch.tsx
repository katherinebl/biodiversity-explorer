function SpeciesSearch() {
	return (
		<form onSubmit={handleSearch}>
			<label htmlFor="species-search">Search</label>
			<input id="species-search" type="search" />
			<button type="submit">Search</button>
		</form>
	)
}

function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const input = form.elements.namedItem('species-search') as HTMLInputElement
    const query = input.value.trim()
    if (query) {
        console.log(`Searching for species: ${query}`)
        // Here you would typically make an API call to fetch species data
    }
}

export default SpeciesSearch
