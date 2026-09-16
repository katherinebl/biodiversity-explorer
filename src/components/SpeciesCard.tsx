import type { Species } from "../types/species";
import "./SpeciesCard.css";

type SpeciesCardProps = {
  species: Species;
};

function SpeciesCard({ species }: SpeciesCardProps) {
  return (
    <>
      <h2>{species.canonicalName}</h2>
      <p>{species.rank}</p>
      <ul className="classification-list">
        {species.classification.map((taxon) => (
          <li key={taxon.key} className="classification-item">
            <span className="classification-rank">{taxon.rank}</span>{" "}
            <span className="classification-name">{taxon.name}</span>
          </li>
        ))}
      </ul>
      {species.conservationStatus && (
        <p>Conservation Status: {species.conservationStatus}</p>
      )}
      {species.image && (
        <div>
          <img src={species.image.url} alt={species.canonicalName} />
          <p>
            Image License: {species.image.license} | Attribution:{" "}
            {species.image.attribution}
          </p>
        </div>
      )}
    </>
  );
}

export default SpeciesCard;
