<script setup lang="ts">
import _ from 'lodash';
import { ref, reactive, onBeforeMount, onBeforeUpdate } from 'vue';
import type { Ref } from 'vue';
import { Color, Sharpness } from '@/types';
import * as calc from '@/calcFunctions';
import AttackValueTable from './AttackValueTable.vue';
import { color } from 'd3-color';

const props = defineProps<{
  id: string
}>()

const emit = defineEmits(['dataChanged']);

const state = reactive({ 
  data: [[0]],
  color: Color.Green
});

const attack = ref(180);
const affinity = ref(30);
const sharpness: Ref<Sharpness> = ref(Sharpness.Green);
const critBoost: Ref<0 | 1 | 2 | 3> = ref(0);
const weaknessExploit: Ref<0 | 1 | 2 | 3> = ref(0);

const options = [
  { text: 'Off', value: 0 },
  { text: '1', value: 1 },
  { text: '2', value: 2 },
  { text: '3', value: 3 }
];

const sharpnessOptions = new Map<Sharpness, { text: string, color: string, textColor: string }>([
  [ Sharpness.Red, { text: 'Red', color: '#FF0000', textColor: 'white' } ],
  [ Sharpness.Orange, { text: 'Orange', color: '#FF9200', textColor: 'white' } ],
  [ Sharpness.Yellow, { text: 'Yellow', color: '#FFFF00', textColor: 'black' } ],
  [ Sharpness.Green, { text: 'Green', color: '#00D300', textColor: 'black' } ],
  [ Sharpness.Blue, { text: 'Blue', color: '#0000FF', textColor: 'white' } ],
  [ Sharpness.White, { text: 'White', color: '#FFFFFF', textColor: 'black' } ],
  [ Sharpness.Purple, { text: 'Purple', color: '#6B00FF', textColor: 'white' } ]
])

function generateData(attack: number, affinity: number, critBoost: 0 | 1 | 2 | 3, weaknessExploit: 0 | 1 | 2 | 3, sharpness: Sharpness): number[][] {
  const atkValues = calc.applyAttackBoost(attack);
  const affValues = calc.applyCriticalEye(affinity);
  let result: number[][] = new Array(8);

  for (let i = 0; i < 8; i++) {
    let adjustedAff = Math.min(affValues[i] / 100 + calc.convertWeaknessExploit(weaknessExploit), 1.0);
    result[i] = atkValues.map(val => val * (1 + adjustedAff * (adjustedAff < 0 ? 0.25 : calc.convertCritBoost(critBoost))) * calc.getSharpnessModifier(sharpness));
  }

  return result;
}

onBeforeMount(() => {
  state.data = generateData(attack.value, affinity.value, critBoost.value, weaknessExploit.value, sharpness.value);
  state.color = Math.random() < 0.5 ? Color.Green : Color.Blue;
})

onBeforeUpdate(() => {
  state.data = generateData(attack.value, affinity.value, critBoost.value, weaknessExploit.value, sharpness.value);
  emit('dataChanged', props.id, state.data, state.color);
})
</script>

<template>
  <form>
    <div class="form-group">
      <input type="number" placeholder="Attack" title="Attack" v-model="attack" />
      <input type="number" placeholder="Affinity(%)" title="Affinity(%)" v-model="affinity" />
      <select v-model="sharpness" title="Sharpness" :style="'background-color:' + sharpnessOptions.get(sharpness)?.color + '; color:' + sharpnessOptions.get(sharpness)?.textColor">
        <option v-for="option in sharpnessOptions" :value="option[0]" :style="'background-color:' + option[1].color + '; color:' + option[1].textColor" :title="calc.getSharpnessModifier(option[0]).toFixed(2) + 'x'">
          {{ option[1].text }}
        </option>
      </select>
      <select v-model="critBoost" title="Critical Boost">
        <option v-for="option in options" :value="option.value" :title="(100 * calc.convertCritBoost(option.value as 0|1|2|3)) + '%'">
          {{ option.text }}
        </option>
      </select>
      <select v-model="weaknessExploit" title="Weakness Exploit">
        <option v-for="option in options" :value="option.value" :title="(100 * calc.convertWeaknessExploit(option.value as 0|1|2|3)) + '%'">
          {{ option.text }}
        </option>
      </select>
    </div>
  </form>
  <AttackValueTable :id="props.id" :data="state.data" :color="state.color"/>
</template>

<style>
</style>