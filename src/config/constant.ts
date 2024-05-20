export enum FEATURES {
  t155 = "t155",
  t156 = "t156",
  t175 = "t175",
  t135 = "t135",
  fAce = "fAce",
}

export const TITLE_KEYS = {
  [FEATURES.t155]: "k",
  [FEATURES.t156]: "a",
  [FEATURES.t175]: "s",
};

export const KEYS = {
  dir: {
    up: "k",
    left: "a",
    down: "s",
    right: "d",
  },
  skill: {
    s1: "q",
    s2: "w",
    s3: "e",
    s4: "r",
    s5: "x",
    es1: "i",
    es2: "o",
    es3: "c",
    es4: "f",
    es5: "h",
  },
  switch: "z",
  awake: "ctrlL",
  reset: "0",
};

export const SPECIAL_SKILL_KEYS = [
  KEYS.skill.s1,
  KEYS.skill.s3,
  KEYS.skill.s5,
  KEYS.skill.es3,
  KEYS.skill.es1,
  KEYS.skill.es2,
  KEYS.skill.es5,
];

export const ACE_SKILL_KEY = KEYS.skill.s5;
