import { expect, it, vi } from "vitest";
import type { GbifSpeciesMatchResponse } from "../types/gbif";
import { NoReliableMatchError, searchSpecies } from "./gbif";

const createGbifResponse = (
  matchType = "EXACT",
  confidence = 95,
): GbifSpeciesMatchResponse => ({
  diagnostics: {
    matchType,
    confidence,
  },
  usage: {
    canonicalName: "Panthera leo",
    key: "5219404",
    rank: "SPECIES",
  },
  classification: [
    { key: "1", name: "Animalia", rank: "KINGDOM" },
    { key: "44", name: "Chordata", rank: "PHYLUM" },
    { key: "359", name: "Mammalia", rank: "CLASS" },
    { key: "732", name: "Carnivora", rank: "ORDER" },
    { key: "9703", name: "Felidae", rank: "FAMILY" },
    { key: "2435194", name: "Panthera", rank: "GENUS" },
    { key: "5219404", name: "Panthera leo", rank: "SPECIES" },
  ],
  additionalStatus: [{ status: "VULNERABLE" }],
});

const mockGbifResponse = (data: GbifSpeciesMatchResponse) => {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
};

it("accepts an EXACT match with confidence 95 and returns the mapped species", async () => {
  // Arrange
  const responseData = createGbifResponse();
  mockGbifResponse(responseData);

  // Act
  const species = await searchSpecies("Panthera leo");

  // Assert
  expect(species).toEqual({
    canonicalName: "Panthera leo",
    key: "5219404",
    rank: "SPECIES",
    classification: [
      { key: "1", name: "Animalia", rank: "KINGDOM" },
      { key: "44", name: "Chordata", rank: "PHYLUM" },
      { key: "359", name: "Mammalia", rank: "CLASS" },
      { key: "732", name: "Carnivora", rank: "ORDER" },
      { key: "9703", name: "Felidae", rank: "FAMILY" },
      { key: "2435194", name: "Panthera", rank: "GENUS" },
      { key: "5219404", name: "Panthera leo", rank: "SPECIES" },
    ],
    conservationStatus: "VULNERABLE",
  });
});

it("rejects an EXACT match with confidence below 95", async () => {
  // Arrange
  const responseData = createGbifResponse("EXACT", 94);
  mockGbifResponse(responseData);

  // Act & Assert
  await expect(searchSpecies("Panthera leo")).rejects.toThrow(
    NoReliableMatchError,
  );
});

it("rejects a non-EXACT match even with high confidence", async () => {
  // Arrange
  const responseData = createGbifResponse("FUZZY", 100);
  mockGbifResponse(responseData);

  // Act & Assert
  await expect(searchSpecies("Panthera leo")).rejects.toThrow(
    NoReliableMatchError,
  );
});

it("throws an error when GBIF returns HTTP 500", async () => {
  // Arrange
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(null, {
      status: 500,
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(searchSpecies("Panthera leo")).rejects.toThrow(
    "Response status: 500",
  );
});

it("throws an error when there is a network error", async () => {
  // Arrange
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockRejectedValue(new TypeError("Failed to fetch"));

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(searchSpecies("Panthera leo")).rejects.toThrow(
    "Failed to fetch",
  );
});

it("returns undefined conservation status when additionalStatus is missing", async () => {
  // Arrange
  const responseData = createGbifResponse();

  delete responseData.additionalStatus;

  mockGbifResponse(responseData);

  // Act
  const species = await searchSpecies("Panthera leo");

  // Assert
  expect(species.conservationStatus).toBeUndefined();
});

it("returns undefined conservation status when additionalStatus is empty", async () => {
  // Arrange
  const responseData = createGbifResponse();

  responseData.additionalStatus = [];

  mockGbifResponse(responseData);

  // Act
  const species = await searchSpecies("Panthera leo");

  // Assert
  expect(species.conservationStatus).toBeUndefined();
});

it("selects the first conservation status when multiple statuses exist", async () => {
  // Arrange
  const responseData = createGbifResponse();

  responseData.additionalStatus = [
    { status: "VULNERABLE" },
    { status: "ENDANGERED" },
    { status: "LEAST_CONCERN" },
  ];

  mockGbifResponse(responseData);

  // Act
  const species = await searchSpecies("Panthera leo");

  // Assert
  expect(species.conservationStatus).toBe("VULNERABLE");
});

it("encodes the scientific name in the GBIF request URL", async () => {
  // Arrange
  const responseData = createGbifResponse();
  const fetchMock = mockGbifResponse(responseData);

  // Act
  await searchSpecies("Panthera leo");

  // Assert
  expect(fetchMock).toHaveBeenCalledWith(
    "https://api.gbif.org/v2/species/match?scientificName=Panthera%20leo",
  );
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
