<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator, set, ref as dbref, onValue } from "firebase/database";
import { ref } from 'vue';

import WidgetSmall from '@/components/WidgetSmall.vue';

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
const historyGroupedByFieled = ref(new Array()) // convert to obj

const temperature_1 = ref(new Array)

const currentDataDBRef = dbref(database, 'currentData/');
onValue(currentDataDBRef, (snapshot) => {
  const val = snapshot.val();
  currentData.value = val
});

const historyDBRef = dbref(database, 'history/');
onValue(historyDBRef, (snapshot) => {
  const rawDatabaseEntry: Object = snapshot.val();

  let allEntriesRaw = Object.values(rawDatabaseEntry).reverse()

  // Gather all datafields
  datafields.value = Array.from(new Set( // make unique by using Set
    allEntriesRaw.flatMap(entry => { // get all keys in array
      return Object.keys(entry)
    }).sort()
  ))
  
  // Create template Entry Object with all datafields
  const templateEntry = datafields.value.reduce((previousVal: Object, currentVal) => {
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
    return Object.entries(templateEntry).map(([datafield, item]) => {
      return allEntries.map(entry => entry[datafield])
    })
  })()

  // console.log(historyGroupedByFieled)

})

</script>

<template>
  <!-- <widget-small :data="temperature_1"></widget-small> -->
  <div v-for="(item, key) in datafields">
    <h1>{{ item }}:</h1>
    <widget-small :data="historyGroupedByFieled[key]"></widget-small>
  </div>
  


  <h1>Gerade eben: </h1>

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
  </div>

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

<style lang="scss" scoped>
.ml-50px, h1 {
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

  &::v-deep(td), &::v-deep(th) {
    padding: 0.5em 2em;
    border: 1px solid hsl(0, 0%, 30%)
  }
}
</style>
