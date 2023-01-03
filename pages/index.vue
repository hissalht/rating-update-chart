<script lang="ts" setup>
import { SearchResultItem } from "~~/types";

const route = useRoute();

const { data: searchResults, pending } = useAsyncData<
  SearchResultItem[] | null
>(
  () => {
    if (!route.query.search) {
      return Promise.resolve(null);
    }

    return $fetch("/api/search", {
      query: {
        search: route.query.search,
      },
    });
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

  <form @submit.prevent="handleSearchSubmit">
    <div>
      <label for="player-name-input">Player name</label>
      <input id="player-name-input" v-model="searchValue" />
    </div>
    <button type="submit">Search</button>
  </form>

  <div v-if="pending">LOADING...</div>

  <ul v-else-if="searchResults">
    <li v-for="item in searchResults">
      <NuxtLink :to="`/${item.playerId}/${item.character}`">
        {{ item.name }} / {{ item.character }}
      </NuxtLink>
    </li>
  </ul>
</template>
