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
  }
})
const dataArray = toRef(props, 'data')

const labels = computed(() => {
  return dataArray.value.map(item => {
    return "Label"
  })
})

const data = computed(() => {
  return {
    labels: labels.value,
    datasets: [{
      data: dataArray.value.reverse(),
      tension: 0.3,
      pointRadius: 0,
      borderColor: 'rgb(75, 192, 192)',
    }]
  }
})

const options = {
  layout: {
      padding: 20
  },
  scales: {
    x: {
      display: false
    },
  //   y: {
  //     display: false,
  //   }
  },
  plugins: {
    legend: {
      display: false
    }
  },
  events: []
}

const asAny = (foo: any) => foo as any;
</script>

<template>
  <div class="root">
    <LineChart class="chart" :chartData="asAny(data)" :options="options"/>
  </div>
</template>

<style lang="scss" scoped>


</style>