<script setup lang="ts">
import _ from 'lodash';
import { ref, reactive, onBeforeMount, onBeforeUpdate } from 'vue';
import type { Ref } from 'vue';
import { Color, Sharpness } from '@/types';
import AttackValueTable from './AttackValueTable.vue';

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

const sharpnessOptions = [
  { text: 'Red', value: Sharpness.Red },
  { text: 'Orange', value: Sharpness.Orange },
  { text: 'Yellow', value: Sharpness.Yellow },
  { text: 'Green', value: Sharpness.Green },
  { text: 'Blue', value: Sharpness.Blue },
  { text: 'White', value: Sharpness.White },
  { text: 'Purple', value: Sharpness.Purple }
]

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

// MHR sharpness modifiers:
// Red   Orange  Yellow  Green  Blue   White  Purple
// 0.50  0.75    1.00    1.05   1.20   1.32   1.39
// 0.25  0.50    0.75    1.00   1.0625 1.15   1.25
function getSharpnessModifier(sharpness: Sharpness): number {
  switch (sharpness) {
    case Sharpness.Red:
      return 0.50;
    case Sharpness.Orange:
      return 0.75;
    case Sharpness.Yellow:
      return 1.00;
    case Sharpness.Green:
      return 1.05;
    case Sharpness.Blue:
      return 1.20;
    case Sharpness.White:
      return 1.32;
    case Sharpness.Purple:
      return 1.39;
  }
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

function generateData(attack: number, affinity: number, critBoost: 0 | 1 | 2 | 3, weaknessExploit: 0 | 1 | 2 | 3, sharpness: Sharpness): number[][] {
  const atkValues = applyAttackBoost(attack);
  const affValues = applyCriticalEye(affinity);
  let result: number[][] = new Array(8);

  for (let i = 0; i < 8; i++) {
    let adjustedAff = Math.min(affValues[i] / 100 + convertWeaknessExploit(weaknessExploit), 1.0);
    result[i] = atkValues.map(val => val * (1 + adjustedAff * (adjustedAff < 0 ? 0.25 : convertCritBoost(critBoost))) * getSharpnessModifier(sharpness));
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
      <input
        type="number"
        placeholder="Attack"
        v-model="attack" />
      <input
        type="number"
        placeholder="Affinity(%)"
        v-model="affinity" />
      <select
        v-model="sharpness" >
        <option v-for="option in sharpnessOptions" :value="option.value">
          {{ option.text }}
        </option>
      </select>
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
  <AttackValueTable :id="props.id" :data="state.data" :color="state.color"/>
</template>

<style>
</style>