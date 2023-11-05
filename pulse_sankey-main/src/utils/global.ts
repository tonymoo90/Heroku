import {
  SankeyCategory,
  sankeySettings,
  RED,
  LIGHT_GREEN,
  LIGHT_RED,
  GREEN,
  GREY,
  LIGHT_GREY,
} from "../config/sankey";

export const getSankeyDisplayColor = (
  value: number,
  type: SankeyCategory,
): { lite: string; dark: string } => {
  const positive = { lite: LIGHT_GREEN, dark: GREEN };
  const negative = { lite: LIGHT_RED, dark: RED };
  const isDefaultPositive = sankeySettings?.[type]?.nodeFill === GREEN;
  const isDefaultNegative = sankeySettings?.[type]?.nodeFill === RED;
  if (isDefaultPositive) {
    return value >= 0 ? positive : negative;
  } else if (isDefaultNegative) {
    return value >= 0 ? negative : positive;
  } else {
    return { lite: LIGHT_GREY, dark: GREY };
  }
};
