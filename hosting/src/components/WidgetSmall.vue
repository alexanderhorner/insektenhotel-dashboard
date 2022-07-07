<script setup>
// import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
// import { LineChart } from 'vue-chart-3'
// Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement)

import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { computed, toRef } from 'vue';
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

// const smoothingFunction = createASAP({
//   x: (point) => number,
//   y: (point) => number,
//   toPoint: (x, y) => P
// })

const pointData = computed(() => {

  const movingAverage = dataArray.value.map((value, index) => {
    const data = dataArray.value
    const lastXElements = data.slice(Math.max(0, index - 40), index)
    const average = lastXElements.reduce((a,b) => a + b, 0) / lastXElements.length || value;
    return average
  })

  return labels.value.map((label, index) => (
    {x: label, y: movingAverage[index]}
  ))
})

const data = computed(() => {
  return {
    datasets: [{
      data: pointData.value,
      tension: 0.3,
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
        samples: 250,
        threshold: 250
      }
    },
    events: []
  }
})
</script>

<template>
  <div class="root">
    <LineChart class="chart" :chartData="data" :options="options"/>
  </div>
</template>

<style lang="scss" scoped>


</style>