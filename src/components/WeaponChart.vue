<script setup lang="ts">
import * as d3 from 'd3';
import _ from 'lodash';
import { ref, onMounted, onUpdated } from 'vue';
import type { Ref } from 'vue'

const props = defineProps<{
  id: string
}>()

const attack = ref(180);
const affinity = ref(30);
const critBoost: Ref<0 | 1 | 2 | 3> = ref(0);
const weaknessExploit: Ref<0 | 1 | 2 | 3> = ref(0);

const options = ref([
  { text: 'Off', value: 0 },
  { text: '1', value: 1 },
  { text: '2', value: 2 },
  { text: '3', value: 3 }
]);

let chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

function applyAttackBoost(attack: number): number[] {
  return [
    attack,
    attack + 3,
    attack + 6,
    attack + 9,
    attack * 1.05 + 7,
    attack * 1.06 + 8,
    attack * 1.08 + 9,
    attack * 1.10 + 10
  ]
}

function applyCriticalEye(affinity: number): number[] {
  return [
    affinity,
    affinity + 5,
    affinity + 10,
    affinity + 15,
    affinity + 20,
    affinity + 25,
    affinity + 30,
    affinity + 40
  ]
}

function convertCritBoost(critBoost: 0 | 1 | 2 | 3): number {
  switch (critBoost) {
    case 0:
      return .25;
    case 1:
      return .30;
    case 2:
      return .35;
    case 3:
      return .40;
  }
}

function convertWeaknessExploit(weaknessExploit: 0 | 1 | 2 | 3): number {
  switch (weaknessExploit) {
    case 0:
      return 0;
    case 1:
      return .15;
    case 2:
      return .30;
    case 3:
      return .50;
  }
}

function generateData(attack: number, affinity: number, critBoost: 0 | 1 | 2 | 3, weaknessExploit: 0 | 1 | 2 | 3): number[][] {
  const atkValues = applyAttackBoost(attack);
  const affValues = applyCriticalEye(affinity);
  let result: number[][] = new Array(8);

  for (let i = 0; i < 8; i++) {
    let adjustedAff = Math.min(affValues[i] / 100 + convertWeaknessExploit(weaknessExploit), 1.0);
    result[i] = atkValues.map(val => val * (1 + adjustedAff * (adjustedAff < 0 ? 0.25 : convertCritBoost(critBoost))));
  }

  return result;
}

function renderChart(attack: number, affinity: number, critBoost: 0 | 1 | 2 | 3, weaknessExploit: 0 | 1 | 2 | 3): void {
  const data = generateData(attack, affinity, critBoost, weaknessExploit);
  const sortedData = _.flatten(data).sort();

  const margin = 20;
  const svg_width = 520;
  const svg_height = 300;
  const chart_width = svg_width - 2 * margin;
  const chart_height = svg_height - 2 * margin;
  const cell_width = chart_width / 8 - 5;
  const cell_height = chart_height / 8 - 5;

  const svg = d3
    .select("#" + props.id)
    .attr("width", svg_width)
    .attr("height", svg_height);

  chart = svg
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  // Build X scales and axis:
  const xScale = d3
    .scaleBand()
    .range([0, chart_width])
    .domain(['0', '1', '2', '3', '4', '5', '6', '7'])
    .padding(0.05);

  chart
    .append("g")
    .style("font-size", 15)
    //.attr("transform", `translate(0, ${chart_height})`)
    .call(d3.axisTop(xScale).tickSize(0))
    .select(".domain").remove();

  // Build Y scales and axis:
  const yScale = d3
    .scaleBand()
    .range([0, chart_height])
    .domain(['0', '1', '2', '3', '4', '5', '6', '7'])
    .padding(0.05);

  chart
    .append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(yScale).tickSize(0))
    .select(".domain").remove();

  // Build color scale
  const rectColor = d3.scaleSequential()
    .interpolator(d3.interpolateGreens)
    .domain([sortedData[0], sortedData[sortedData.length-1]])
  // const rectColorReverse = d3.scaleSequential()
  //   .interpolator(d3.interpolateGreys)
  //   .domain([sortedData[sortedData.length-1], sortedData[0]])

  // add the squares
  for (let i = 0; i < 8; i++) {
    let cell = chart.selectAll()
      .data(data)
      .enter().append("g")
      .attr("transform", function (d) {
        return "translate(" + xScale(i.toString()) + ")"
      })
      .selectAll("rect")
      .data(function (d) {return d;})
      .enter().append("g");

    cell.append("rect")
      .attr("y", function(d, j) { return yScale(j.toString())! })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("height", cell_height)
      .attr("width", cell_width)
      .attr("fill", function(d, j) {
        return rectColor(data[i][j]);
      });

    cell.append("text")
      .attr("x", cell_width / 2)
      .attr("y", function(d, j) { return yScale(j.toString())! + cell_height / 2 + 6 })
      .style("fill", function(d, j){
        return data[i][j] > sortedData[Math.round(sortedData.length * 0.70)] ? "white" : "black";
      })
      .style("text-anchor", "middle")
      // .style("fill", function(d, j){
      //   return rectColorReverse(data[i][j]);
      // })
      .html(function(d, j) {
        return "" + data[i][j].toFixed(2);
      });
  }

  // // Add title to graph
  // chart.append("text")
  //   .attr("x", 0)
  //   .attr("y", -50)
  //   .attr("text-anchor", "left")
  //   .style("font-size", "22px")
  //   .text("A d3.js heatmap");

  // // Add subtitle to graph
  // chart.append("text")
  //   .attr("x", 0)
  //   .attr("y", -20)
  //   .attr("text-anchor", "left")
  //   .style("font-size", "14px")
  //   .style("fill", "grey")
  //   .style("max-width", 400)
  //   .text("A short description of the take-away message of this chart.");
}

onMounted(() => {
  renderChart(attack.value, affinity.value, critBoost.value, weaknessExploit.value);
})

onUpdated(() => {
  chart.remove();
  renderChart(attack.value, affinity.value, critBoost.value, weaknessExploit.value);
})
</script>

<template>
  <form>
    <div class="form-group">
      <input
        type="number"
        placeholder="Attack"
        v-model="attack" />
      <input
        type="number"
        placeholder="Affinity(%)"
        v-model="affinity" />
      <select
        v-model="critBoost" >
        <option v-for="option in options" :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <select
        v-model="weaknessExploit" >
        <option v-for="option in options" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
  </form>
  <div>
    <svg :id="props.id"></svg>
  </div>
</template>

<style>
</style>