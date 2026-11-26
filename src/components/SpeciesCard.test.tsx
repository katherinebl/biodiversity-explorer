import { it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import type { Species } from "../types/species";
import SpeciesCard from "./SpeciesCard";

const createSpecies = (): Species => ({
  canonicalName: "Panthera leo",
  commonName: "Lion",
  key: "12345",
  rank: "species",
  conservationStatus: "Vulnerable",
  classification: [
    { key: "1", name: "Animalia", rank: "kingdom" },
    { key: "2", name: "Chordata", rank: "phylum" },
    { key: "3", name: "Mammalia", rank: "class" },
    { key: "4", name: "Carnivora", rank: "order" },
    { key: "5", name: "Felidae", rank: "family" },
    { key: "6", name: "Panthera", rank: "genus" },
    { key: "7", name: "Panthera leo", rank: "species" },
  ],
  iNaturalistObservations: 1000,
  image: {
    url: "https://example.com/lion.jpg",
    license: "CC BY-SA 4.0",
    attribution: "Jane Doe",
    originalDimensions: {
      width: 800,
      height: 600,
    },
  },
  summary:
    "The lion is a species in the family Felidae and a member of the genus Panthera.",
  wikipediaURL: "https://en.wikipedia.org/wiki/Lion",
});

it("renders the common name and scientific name", () => {
  // Arrange
  const species = createSpecies();

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  expect(
    screen.getByRole("heading", { name: "Lion", level: 2 }),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Panthera leo", {
      selector: "p",
    }),
  ).toBeInTheDocument();
});

it("renders the scientific name as the heading when the common name is missing", () => {
  // Arrange
  const species = createSpecies();
  delete species.commonName;

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  expect(
    screen.getByRole("heading", { name: "Panthera leo", level: 2 }),
  ).toBeInTheDocument();

  expect(screen.queryByText("Lion")).not.toBeInTheDocument();

  expect(
    screen.queryByText("Panthera leo", { selector: "p" }),
  ).not.toBeInTheDocument();
});

it("renders the species image with its attributes and credits", () => {
  // Arrange
  const species = createSpecies();

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  const image = screen.getByRole("img", { name: "Panthera leo" });

  expect(image).toHaveAttribute("src", "https://example.com/lion.jpg");
  expect(image).toHaveAttribute("width", "800");
  expect(image).toHaveAttribute("height", "600");
  expect(image).toHaveAttribute("alt", "Panthera leo");
  expect(
    screen.getByText("Image License: CC BY-SA 4.0 | Attribution: Jane Doe"),
  ).toBeInTheDocument();
});

it("does not render the image or its credits when the image is missing", () => {
  // Arrange
  const species = createSpecies();
  species.image = null;

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(
    screen.queryByText("Image License: CC BY-SA 4.0 | Attribution: Jane Doe"),
  ).not.toBeInTheDocument();
});

it("renders the species summary when available", () => {
  // Arrange
  const species = createSpecies();

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  expect(
    screen.getByRole("heading", { name: "About", level: 3 }),
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      "The lion is a species in the family Felidae and a member of the genus Panthera.",
    ),
  ).toBeInTheDocument();
});

it("does not render the summary section when the summary is missing", () => {
  // Arrange
  const species = createSpecies();
  species.summary = null;

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  expect(
    screen.queryByRole("heading", { name: "About", level: 3 }),
  ).not.toBeInTheDocument();

  expect(
    screen.queryByText(
      "The lion is a species in the family Felidae and a member of the genus Panthera.",
    ),
  ).not.toBeInTheDocument();
});

it("renders the conservation status when available", () => {
  // Arrange
  const species = createSpecies();

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  expect(
    screen.getByRole("heading", { name: "Conservation status", level: 3 }),
  ).toBeInTheDocument();

  expect(screen.getByText("Vulnerable")).toBeInTheDocument();
});

it("does not render the conservation status when it is missing", () => {
  // Arrange
  const species = createSpecies();
  delete species.conservationStatus;

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  expect(
    screen.queryByRole("heading", { name: "Conservation status", level: 3 }),
  ).not.toBeInTheDocument();

  expect(screen.queryByText("Vulnerable")).not.toBeInTheDocument();
});

it("renders the formatted observation count when greater than zero", () => {
  // Arrange
  const species = createSpecies();
  const formattedCount = species.iNaturalistObservations.toLocaleString();

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  expect(
    screen.getByRole("heading", { name: "Observations", level: 3 }),
  ).toBeInTheDocument();

  expect(
    screen.getByText(`${formattedCount} observations on iNaturalist`),
  ).toBeInTheDocument();
});

it("does not render the observations section when the count is zero", () => {
  // Arrange
  const species = createSpecies();
  species.iNaturalistObservations = 0;

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  expect(
    screen.queryByRole("heading", { name: "Observations", level: 3 }),
  ).not.toBeInTheDocument();

  expect(
    screen.queryByText("observations on iNaturalist", { exact: false }),
  ).not.toBeInTheDocument();
});

it("renders the Wikipedia link when available", () => {
  // Arrange
  const species = createSpecies();

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  const heading = screen.getByRole("heading", {
    name: "More information",
    level: 3,
  });

  const link = screen.getByRole("link", { name: "View on Wikipedia" });

  expect(heading).toBeInTheDocument();
  expect(link).toHaveAttribute("href", "https://en.wikipedia.org/wiki/Lion");
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
});

it("does not render the Wikipedia link when the URL is missing", () => {
  // Arrange
  const species = createSpecies();
  delete species.wikipediaURL;

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  const heading = screen.queryByRole("heading", {
    name: "More information",
    level: 3,
  });

  const link = screen.queryByRole("link", { name: "View on Wikipedia" });

  expect(heading).not.toBeInTheDocument();
  expect(link).not.toBeInTheDocument();
});

it("renders the species taxonomic classification", () => {
  // Arrange
  const species = createSpecies();

  // Act
  render(<SpeciesCard species={species} />);

  // Assert
  const heading = screen.getByRole("heading", {
    name: "Taxonomy",
    level: 3,
  });
  const list = screen.getByRole("list");
  const items = within(list).getAllByRole("listitem");

  expect(heading).toBeInTheDocument();
  expect(list).toBeInTheDocument();
  expect(items).toHaveLength(species.classification.length);

  species.classification.forEach((taxon, index) => {
    const item = items[index];

    expect(within(item).getByText(taxon.rank)).toBeInTheDocument();
    expect(within(item).getByText(taxon.name)).toBeInTheDocument();
  });
});
