import { expect, it, vi } from "vitest";
import type { GbifSpeciesMatchResponse } from "../types/gbif";
import { searchSpecies } from "./gbif";

it("accepts an EXACT match with confidence 95 and returns the mapped species", async () => {
  // Arrange
  const responseData: GbifSpeciesMatchResponse = {
    diagnostics: {
      matchType: "EXACT",
      confidence: 95,
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
  };
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fetchMock);

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
