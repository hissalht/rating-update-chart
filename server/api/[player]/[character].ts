import { RatingPoint } from "~~/types";
import { times } from "~~/utils";
import $, { load } from "cheerio";

export default defineEventHandler(async (event) => {
  const player = event.context.params.player as string;
  const character = event.context.params.character as string;

  const data = (
    await Promise.all(
      times(84, (i) => i * 100).map(async (offset) => {
        const rawHtml = await $fetch<string>(
          `http://ratingupdate.info/player/${player}/${character}/history?offset=${offset}`
        );

        const rows = load(rawHtml)("tr").toArray().slice(1);

        const sampleData: RatingPoint[] = rows
          .map((row) => $(row))
          .map((row) => {
            const tds = row.children().toArray();
            const date = $(tds.at(0)).text();
            const rating = Number($(tds.at(1)).text().split(" ")[0]);
            const [g0, g1] = $(tds.at(7)).text().split(" - ").map(Number);
            const games = g0 + g1;
            return {
              date,
              rating,
              games,
            };
          });

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
