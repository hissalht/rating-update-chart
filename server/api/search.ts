import { load } from "cheerio";
import { Character, SearchResultItem } from "~~/types";

const PLAYER_HREF_REGEX = /\/player\/(.+)\/(.+)/;

export default defineEventHandler(
  async (event): Promise<SearchResultItem[]> => {
    const query = getQuery(event);

    const rawHtml = await $fetch<string>(
      `http://ratingupdate.info/?name=${query.search}`
    );

    const $ = load(rawHtml);

    const links = $("tr > td:nth-child(1) > a");

    const playerInfos = links.toArray().map((el) => {
      const href = $(el).attr("href")!;

      const matches = href.match(PLAYER_HREF_REGEX)!;
      const playerId = matches[1];
      const character = matches[2].slice(0, 2).toUpperCase() as Character;

      return {
        name: $(el).attr("title")!,
        playerId,
        character,
      };
    });

    const gameCounts = $("tr > td:nth-child(4)")
      .toArray()
      .map((el) => Number($(el).text().trim()));

    const ratings = $("tr > td:nth-child(3)")
      .toArray()
      .map((el) => Number($(el).text().split(" ")[0]));

    const data = playerInfos.map((infos, i) => ({
      ...infos,
      games: gameCounts[i],
      rating: ratings[i],
    }));

    // set cache headers to let vercel cache the returned data
    const cacheDuration = 60 * 60 * 24; // 24 hours cache
    event.node.res.setHeader(
      "Cache-Control",
      `max-age=0, s-maxage=${cacheDuration}`
    );

    return data;
  }
);
