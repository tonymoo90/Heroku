import { SliderData } from "../pages/home";

export enum SankeyCategory {
  AutoRevenue = "Auto Revenue",
  AutoSalesRevenue = "Auto Sales Revenue",
  AutoLeasingRevenue = "Auto Leasing Revenue",
  AutoRegCredits = "Auto Reg Credits",
  TotalRevenue = "Total Revenue",
  GrossProfite = "Gross Profit",
  CostOfRevenue = "Cost of Revenue",
  OperationProfit = "Operation Profit",
  OperationExpenses = "Operation Expenses",
  AutoCosts = "Auto Costs",
  EnergyCosts = "Energy Costs",
  NetProfite = "Net Profit",
  NetLoss = "Net Loss",
  Tax = "Tax",
  Others = "Others",
  OtherOpex = "Other Opex",
  "R&D" = "R&D",
  "SG&A" = "SG&A",
}

export enum SliderCategory {
  AutoSalesRevenue = "autoSalesRevenue",
  AutoRegCreditsRevenue = "autoRegCreditsRevenue",
  AutomotiveLeasingRevenue = "automotiveLeasingRevenue",
  EnergyGenerationAndStorageRevenue = "energyRevenue",
  ServicesAndOtherRevenue = "servicesAndOtherRevenue",
  AutoRevenueMargin = "autoRevenueMargin",
  EnergyStorageMargin = "energyMargin",
  ServicesAndOtherMargin = "servicesAndOtherMargin",
  ResearchAndDevelopment = "r&d",
  SGA = "sga",
  OtherOperatingExpenses = "otherOperatingExpenses",
  InterestAndOther = "interestAndOtherIncome",
  Taxes = "taxes",
}

export enum SliderGroupType {
  Revenue = "Revenue",
  CostOfRevenue = "Cost of revenue",
  OtherExpense = "Other expense",
}

export enum Prefix {
  Percentage = "%",
  Currency = "BN",
}

export enum SliderType {
  Negative = "#b81818",
  Positive = "#188c1a",
  Basic = "#545955",
}

type SliderSettings = {
  [key in SliderCategory]: {
    min: number;
    max: number;
    prefix: Prefix;
    step: number;
    defaultValue: number;
    description?: string;
    type: SliderType;
    label: string;
  };
};

// colors
export const GREY = "#545955";
export const LIGHT_GREY = "#a6a6a6";
export const GREEN = "#188c1a";
export const LIGHT_GREEN = "#18b81b";
export const RED = "#b81818";
export const LIGHT_RED = "#e63535";

export const sankeySettings: {
  [key in SankeyCategory]: {
    nodeFill: string;
    linkFill: string;
    showVal: boolean;
  };
} = {
  [SankeyCategory.AutoRevenue]: {
    nodeFill: GREY,
    linkFill: LIGHT_GREY,
    showVal: true,
  },
  [SankeyCategory.AutoSalesRevenue]: {
    nodeFill: GREY,
    linkFill: LIGHT_GREY,
    showVal: true,
  },
  [SankeyCategory.AutoLeasingRevenue]: {
    nodeFill: GREY,
    linkFill: LIGHT_GREY,
    showVal: true,
  },
  [SankeyCategory.AutoRegCredits]: {
    nodeFill: GREY,
    linkFill: LIGHT_GREY,
    showVal: true,
  },
  [SankeyCategory.TotalRevenue]: {
    nodeFill: GREY,
    linkFill: LIGHT_GREY,
    showVal: false,
  },
  [SankeyCategory.GrossProfite]: {
    nodeFill: GREEN,
    linkFill: LIGHT_GREEN,
    showVal: false,
  },
  [SankeyCategory.OperationProfit]: {
    nodeFill: GREEN,
    linkFill: LIGHT_GREEN,
    showVal: false,
  },
  [SankeyCategory.NetProfite]: {
    nodeFill: GREEN,
    linkFill: LIGHT_GREEN,
    showVal: true,
  },
  [SankeyCategory.NetLoss]: {
    nodeFill: RED,
    linkFill: LIGHT_RED,
    showVal: false,
  },
  [SankeyCategory.Others]: {
    nodeFill: GREEN,
    linkFill: LIGHT_GREEN,
    showVal: true,
  },

  [SankeyCategory.CostOfRevenue]: {
    nodeFill: RED,
    linkFill: LIGHT_RED,
    showVal: false,
  },
  [SankeyCategory.OperationExpenses]: {
    nodeFill: RED,
    linkFill: LIGHT_RED,
    showVal: false,
  },
  [SankeyCategory.AutoCosts]: {
    nodeFill: RED,
    linkFill: LIGHT_RED,
    showVal: false,
  },
  [SankeyCategory.EnergyCosts]: {
    nodeFill: RED,
    linkFill: LIGHT_RED,
    showVal: false,
  },
  [SankeyCategory.Tax]: { nodeFill: RED, linkFill: LIGHT_RED, showVal: true },
  [SankeyCategory.OtherOpex]: {
    nodeFill: RED,
    linkFill: LIGHT_RED,
    showVal: true,
  },
  [SankeyCategory["R&D"]]: {
    nodeFill: RED,
    linkFill: LIGHT_RED,
    showVal: true,
  },
  [SankeyCategory["SG&A"]]: {
    nodeFill: RED,
    linkFill: LIGHT_RED,
    showVal: true,
  },
};

export const SliderGroups: { [key in SliderGroupType]: SliderCategory[] } = {
  [SliderGroupType.Revenue]: [
    SliderCategory.AutoSalesRevenue,
    SliderCategory.AutoRegCreditsRevenue,
    SliderCategory.AutomotiveLeasingRevenue,
    SliderCategory.EnergyGenerationAndStorageRevenue,
    SliderCategory.ServicesAndOtherRevenue,
  ],
  [SliderGroupType.CostOfRevenue]: [
    SliderCategory.AutoRevenueMargin,
    SliderCategory.EnergyStorageMargin,
    SliderCategory.ServicesAndOtherMargin,
  ],
  [SliderGroupType.OtherExpense]: [
    SliderCategory.ResearchAndDevelopment,
    SliderCategory.SGA,
    SliderCategory.OtherOperatingExpenses,
    SliderCategory.InterestAndOther,
    SliderCategory.Taxes,
  ],
};

export const SliderSettings: SliderSettings = {
  [SliderCategory.AutoSalesRevenue]: {
    min: 0,
    max: 55,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 20.4,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive,
    label: "Auto sales revenue",
  },
  [SliderCategory.AutoRegCreditsRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0.2,
    description: "more than analyst avg",
    type: SliderType.Positive,
    label: "Auto reg credits revenue",
  },
  [SliderCategory.AutomotiveLeasingRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0.6,
    description: "more than yst avg",
    type: SliderType.Positive,
    label: "Automotive leasing revenue",
  },
  [SliderCategory.EnergyGenerationAndStorageRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 1.5,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive,
    label: "Energy Revenue",
  },
  [SliderCategory.ServicesAndOtherRevenue]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 2.15,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive,
    label: "Services and other Revenue",
  },

  [SliderCategory.AutoRevenueMargin]: {
    min: 0,
    max: 100,
    prefix: Prefix.Percentage,
    step: 1,
    defaultValue: 19.2,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive,
    label: "Auto revenue margin",
  },
  [SliderCategory.EnergyStorageMargin]: {
    min: 0,
    max: 100,
    prefix: Prefix.Percentage,
    step: 1,
    defaultValue: 18.4,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive,
    label: "Energy Margin",
  },
  [SliderCategory.ServicesAndOtherMargin]: {
    min: 0,
    max: 100,
    prefix: Prefix.Percentage,
    step: 1,
    defaultValue: 7.7,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive,
    label: "Services and other Margin",
  },

  [SliderCategory.ResearchAndDevelopment]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0.9,
    description: "less than Q2 auti revenue",
    type: SliderType.Negative,
    label: "R&D",
  },
  [SliderCategory.SGA]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 1.2,
    description: "less than Q2 auti revenue",
    type: SliderType.Negative,
    label: "SGA",
  },
  [SliderCategory.OtherOperatingExpenses]: {
    min: 0,
    max: 1,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0,
    description: "less than Q2 auti revenue",
    type: SliderType.Negative,
    label: "Other Operating Expenses",
  },
  [SliderCategory.InterestAndOther]: {
    min: -1,
    max: 1,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0.5,
    description: "less than Q2 auti revenue",
    type: SliderType.Positive,
    label: "Interest and other income/expenses (net)",
  },
  [SliderCategory.Taxes]: {
    min: 0,
    max: 3,
    prefix: Prefix.Currency,
    step: 0.1,
    defaultValue: 0.3,
    description: "less than Q2 auti revenue",
    type: SliderType.Negative,
    label: "Taxes (TAX)",
  },
};

export const sliderDefaultData: SliderData = Object.keys(SliderSettings).reduce(
  (obj, key: SliderCategory) => {
    return { ...obj, ...{ [key]: SliderSettings[key].defaultValue } };
  },
  {},
);

export const SliderCategoryInfoMaping = {
  [SliderCategory.AutoSalesRevenue]: { category: "AUTO_SALES_REVENUE" },
  [SliderCategory.AutoRegCreditsRevenue]: { category: "AUTO_REG_CREDITS" },
  [SliderCategory.AutomotiveLeasingRevenue]: { category: "AUTO_LEASE_REVENUE" },
  [SliderCategory.EnergyGenerationAndStorageRevenue]: {
    category: "ENERGY_REVENUE",
  },
  [SliderCategory.AutoRevenueMargin]: { category: "AUTO_REVENUE_MARGIN" },
  [SliderCategory.ServicesAndOtherRevenue]: {
    category: "SERVICES_OTHER_MARGIN",
  },
  [SliderCategory.EnergyStorageMargin]: { category: "ENERGY_MARGIN" },
  [SliderCategory.ServicesAndOtherMargin]: { category: "COST_OF_REVENUE" },
  [SliderCategory.ResearchAndDevelopment]: { category: "RD" },
  [SliderCategory.SGA]: { category: "SGA" },
  [SliderCategory.OtherOperatingExpenses]: {
    category: "OTHER_OPERATING_EXPENSE",
  },
  [SliderCategory.InterestAndOther]: { category: "INTEREST_AND_OTHER_INCOME" },
  [SliderCategory.Taxes]: { category: "INCOME_TAX" },
};
