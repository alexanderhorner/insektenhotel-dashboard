<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator, set, ref as dbref, onValue, orderByChild, query, startAt } from "firebase/database";
import { ref } from 'vue';

import WidgetSmall from '@/components/WidgetSmall.vue';

const props = defineProps(["account"])

const firebaseConfig = {
  apiKey: "AIzaSyBEcuAsfb-kf77UJF0kStJDy6CsQbvP0KQ",
  authDomain: "insektenhotel.firebaseapp.com",
  databaseURL: "https://insektenhotel-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "insektenhotel",
  storageBucket: "insektenhotel.appspot.com",
  messagingSenderId: "1089583413049",
  appId: "1:1089583413049:web:119e9f4d586e75502b1ae8"
};
const app = initializeApp(firebaseConfig);

const database = getDatabase();
if (location.hostname === "localhost") {
  // Point to the RTDB emulator running on localhost.
  // connectDatabaseEmulator(database, "localhost", 9000);
}

const currentData = ref({})
const history = ref(new Array)
const datafields = ref(new Array())
const historyGroupedByFieled = ref({})

const currentDataDBRef = dbref(database, `/${props.account}/currentData/`);
onValue(currentDataDBRef, (snapshot) => {
  const val = snapshot.val();
  currentData.value = val
});


const before24Hour = new Date(new Date().getTime() - (24 * 3600 * 1000)).toISOString();
const last24hoursRef = query(dbref(database, `/${props.account}/history/`), orderByChild('timestamp'), startAt(before24Hour))
onValue(last24hoursRef, (snapshot) => {
  const rawDatabaseEntry = snapshot.val();

  let allEntriesRaw = Object.values(rawDatabaseEntry).reverse()

  // Gather all datafields
  datafields.value = Array.from(new Set( // make unique by using Set
    allEntriesRaw.flatMap(entry => { // get all keys in array
      return Object.keys(entry)
    }).sort()
  ))
  
  // Create template Entry Object with all datafields
  const templateEntry = datafields.value.reduce((previousVal, currentVal) => {
    // @ts-ignore
    previousVal[currentVal] = null
    return previousVal
  }, {})

  // Equalize all objects to the templayte Entry Object
  const allEntries = history.value = allEntriesRaw.map(entry => {
    return {
      ...templateEntry,
      ...entry
    }
  })


  historyGroupedByFieled.value = (() => {
    let object = {}
    Object.keys(templateEntry).forEach(datafield => {
      // @ts-ignore
      object[datafield] = allEntries.map(entry => entry[datafield])
    })
    return object
  })()
})
</script>

<template>

  <h1 class="live-data-header">Live Daten:</h1>


  <div class="currentData">

    <div class="currentData-item">
      <div class="currentData-name">Temperatur 1</div>
      <div class="currentdata-val">{{ currentData.temperature_1 }}°C</div>
    </div>
    <div class="currentData-item">
      <div class="currentData-name">Temperatur 2</div>
      <div class="currentdata-val">{{ currentData.temperature_2 }}°C</div>
    </div>
    <div class="currentData-item">
      <div class="currentData-name">Temperatur 3</div>
      <div class="currentdata-val">{{ currentData.temperature_3 }}°C</div>
    </div>
    <div class="currentData-item">
      <div class="currentData-name">Temperatur 4</div>
      <div class="currentdata-val">{{ currentData.temperature_4 }}°C</div>
    </div>


    <div class="currentData-item">
      <div class="currentData-name">Helligkeit 1</div>
      <div class="currentdata-val">{{ currentData.luminosity_1 }} lx</div>
    </div>
    <div class="currentData-item">
      <div class="currentData-name">Helligkeit 2</div>
      <div class="currentdata-val">{{ currentData.luminosity_2 }} lx</div>
    </div>
    <div class="currentData-item">
      <div class="currentData-name">Helligkeit 3</div>
      <div class="currentdata-val">{{ currentData.luminosity_3 }} lx</div>
    </div>
    <div class="currentData-item">
      <div class="currentData-name">Helligkeit 4</div>
      <div class="currentdata-val">{{ currentData.luminosity_4 }} lx</div>
    </div>


    <div class="currentData-item">
      <div class="currentData-name">Luftfeuchtigkeit 1</div>
      <div class="currentdata-val">{{ currentData.relative_humidity_1 }}%</div>
    </div>
    <div class="currentData-item">
      <div class="currentData-name">Luftfeuchtigkeit 2</div>
      <div class="currentdata-val">{{ currentData.relative_humidity_1 }}%</div>
    </div>
    <div class="currentData-item">
      <div class="currentData-name">Luftfeuchtigkeit 3</div>
      <div class="currentdata-val">{{ currentData.relative_humidity_1 }}%</div>
    </div>
    <div class="currentData-item">
      <div class="currentData-name">Luftfeuchtigkeit 4</div>
      <div class="currentdata-val">{{ currentData.relative_humidity_1 }}%</div>
    </div>

  </div>

  <h1>Letze 24 Stunden</h1>

  <!-- <widget-small :data="temperature_1"></widget-small> -->
  <div v-for="item in datafields">
    <template v-if="item != 'timestamp'">
      <h2>{{ item }}:</h2>
      <widget-small :labels="asAny(historyGroupedByFieled)['timestamp']" :data="asAny(historyGroupedByFieled)[item]"></widget-small>
    </template>
  </div>
  


  <!-- <h1>Gerade eben: </h1>

  <div class="table-wrapper">
    <table class="table">
      <thead>
          <tr>
              <th v-for="(item, key) in currentData">{{ key }}</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <td v-for="(item, key) in currentData">{{ item }}</td>
          </tr>
      </tbody>
    </table>
  </div> -->

  <h1>Verlauf:</h1>
  <div class="table-wrapper">
    <table class="table">
      <thead>
          <tr>
              <th v-for="key in datafields">{{ key }}</th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="dataPoint in history">
              <td v-for="item in dataPoint">{{ item }}</td>
          </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
.live-data-header {
  margin-top: 50px;
  margin-bottom: 10px;
}

.currentData {
  display: grid;
  grid-template-columns: 1fr repeat(4, 200px) 1fr;
  column-gap: 70px;
  margin-bottom: 150px;

  .currentData-item {
    margin-top: 20px;

    .currentData-name {
      color: hsl(0, 0%, 60%);
    }
    .currentdata-val {
      font-size: 50px;
    }

    &:nth-of-type(4n + 1) {
      grid-column: 2;
      width: 300px;
    }
    &:nth-of-type(4n + 2) {
      grid-column: 3;
    }
    &:nth-of-type(4n + 3) {
      grid-column: 4;
    }
    &:nth-of-type(4n + 4) {
      grid-column: 5;
    }

  }
}


h1 {
  margin-left: 45px;
}

.ml-50px, h2 {
  margin-left: 50px;
}
.table-wrapper {
  display: block;
  width: 100%;
  overflow: scroll;
}
.table {
  border-collapse: collapse;
  display: inline-table;
  margin: 0 50px;

  // &::v-deep(td), &::v-deep(th) {
  td, th {
    padding: 0.5em 2em;
    border: 1px solid hsl(0, 0%, 30%)
  }
}
</style>
