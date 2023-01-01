import { JSDOM } from "jsdom";
import { RatingPoint } from "~~/types";
import { times } from "~~/utils";

export default defineEventHandler(async (event) => {
  const player = event.context.params.player as string;
  const character = event.context.params.character as string;

  const data = (
    await Promise.all(
      times(84, (i) => i * 100).map(async (offset) => {
        const rawHtml = await $fetch<string>(
          `http://ratingupdate.info/player/${player}/${character}/history?offset=${offset}`
        );

        const dom = new JSDOM(rawHtml);
        const sampleData: RatingPoint[] = [];

        dom.window.document.querySelectorAll("tr").forEach((tr, i) => {
          if (i === 0) return;

          // FIXME: validate fetched data and throw if invalid

          const date = tr.children.item(0)?.textContent!;
          const rating = Number(
            tr.children.item(1)?.textContent?.split(" ")[0]
          );

          const [g0, g1] = tr.children
            .item(7)
            ?.textContent?.split(" - ")
            .map(Number)!;
          const games = g0 + g1;

          sampleData.push({ date, rating, games });
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
