import type { Species } from "../types/species";

type SpeciesCardProps = {
  species: Species;
};

function SpeciesCard({ species }: SpeciesCardProps) {
  return (
    <>
      <h2>{species.canonicalName}</h2>
      <p>{species.rank}</p>
      <ul>
        {species.classification.map((taxon) => (
          <li key={taxon.key}>
            {taxon.rank} | {taxon.name}
          </li>
        ))}
      </ul>
      {species.conservationStatus && (
        <p>Conservation Status: {species.conservationStatus}</p>
      )}
    </>
  );
}

export default SpeciesCard;
