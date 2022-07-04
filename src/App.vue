<script setup lang="ts">
import WeaponChart from './components/WeaponChart.vue';
import ComparisonChart from './components/ComparisonChart.vue';
import { reactive } from 'vue';

const state = reactive({
  comparisonData: new Map()
});

function createComparisonData(id: string, data: number[][]) {
  state.comparisonData.set(id, data);
}
</script>

<template>
  <div id="app">
    <WeaponChart id="chart1" @data-changed="createComparisonData"/>
    <WeaponChart id="chart2" @data-changed="createComparisonData" />
    <WeaponChart id="chart3" @data-changed="createComparisonData" />
    <!-- <ComparisonChart v-if="state.comparisonData.size > 0" id="cChart" :data="state.comparisonData" /> -->
  </div>
</template>

<style>
@import './assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
