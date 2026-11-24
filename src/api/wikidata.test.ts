import { expect, it, vi } from "vitest";
import { resolveScientificName } from "./wikidata";

const createWikipediaResponse = () => ({
  pages: [
    {
      title: "Lion",
    },
  ],
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
