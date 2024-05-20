import { FEATURES } from "./constant";

interface IStatus {
  active: boolean;
  text: string;
  count: number;
}

interface IGetStatus {
  (count: number): IStatus;
}

const get155Status = (count: number) => {
  if (!count) return { active: false, text: "未激活", count: 0 };

  const v = count % 15;
  let effect = "";
  if (v <= 2) effect = "柔韧";
  if (v > 2 && v <= 5) effect = "强韧";
  if (v > 5 && v <= 10) effect = "强烈";
  if (v > 10 && v <= 15) effect = "超越";

  return { active: effect === "超越", text: `${effect}+15%`, count: v };
};

const get175Status = (count: number) => {
  if (count > 0 && count <= 40) {
    return { active: true, text: "伤害+15%", count };
  }

  if (count > 40 && count <= 60) {
    return { active: false, text: "冷却中", count };
  }

  return { active: false, text: "未激活", count };
};

const get156Status = (count: number) => {
  if (count > 0 && count <= 25) {
    return { active: false, text: "冷却中", count };
  }

  return { active: false, text: "可用", count };
};

const getAceStatus = (count: number) => {
  return { active: false, text: "已经过", count };
};

const map: { [index: string]: IGetStatus | undefined } = {
  [FEATURES.t155]: get155Status,
  [FEATURES.t156]: get156Status,
  [FEATURES.t175]: get175Status,
  [FEATURES.fAce]: getAceStatus,
};

export const getStatus = (feature: FEATURES, count: number) => {
  const func = map[feature];

  if (func) {
    return func(count);
  }

  return { active: false, text: "未激活", count: 0 };
};
