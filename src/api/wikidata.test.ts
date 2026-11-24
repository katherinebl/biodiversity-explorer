import { expect, it, vi } from "vitest";
import type { WikidataResponse } from "../types/wikidata";
import {
  resolveScientificName,
  CommonNameNotFoundError,
  TaxonIsNotSpeciesError,
} from "./wikidata";

const createWikipediaResponse = () => ({
  pages: [
    {
      title: "Lion",
    },
  ],
});

const createWikidataResponse = (): WikidataResponse => ({
  entities: {
    Q140: {
      claims: {
        P225: [
          {
            mainsnak: {
              datavalue: {
                value: "Panthera leo",
              },
            },
          },
        ],
        P105: [
          {
            mainsnak: {
              datavalue: {
                value: {
                  id: "Q7432",
                },
              },
            },
          },
        ],
      },
    },
  },
});

it("returns the scientific name when a valid species is found", async () => {
  // Arrange
  const wikipediaResponse = createWikipediaResponse();
  const wikidataResponse = createWikidataResponse();

  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikipediaResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikidataResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

  vi.stubGlobal("fetch", fetchMock);

  // Act
  const scientificName = await resolveScientificName("lion");

  // Assert
  expect(scientificName).toBe("Panthera leo");
});

it("throws an error when Wikipedia responds with HTTP 500", async () => {
  // Arrange
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValue(new Response(null, { status: 500 }));

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(resolveScientificName("lion")).rejects.toThrow(
    "Wikipedia response status: 500",
  );
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("throws an error when Wikidata responds with HTTP 500", async () => {
  // Arrange
  const wikipediaResponse = createWikipediaResponse();

  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikipediaResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    .mockResolvedValueOnce(new Response(null, { status: 500 }));

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(resolveScientificName("lion")).rejects.toThrow(
    "Wikidata response status: 500",
  );
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

it("throws CommonNameNotFoundError when no Wikipedia page is found", async () => {
  // Arrange
  const wikipediaResponse = { pages: [] };

  const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(
    new Response(JSON.stringify(wikipediaResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(resolveScientificName("lion")).rejects.toThrow(
    CommonNameNotFoundError,
  );
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("throws CommonNameNotFoundError when the scientific name is missing", async () => {
  // Arrange
  const wikipediaResponse = createWikipediaResponse();
  const wikidataResponse = createWikidataResponse();
  delete wikidataResponse.entities.Q140.claims.P225;

  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikipediaResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikidataResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(resolveScientificName("lion")).rejects.toThrow(
    CommonNameNotFoundError,
  );
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

it("throws CommonNameNotFoundError when the taxon rank is missing", async () => {
  // Arrange
  const wikipediaResponse = createWikipediaResponse();
  const wikidataResponse = createWikidataResponse();
  delete wikidataResponse.entities.Q140.claims.P105;

  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikipediaResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikidataResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(resolveScientificName("lion")).rejects.toThrow(
    CommonNameNotFoundError,
  );
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

it("throws TaxonIsNotSpeciesError when the resolved taxon is not a species", async () => {
  // Arrange
  const wikipediaResponse = createWikipediaResponse();
  const wikidataResponse = createWikidataResponse();
  wikidataResponse.entities.Q140.claims.P105![0].mainsnak.datavalue.value.id =
    "Q34740"; // Genus rank

  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikipediaResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikidataResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(resolveScientificName("lion")).rejects.toThrow(
    TaxonIsNotSpeciesError,
  );
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

it("propagates network errors from Wikipedia", async () => {
  // Arrange
  const fetchMock = vi
    .fn<typeof fetch>()
    .mockRejectedValueOnce(new TypeError("Failed to fetch"));

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(resolveScientificName("lion")).rejects.toThrow(
    "Failed to fetch",
  );
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("propagates network errors from Wikidata", async () => {
  // Arrange
  const wikipediaResponse = createWikipediaResponse();

  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikipediaResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    .mockRejectedValueOnce(new TypeError("Failed to fetch"));

  vi.stubGlobal("fetch", fetchMock);

  // Act & Assert
  await expect(resolveScientificName("lion")).rejects.toThrow(
    "Failed to fetch",
  );
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

it("calls both APIs in the correct order with properly encoded URLs", async () => {
  // Arrange
  const wikipediaResponse = createWikipediaResponse();
  const wikidataResponse = createWikidataResponse();

  wikipediaResponse.pages[0].title = "Panthera leo";

  const fetchMock = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikipediaResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify(wikidataResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

  vi.stubGlobal("fetch", fetchMock);

  // Act
  await resolveScientificName("African lion");

  // Assert
  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    "https://en.wikipedia.org/w/rest.php/v1/search/page?q=African%20lion&limit=5",
  );
  expect(fetchMock).toHaveBeenNthCalledWith(
    2,
    "https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&titles=Panthera%20leo&props=claims&format=json&origin=*",
  );
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
