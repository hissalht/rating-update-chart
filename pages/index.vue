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

  <form @submit.prevent="handleSearchSubmit" class="mt-4">
    <v-text-field label="Player name" v-model="searchValue" />
    <v-btn type="submit">Search</v-btn>
  </form>

  <div v-if="pending">LOADING...</div>

  <v-list class="mt-4">
    <v-list-item
      v-for="item in searchResults"
      :title="item.name"
      :to="`/${item.playerId}/${item.character}`"
    >
      <template #subtitle>
        <v-chip density="compact">{{ formatCharacter(item.character) }}</v-chip>
        {{ " " }}
        <strong>{{ item.games }}</strong> games / Rating:
        <strong>{{ item.rating }}</strong>
      </template>
    </v-list-item>
  </v-list>
</template>
