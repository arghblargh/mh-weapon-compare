<script setup lang="ts">
import * as d3 from 'd3';
import _ from 'lodash';
import { ref, onMounted, onUpdated } from 'vue';

enum Color {
  Blue,
  Green,
  Grey,
  Orange,
  Purple,
  Red,

  Custom
}

const props = defineProps<{
  id: string,
  data: number[][]
}>()

let chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

function colorScale(domainStart: number, domainEnd: number, color: Color, custom?: number): d3.ScaleSequential<string, never> {
  let interpolator = d3.interpolateBlues;
  switch (color) {
    case Color.Blue:
      // interpolator = d3.interpolateBlues;
      break;
    case Color.Green:
      interpolator = d3.interpolateGreens;
      break;
    case Color.Grey:
      interpolator = d3.interpolateGreys;
      break;
    case Color.Orange:
      interpolator = d3.interpolateOranges;
      break;
    case Color.Purple:
      interpolator = d3.interpolatePurples;
      break;
    case Color.Red:
      interpolator = d3.interpolateReds;
      break;
    case Color.Custom:
      if (typeof custom !== 'undefined') {
        interpolator = d3.interpolateHsl(d3.hsl(custom, 1, 1), d3.hsl(custom, 1, 0.4));
      }
      break;
  }
  return d3.scaleSequential()
    .domain([domainStart, domainEnd])
    .interpolator(interpolator);
    // .interpolator(d3.interpolate("white", "green"))
    // .interpolator(d3.interpolateRgb("#f7fcf5", "#00441b"))
    // .interpolator(d3.interpolateHsl(d3.hsl(0,1,1), d3.hsl(0,1,0.4)))
  // const rectColorReverse = d3.scaleSequential()
  //   .interpolator(d3.interpolateGreys)
  //   .domain([sortedData[sortedData.length-1], sortedData[0]])
}

function renderChart(data: number[][]): void {
  const sortedData = _.flatten(data).sort();

  const margin = 30;
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
    .style("font-size", 14)
    //.attr("transform", `translate(0, ${chart_height})`)
    .call(d3.axisTop(xScale).tickSize(0))
    .select(".domain").remove();

  chart.append("text")
    .attr("transform", "translate(" + (chart_width/2) + " , -16)")
    .style("font-size", 12)
    .style("text-anchor", "middle")
    .text("Critical Eye");

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

  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(chart_height/2))
    .attr("y", -16)
    .style("font-size", 12)
    .style("text-anchor", "middle")
    .text("Attack Boost");

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
        return colorScale(sortedData[0], sortedData[sortedData.length-1], Color.Green)(data[i][j]);
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
  renderChart(props.data);
})

onUpdated(() => {
  chart.remove();
  renderChart(props.data);
})
</script>

<template>
  <div>
    <svg :id="props.id"></svg>
  </div>
</template>

<style>
</style>