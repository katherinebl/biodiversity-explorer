import type { Species } from "../types/species";
import "./SpeciesCard.css";

type SpeciesCardProps = {
  species: Species;
};

function SpeciesCard({ species }: SpeciesCardProps) {
  return (
    <>
      <h2>{species.commonName ?? species.canonicalName}</h2>
      {species.commonName && (
        <p className="canonical-name">{species.canonicalName}</p>
      )}
      <div className="species-card">
        <div className="species-image-container">
          {species.image && (
            <div>
              <img src={species.image.url} alt={species.canonicalName} />
              <p>
                Image License: {species.image.license} | Attribution:{" "}
                {species.image.attribution}
              </p>
            </div>
          )}
        </div>

        <div className="species-details-container">
          <h3>TAXONOMY</h3>
          <ul className="classification-list">
            {species.classification.map((taxon) => (
              <li key={taxon.key} className="classification-item">
                <span className="classification-rank">{taxon.rank}</span>{" "}
                <span className="classification-name">{taxon.name}</span>
              </li>
            ))}
          </ul>

          {species.conservationStatus && (
            <>
              <h3>CONSERVATION STATUS</h3>
              <p>{species.conservationStatus}</p>
            </>
          )}

          {species.iNaturalistObservations > 0 && (
            <>
              <h3>OBSERVATIONS</h3>
              <p>
                {species.iNaturalistObservations.toLocaleString()} observations
                on iNaturalist
              </p>
            </>
          )}

          {species.wikipediaURL && (
            <>
              <h3>MORE INFORMATION</h3>
              <a
                href={species.wikipediaURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Wikipedia
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SpeciesCard;
