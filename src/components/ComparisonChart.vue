<script setup lang="ts">
import _ from 'lodash';
import AttackValueTable from './AttackValueTable.vue'

const props = defineProps<{
  id: string,
  data: Map<string, number[][]>
}>()

function filterData(): number[][] {
  let result: number[][] = _.times(8, () => _.fill(Array(8), 0));

  for (const value of props.data.values()) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (result[i][j] < value[i][j])
          result[i][j] = value[i][j];
      }
    }
  }

  return result;
}
</script>

<template>
  <AttackValueTable :id="props.id" :data="filterData()" />
</template>

<style>
</style>