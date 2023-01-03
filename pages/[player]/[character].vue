<script lang="ts" setup>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { RatingPoint } from "~~/types";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  TimeScale,
  CategoryScale,
  LinearScale
);

const route = useRoute();

const player = route.params.player as string;
const character = route.params.character as string;

const { data, pending } = useFetch<RatingPoint[]>(
  `/api/${player}/${character}`
);

const gameCount = computed(
  () => data.value?.reduce((total, { games }) => total + games, 0) ?? 0
);

const scale = ref<"game" | "time">("game");
</script>

<template>
  <p v-if="pending">Loading...</p>

  <div v-else>
    <p>{{ gameCount }} games</p>

    <v-radio-group inline label="Choose the X-axis scale" v-model="scale">
      <v-radio label="Default scale" value="game"></v-radio>
      <v-radio label="Time scale" value="time"></v-radio>
    </v-radio-group>

    <Line
      v-if="data"
      :options="{
        responsive: true,
        scales: {
          ...(scale === 'time' && {
            x: {
              type: 'time',
            },
          }),
          y: {
            suggestedMin: 1400,
            suggestedMax: 2100,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      }"
      :data="{
        labels: data.map((point) => point.date),
        datasets: [
          {
            label: character,
            data: data.map((point) => point.rating),
            pointStyle: false,
            borderColor: 'red',
            stepped: true,
          },
        ],
      }"
    />

    <details>
      <summary>Raw data (click to expand)</summary>
      <pre><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
    </details>
  </div>
</template>
