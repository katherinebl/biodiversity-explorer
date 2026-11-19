import { expect, it, vi } from "vitest";
import type {
  INaturalistTaxon,
  INaturalistTaxaResponse,
} from "../types/inaturalist";
import searchTaxon from "./inaturalist";

const createINaturalistTaxon = (): INaturalistTaxon => ({
  id: 5219404,
  is_active: true,
  name: "Panthera leo",
  rank: "species",
  observations_count: 125000,
  preferred_common_name: "Lion",
  wikipedia_url: "https://en.wikipedia.org/wiki/Lion",
  default_photo: {
    medium_url: "https://example.com/lion.jpg",
    license_code: "cc-by",
    attribution: "Example photographer",
    original_dimensions: {
      width: 1200,
      height: 800,
    },
  },
});

const mockINaturalistResponse = (data: INaturalistTaxaResponse) => {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
};

it("returns mapped species data when an exact taxon is found", async () => {
  // Arrange
  const taxon = createINaturalistTaxon();

  mockINaturalistResponse({
    results: [taxon],
  });

  // Act
  const species = await searchTaxon("Panthera leo", "SPECIES");

  // Assert
  expect(species).toEqual({
    commonName: "Lion",
    wikipediaURL: "https://en.wikipedia.org/wiki/Lion",
    iNaturalistObservations: 125000,
    image: {
      url: "https://example.com/lion.jpg",
      license: "cc-by",
      attribution: "Example photographer",
      originalDimensions: {
        width: 1200,
        height: 800,
      },
    },
  });
});

it("returns null when no taxon name matches the canonical name", async () => {
  // Arrange
  const leopard = {
    ...createINaturalistTaxon(),
    name: "Panthera pardus",
  };

  const tiger = {
    ...createINaturalistTaxon(),
    name: "Panthera tigris",
  };

  mockINaturalistResponse({
    results: [leopard, tiger],
  });

  // Act
  const species = await searchTaxon("Panthera leo", "SPECIES");

  // Assert
  expect(species).toBeNull();
});

it("selects the exact matching taxon among multiple results", async () => {
  // Arrange
  const leopard = {
    ...createINaturalistTaxon(),
    name: "Panthera pardus",
    preferred_common_name: "Leopard",
  };

  const lion = createINaturalistTaxon();

  mockINaturalistResponse({
    results: [leopard, lion],
  });

  // Act
  const species = await searchTaxon("Panthera leo", "SPECIES");

  // Assert
  expect(species?.commonName).toBe("Lion");
});

it("returns null when the API returns no taxa", async () => {
  // Arrange
  mockINaturalistResponse({
    results: [],
  });

  // Act
  const species = await searchTaxon("Panthera leo", "SPECIES");

  // Assert
  expect(species).toBeNull();
});

it("returns null image when default_photo is missing", async () => {
  // Arrange
  const taxon = createINaturalistTaxon();

  delete taxon.default_photo;

  mockINaturalistResponse({
    results: [taxon],
  });

  // Act
  const species = await searchTaxon("Panthera leo", "SPECIES");

  // Assert
  expect(species?.image).toBeNull();
});

it("handles missing optional common name and Wikipedia URL", async () => {
  // Arrange
  const taxon = createINaturalistTaxon();

  delete taxon.preferred_common_name;
  delete taxon.wikipedia_url;

  mockINaturalistResponse({
    results: [taxon],
  });

  // Act
  const species = await searchTaxon("Panthera leo", "SPECIES");

  // Assert
  expect(species?.commonName).toBeUndefined();
  expect(species?.wikipediaURL).toBeUndefined();
});

it("throws an error when the iNaturalist API returns HTTP 500", async () => {
  // Arrange
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(null, {
      status: 500,
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(searchTaxon("Panthera leo", "SPECIES")).rejects.toThrow(
    "Response status: 500",
  );
});

it("throws an error when the network request fails", async () => {
  // Arrange
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockRejectedValue(new TypeError("Failed to fetch"));

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(searchTaxon("Panthera leo", "SPECIES")).rejects.toThrow(
    "Failed to fetch",
  );
});

it("builds the correct iNaturalist request URL", async () => {
  // Arrange
  const taxon = createINaturalistTaxon();

  const fetchMock = mockINaturalistResponse({
    results: [taxon],
  });

  // Act
  await searchTaxon("Panthera leo", "SPECIES");

  // Assert
  expect(fetchMock).toHaveBeenCalledWith(
    "https://api.inaturalist.org/v1/taxa?q=Panthera%20leo&is_active=true&rank=species&order=desc&order_by=observations_count",
  );
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
