<script setup lang="ts">
import _ from 'lodash';
import { Color } from '@/types';
import AttackValueTable from './AttackValueTable.vue';
import { reactive } from 'vue';

const props = defineProps<{
  id: string,
  data: Map<string, number[][]>
  colorData: Map<string, Color>
}>()

const state = reactive({
  colorData: _.times(8, () => _.fill(Array(8), Color.Grey))
}) 

function filterData(): number[][] {
  let result: number[][] = _.times(8, () => _.fill(Array(8), 0));

  for (const kvp of props.data) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (result[i][j] < kvp[1][i][j]) {
          result[i][j] = kvp[1][i][j];
          state.colorData[i][j] = props.colorData.get(kvp[0])!;
        }
      }
    }
  }

  return result;
}
</script>

<template>
  <AttackValueTable :id="props.id" :data="filterData()" :color="Color.Grey" :color-data="state.colorData" />
</template>

<style>
</style>