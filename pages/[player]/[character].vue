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
  Filler,
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
  LinearScale,
  Filler
);

const route = useRoute();

const player = route.params.player as string;
const character = route.params.character as string;

const { data, pending } = useFetch<RatingPoint[]>(
  `/api/${player}/${character}`
);

const gameCount = computed(() => data.value?.length ?? 0);

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
        animation: false,
        scales: {
          ...(scale === 'time' && {
            x: {
              type: 'time',
            },
          }),
          y: {
            max: Math.max(...data.map((point) => point.rating)) + 100,
            min: Math.min(...data.map((point) => point.rating)) - 100,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          filler: {
            propagate: false,
          },
        },
      }"
      :data="{
        labels: data.map((point) => point.date),
        datasets: [
          {
            label: 'Lower bound',
            data: data.map((point) => point.rating - point.confidence),
            pointStyle: false,
            borderColor: '#DDD',
            borderWidth: 0,
            backgroundColor: '#0001',
            stepped: true,
            fill: '+2',
          },
          {
            label: 'Rating',
            data: data.map((point) => point.rating),
            pointStyle: false,
            borderColor: 'red',
            borderWidth: 2,
            stepped: true,
            fill: false,
          },
          {
            label: 'Upper bound',
            data: data.map((point) => point.rating + point.confidence),
            pointStyle: false,
            borderColor: '#DDD',
            borderWidth: 0,
            stepped: true,
          },
        ],
      }"
    />
  </div>
</template>
