import type { Species } from "../types/species";
import "./SpeciesCard.css";

type SpeciesCardProps = {
  species: Species;
};

function SpeciesCard({ species }: SpeciesCardProps) {
  return (
    <article className="species-card">
      {species.image && (
        <div className="species-image-container">
          <img
            src={species.image.url}
            alt={species.canonicalName}
            width={species.image.originalDimensions.width}
            height={species.image.originalDimensions.height}
          />
          <p className="image-credit">
            Image License: {species.image.license} | Attribution: {species.image.attribution}
          </p>
        </div>
      )}
        <div className="species-details-container">
          <header className="species-card-header">
            <h2>{species.commonName ?? species.canonicalName}</h2>
            {species.commonName && (
              <p className="canonical-name">{species.canonicalName}</p>
            )}
          </header>

          {species.conservationStatus && (
            <section className="species-card-section">
              <div className="section-heading">
                <h3>Conservation status</h3>
              </div>
              <p className="status-value">{species.conservationStatus}</p>
            </section>
          )}

          {species.iNaturalistObservations > 0 && (
            <section className="species-card-section">
              <h3>Observations</h3>
              <p>
                {species.iNaturalistObservations.toLocaleString()} observations
                on iNaturalist
              </p>
            </section>
          )}

          {species.wikipediaURL && (
            <section className="species-card-section">
              <h3>More information</h3>
              <a
                href={species.wikipediaURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Wikipedia
              </a>
            </section>
          )}
        </div>
      <section className="species-taxonomy-section">
        <h3>Taxonomy</h3>
        <ul className="classification-list">
          {species.classification.map((taxon) => (
            <li key={taxon.key} className="classification-item">
              <span className="classification-rank">{taxon.rank}</span>
              <span
                className={`classification-name${
                  ["GENUS", "SPECIES"].includes(taxon.rank.toUpperCase())
                    ? " classification-scientific-name"
                    : ""
                }`}
              >
                {taxon.name}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export default SpeciesCard;
