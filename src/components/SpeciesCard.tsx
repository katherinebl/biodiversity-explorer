import type { Species } from "../types/species";
import "./SpeciesCard.css";

type SpeciesCardProps = {
  species: Species;
};

function SpeciesCard({ species }: SpeciesCardProps) {
  return (
    <>
      <h2>{species.canonicalName}</h2>
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
        </div>
      </div>
    </>
  );
}

export default SpeciesCard;
