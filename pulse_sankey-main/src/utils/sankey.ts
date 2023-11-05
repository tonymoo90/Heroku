import { SliderData } from "../pages/home";
import { SankeyCategory, SliderCategory } from "../config/sankey";

export type CalculationProps = { [key in SankeyCategory]?: number };

const calculateCostOfRevenue = (data: SliderData): number => {
  const autoRevenue = calculateAutoRevenue(data);
  const autoMargin = data[SliderCategory.AutoRevenueMargin] / 100;
  const energyMargin = data[SliderCategory.EnergyStorageMargin] / 100;
  const servicesMargin = data[SliderCategory.ServicesAndOtherMargin] / 100;

  return (
    autoRevenue * (1 - autoMargin) +
    data[SliderCategory.EnergyGenerationAndStorageRevenue] *
      (1 - energyMargin) +
    data[SliderCategory.ServicesAndOtherRevenue] * (1 - servicesMargin)
  );
};

const calculateAutoRevenue = (data: SliderData): number =>
  data[SliderCategory.AutoSalesRevenue] +
  data[SliderCategory.AutomotiveLeasingRevenue] +
  data[SliderCategory.AutoRegCreditsRevenue];

const calculateTotalRevenue = (data: SliderData): number =>
  calculateAutoRevenue(data) +
  data[SliderCategory.EnergyGenerationAndStorageRevenue] +
  data[SliderCategory.ServicesAndOtherRevenue];

const calculateGrossProfit = (data: SliderData): number =>
  calculateTotalRevenue(data) - calculateCostOfRevenue(data);

const calculateOperationExpenses = (data: SliderData): number =>
  data[SliderCategory.ResearchAndDevelopment] +
  data[SliderCategory.SGA] +
  data[SliderCategory.OtherOperatingExpenses];

const calculateOperationProfit = (data: SliderData): number =>
  calculateGrossProfit(data) - calculateOperationExpenses(data);

const calculateTax = (data: SliderData): number => data[SliderCategory.Taxes];

const calculateNetProfit = (data: SliderData): number =>
  calculateOperationProfit(data) - calculateTax(data);

const calculateOthers = (data: SliderData): number =>
  data[SliderCategory.InterestAndOther];

const calculateAutoCosts = (data: SliderData): number =>
  calculateAutoRevenue(data) *
  (1 - data[SliderCategory.AutoRevenueMargin] / 100);

const calculateEnergyCosts = (data: SliderData): number =>
  data[SliderCategory.EnergyGenerationAndStorageRevenue] *
  (1 - data[SliderCategory.EnergyStorageMargin] / 100);

const calculateRAndD = (data: SliderData): number =>
  data[SliderCategory.ResearchAndDevelopment];
const calculateSGA = (data: SliderData): number => data[SliderCategory.SGA];

const calculateOtherOpex = (data: SliderData): number =>
  data[SliderCategory.OtherOperatingExpenses];

const getAutoSalesRevenue = (data: SliderData): number =>
  data[SliderCategory.AutoSalesRevenue];
const getAutoLeasingRevenue = (data: SliderData): number =>
  data[SliderCategory.AutomotiveLeasingRevenue];
const getAutoRegCredits = (data: SliderData): number =>
  data[SliderCategory.AutoRegCreditsRevenue];

const getEnergyGenerationAndStorageRevenue = (data: SliderData): number =>
  data[SliderCategory.EnergyGenerationAndStorageRevenue];

const getServicesAndOtherRevenue = (data: SliderData): number =>
  data[SliderCategory.ServicesAndOtherRevenue];

const calEPS = (data: SliderData): number => calculateNetProfit(data) / 3.478;

const calculations = {
  calculateAutoRevenue,
  calculateAutoSalesRevenue: getAutoSalesRevenue,
  calculateAutoLeasingRevenue: getAutoLeasingRevenue,
  calculateAutoRegCredits: getAutoRegCredits,
  calculateCostOfRevenue,
  calculateTotalRevenue,
  calculateGrossProfit,
  calculateOperationExpenses,
  calculateOperationProfit,
  calculateTax,
  calculateNetProfit,
  calculateOthers,
  calculateAutoCosts,
  calculateEnergyCosts,
  calculateRAndD,
  calculateSGA,
  calculateOtherOpex,
  calEPS,
  getEnergyGenerationAndStorageRevenue,
  getServicesAndOtherRevenue,
};

export default calculations;
