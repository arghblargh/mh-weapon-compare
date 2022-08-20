import { Sharpness } from "./types";

// MHR Attack Boost:
// 1   2   3   4       5       6       7
// +3  +6  +9  1.05+7  1.06+8  1.08+9  1.10+10
export function applyAttackBoost(attack: number): number[] {
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

// MHR Critical Eye:
// 1    2     3     4     5     6     7
// +5%  +10%  +15%  +20%  +25%  +30%  +40%
export function applyCriticalEye(affinity: number): number[] {
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
//          Red   Orange  Yellow  Green  Blue   White  Purple
// Attack   0.50  0.75    1.00    1.05   1.20   1.32   1.39
// Element  0.25  0.50    0.75    1.00   1.0625 1.15   1.25
export function getSharpnessModifier(sharpness: Sharpness): number {
  switch (sharpness) {
    case Sharpness.Red:
      return 0.50;
    case Sharpness.Orange:
      return 0.75;
    case Sharpness.Yellow:
    case Sharpness.None:
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

// MHR Critical Boost:
// Base  1     2     3
// 1.25  1.30  1.35  1.40
export function convertCritBoost(critBoost: 0 | 1 | 2 | 3): number {
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

// MHR Weakness Exploit:
// 1     2     3
// +15%  +30%  +50%
export function convertWeaknessExploit(weaknessExploit: 0 | 1 | 2 | 3): number {
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