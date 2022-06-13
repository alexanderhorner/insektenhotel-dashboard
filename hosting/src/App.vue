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
  connectDatabaseEmulator(database, "localhost", 9000);
} 

const currentDataDataObj = ref(null)
const historyDataObj = ref(null)

const currentDataDBRef = dbref(database, 'currentData/');
onValue(currentDataDBRef, (snapshot) => {
  const val = snapshot.val()
  currentDataDataObj.value = val
});

const historyDBRef = dbref(database, 'history/');
onValue(historyDBRef, (snapshot) => {
  const val = snapshot.val()  
  historyDataObj.value = val
});

</script>

<template>
  <!-- <table>
    <tbody>
        <tr v-for="(item, key) in currentDataDataObj">
            <td>{{ key }}: </td>
            <td>{{ item }}</td>
        </tr>
    </tbody>
  </table> -->
  <!-- <h1 v-for="dataPoint in historyDataObj">{{ dataPoint }}</h1> -->

  <widget-small></widget-small>

  <table>
    <thead>
        <tr>
            <th v-for="(item, key) in currentDataDataObj">{{ key }}</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="dataPoint in historyDataObj">
            <td v-for="item in dataPoint">{{ item }}</td>
        </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
table {
  td, th {
    padding: 0.5em 2em;
    border: 1px solid hsl(0, 0%, 30%)
  }
}
</style>
