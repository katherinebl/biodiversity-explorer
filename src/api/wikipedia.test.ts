import { expect, it, vi } from "vitest";
import { getSpeciesSummary } from "./wikipedia";

it("returns the species summary when Wikipedia provides an extract", async () => {
  // Arrange
  const wikipediaResponse = {
    extract: "The lion is a large cat native to Africa and India.",
  };

  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(JSON.stringify(wikipediaResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  // Act
  const speciesSummary = await getSpeciesSummary("Panthera leo");

  // Assert
  expect(speciesSummary).toBe(
    "The lion is a large cat native to Africa and India.",
  );
});

it("returns null when Wikipedia responds with HTTP 404", async () => {
  // Arrange
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValue(new Response(null, { status: 404 }));

  vi.stubGlobal("fetch", fetchMock);

  // Act
  const speciesSummary = await getSpeciesSummary("Panthera leo");

  // Assert
  expect(speciesSummary).toBeNull();
});

it("throws an error when Wikipedia responds with HTTP 500", async () => {
  // Arrange
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValue(new Response(null, { status: 500, statusText: "" }));

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(getSpeciesSummary("Panthera leo")).rejects.toThrow(
    "Failed to fetch summary for Panthera leo: 500",
  );
});

it("returns null when Wikipedia provides an empty extract", async () => {
  // Arrange
  const wikipediaResponse = {
    extract: "",
  };

  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(JSON.stringify(wikipediaResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  // Act
  const speciesSummary = await getSpeciesSummary("Panthera leo");

  // Assert
  expect(speciesSummary).toBeNull();
});

it("builds the correct Wikipedia request URL", async () => {
  // Arrange
  const wikipediaResponse = {
    extract: "The lion is a large cat native to Africa and India.",
  };

  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(JSON.stringify(wikipediaResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  // Act
  await getSpeciesSummary("Panthera leo");

  // Assert
  expect(fetchMock).toHaveBeenCalledWith(
    "https://en.wikipedia.org/api/rest_v1/page/summary/Panthera%20leo",
  );
  expect(fetchMock).toHaveBeenCalledOnce();
});

it("throws an error when the network request fails", async () => {
  // Arrange
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockRejectedValue(new TypeError("Failed to fetch"));

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(getSpeciesSummary("Panthera leo")).rejects.toThrow(
    "Failed to fetch",
  );
});
