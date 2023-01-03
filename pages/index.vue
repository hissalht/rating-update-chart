<script lang="ts" setup>
import { Character, SearchResultItem } from "~~/types";

const route = useRoute();

const { data: searchResults, pending } = useAsyncData(
  async () => {
    if (!route.query.search) {
      return null;
    }

    const data = await $fetch<SearchResultItem[]>("/api/search", {
      query: {
        search: route.query.search,
      },
    });

    const mergedData: Record<
      SearchResultItem["playerId"],
      {
        playerId: string;
        names: string[];
        characters: Array<{
          character: Character;
          rating: number;
          games: number;
        }>;
      }
    > = {};

    for (const item of data) {
      const characterData = {
        character: item.character,
        games: item.games,
        rating: item.rating,
      };

      if (!(item.playerId in mergedData)) {
        mergedData[item.playerId] = {
          playerId: item.playerId,
          names: [item.name],
          characters: [characterData],
        };
      } else {
        if (!mergedData[item.playerId].names.includes(item.name)) {
          mergedData[item.playerId].names.push(item.name);
        }

        const isDuplicateChar = !!mergedData[item.playerId].characters.find(
          (it) => it.character === item.character
        );
        if (!isDuplicateChar) {
          mergedData[item.playerId].characters.push(characterData);
        }
      }
    }

    return Object.values(mergedData);
  },
  {
    watch: [() => route.query.search],
  }
);

const searchValue = ref(route.query.search ?? "");

async function handleSearchSubmit() {
  navigateTo({
    path: "/",
    query: {
      search: searchValue.value,
    },
  });
}
</script>

<template>
  <h1>Search for a player</h1>

  <form @submit.prevent="handleSearchSubmit" class="mt-4">
    <v-text-field label="Player name" v-model="searchValue" />
    <v-btn type="submit">Search</v-btn>
  </form>

  <div v-if="pending">LOADING...</div>

  <v-list class="mt-4" v-else-if="searchResults">
    <v-list-group v-for="item in searchResults">
      <template #activator="{ props }">
        <v-list-item
          v-bind="props"
          :title="item.names.join(' | ')"
        ></v-list-item>
      </template>

      <v-list-item
        v-for="character in item.characters"
        :to="`/${item.playerId}/${character.character}`"
      >
        <template #title>
          {{ formatCharacter(character.character) }}
        </template>

        <template #subtitle>
          <v-chip density="compact">
            Rating:{{ " " }}<strong>{{ character.rating }}</strong>
          </v-chip>
          {{ " " }}
          <strong>{{ character.games }}</strong>
          games
        </template>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>
