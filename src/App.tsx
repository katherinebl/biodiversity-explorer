import './App.css'
import SpeciesSearch from './components/SpeciesSearch'

function App() {
  return (
    <main className="app-shell">
      <header className="app-intro">
        <h1>Biodiversity Explorer</h1>
        <p>Search a species to see its classification and conservation status.</p>
      </header>
      <SpeciesSearch />
    </main>
  )
}

export default App
