<script setup lang="ts">
// import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
// import { LineChart } from 'vue-chart-3'
// Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement)

import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { computed, ref, toRef, watch } from 'vue';
Chart.register(...registerables);

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    required: true
  }
})

const dataArray = toRef(props, 'data')
const labelsArray = toRef(props, 'labels')

const labels = computed(() => {
  return labelsArray.value.map((isodata) => {
    // @ts-ignore
    return new Date(isodata).getTime();
  })
})

const pointData = computed(() => {
  return labels.value.map((label, index) => {
    return {x: label, y: dataArray.value[index]}
  })
})

const data = computed(() => {
  return {
    datasets: [{
      data: pointData.value,
      tension: 0.05,
      pointRadius: 0,
      borderColor: 'rgb(75, 192, 192)',
    }]
  }
})

const options = computed(() => {
  return {
    animation: false,
    parsing: false,
    layout: {
        padding: 20
    },
    scales: {
      x: {
        display: false,
        type: 'linear',
        min: Math.min(...labels.value),
        max: Math.max(...labels.value)
        
      },
    //   y: {
    //     display: false,
    //   }
    },
    plugins: {
      legend: {
        display: false
      },
      decimation: {
        enabled: true,
        algorithm: "lttb",
        samples: 200,
        threshold: 200
      }
    },
    events: []
  }
})

const asAny = (foo: any) => foo as any;
</script>

<template>
  <div class="root">
    <LineChart class="chart" :chartData="asAny(data)" :options="options"/>
  </div>
</template>

<style lang="scss" scoped>


</style>