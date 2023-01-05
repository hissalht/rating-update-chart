import { RatingPoint } from "~~/types";
import { times } from "~~/utils";
import { load } from "cheerio";

export default defineEventHandler(async (event) => {
  const player = event.context.params.player as string;
  const character = event.context.params.character as string;

  console.log("Fetching ratingupdate.com for", { player, character });

  const data = (
    await Promise.all(
      times(84, (i) => i * 100).map(async (offset) => {
        const rawHtml = await $fetch<string>(
          `http://ratingupdate.info/player/${player}/${character}/history?offset=${offset}`
        );

        const $ = load(rawHtml);

        const rows = $("tr").toArray().slice(1).reverse();

        const sampleData: RatingPoint[] = rows
          .map((row) => $(row))
          .map((row) => {
            const tds = row.children().toArray();
            const date = $(tds.at(0)).text();
            const baseRating = Number($(tds.at(1)).text().split(" ±")[0]);
            const confidence = Number($(tds.at(1)).text().split(" ±")[1]);

            // The title attribute contains the rating changes for each individual games in the set.
            const ratingChanges = $(tds.at(8)?.firstChild!)
              .attr("title")!
              .trim()
              .split(" ")
              .map(Number);

            const ratings: number[] = [];

            for (let i = 0; i < ratingChanges.length; i++) {
              const ratingChange = ratingChanges[i];
              const lastRating = ratings.at(-1) ?? baseRating;
              ratings.push(lastRating + ratingChange);
            }

            return ratings.map((r) => ({
              date,
              rating: r,
              confidence,
            }));
          })
          .flat();

        return sampleData;
      })
    )
  ).flat();

  data.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  });

  return data;
});
