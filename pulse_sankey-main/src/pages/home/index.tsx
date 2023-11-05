import React, { useState, useMemo } from "react";
// components
import SankeyChart from "../../components/charts/sankey";
import Settings from "./settings";
import SliderInfoSideBar from "./sliderInfoSideBar";
import Modal from "../../components/modal";
import TextField from "../../components/textField";
// types
import {
  SliderCategory,
  SankeyCategory,
  SliderSettings,
} from "../../config/sankey";
// data
import {
  sliderDefaultData,
  SliderCategoryInfoMaping,
} from "../../config/sankey";
// utils
import cal from "../../utils/sankey";
import { getSankeyDisplayColor } from "../../utils/global";
// context
import { useSliderContext } from "../../context/SliderContext";
import { useAlertContext } from "../../context/AlertContext";
// actions
import { saveSliderValues, SliderSaveBodyProps } from "../../actions/slider";

export type SliderData = { [key in SliderCategory]?: number };

export type SankeyData = {
  nodes: { id: string }[];
  links: { source: string; target: string; value: number }[];
};

const Home = () => {
  const [defaultSliderData] = useState<SliderData>(sliderDefaultData);
  const [sliderData, setSlider] = useState<SliderData>(sliderDefaultData);
  const [peRatio, setPeRatio] = useState<number>(70);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { selectedSlider, sliderCategoryData, setSelectedSlider } =
    useSliderContext();
  const { setErrorAlert, setSuccessAlert } = useAlertContext()

  const sankeyData = useMemo((): SankeyData => {
    const netProfit = cal.calculateNetProfit(sliderData);
    const sankeyLinks: [any, SankeyCategory, (data: SliderData) => number][] = [
      [
        SankeyCategory.AutoRevenue,
        SankeyCategory.TotalRevenue,
        cal.calculateAutoRevenue,
      ],
      [
        SliderSettings[SliderCategory.EnergyGenerationAndStorageRevenue].label,
        SankeyCategory.TotalRevenue,
        cal.getEnergyGenerationAndStorageRevenue,
      ],
      [
        SliderSettings[SliderCategory.ServicesAndOtherRevenue].label,
        SankeyCategory.TotalRevenue,
        cal.getServicesAndOtherRevenue,
      ],
      [
        SankeyCategory.TotalRevenue,
        SankeyCategory.GrossProfite,
        cal.calculateGrossProfit,
      ],
      [
        SankeyCategory.GrossProfite,
        SankeyCategory.OperationProfit,
        cal.calculateOperationProfit,
      ],
      [
        SankeyCategory.GrossProfite,
        SankeyCategory.OperationExpenses,
        cal.calculateOperationExpenses,
      ],
      [
        SankeyCategory.OperationProfit,
        netProfit >= 0 ? SankeyCategory.NetProfite : SankeyCategory.NetLoss,
        cal.calculateNetProfit,
      ],
      [SankeyCategory.OperationProfit, SankeyCategory.Tax, cal.calculateTax],
      [SankeyCategory.Others, SankeyCategory.NetProfite, cal.calculateOthers],
      [
        SankeyCategory.OperationExpenses,
        SankeyCategory["R&D"],
        cal.calculateRAndD,
      ],
      [
        SankeyCategory.OperationExpenses,
        SankeyCategory["SG&A"],
        cal.calculateSGA,
      ],
      [
        SankeyCategory.OperationExpenses,
        SankeyCategory.OtherOpex,
        cal.calculateOtherOpex,
      ],
      [
        SankeyCategory.TotalRevenue,
        SankeyCategory.CostOfRevenue,
        cal.calculateCostOfRevenue,
      ],
    ];

    // to show dynamic color for others sankey line
    const othersLineColor = getSankeyDisplayColor(
      cal.calculateOthers(sliderData),
      SankeyCategory.Others,
    );

    return {
      nodes: [...new Set(sankeyLinks.map((ar) => [ar[1], ar[0]]).flat())].map(
        (key) => {
          return {
            id: key,
            heading: [
              SankeyCategory.AutoRevenue,
              SankeyCategory.NetProfite,
            ].includes(key),
            ...(key === SankeyCategory.Others
              ? { color: othersLineColor }
              : {}),
          };
        },
      ),
      links: sankeyLinks.map((link) => {
        const [source, target, fn] = link;
        const value = fn?.(sliderData);
        return { source, target, value, displayValue: fn?.(sliderData) };
      }),
    };
  }, [sliderData]);

  const eps = useMemo(() => {
    return cal.calEPS(sliderData);
  }, [sliderData]);

  const onSliderChange = (type: SliderCategory, val: number) => {
    setSlider((prevState) => {
      return { ...prevState, ...{ [type]: val } };
    });
  };

  const onSliderInfoClick = (type: SliderCategory) => {
    setSelectedSlider(type);
  };

  const onSaveHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      chartDetails: {
        userEmail,
        peRatio,
        eps,
        company: "tesla",
        currency: "USD",
        date: Date.now(),
        unit: "BN",
        type: "sankey",
        reportingYear: "2023",
        reportingQuarter: "q3",
      },
      chartData: sliderData,
    } as SliderSaveBodyProps;

    try {
      await saveSliderValues({ data });
      setSuccessAlert("Data saved successfully.")
    } catch (err) {
      setErrorAlert(`Something went wrong while saving data: ${err}.`);
    } finally {
      setShowSaveModal(false);
    }
  };

  const sideBarData = useMemo(() => {
    if (!selectedSlider) return undefined;
    return sliderCategoryData[
      SliderCategoryInfoMaping[selectedSlider].category
    ];
  }, [selectedSlider]);

  return (
    <div className="bg-[#1d1f23] text-white h-screen w-full block overflow-y-scroll overflow-x-hidden">
      <Settings
        onChange={onSliderChange}
        defaultSliderData={defaultSliderData}
        sliderData={sliderData}
        eps={eps}
        priceTarget={(eps + 2.58) * peRatio}
        peRatio={peRatio}
        setPeRatio={setPeRatio}
        onSliderInfoClick={onSliderInfoClick}
        onSaveClick={() => setShowSaveModal(true)}
      />
      <div className="md:mt-[70px] z-0">
        <SankeyChart data={sankeyData} />
      </div>
      <SliderInfoSideBar
        showSidebar={!!selectedSlider}
        data={sideBarData}
        closeSideBar={() => {
          setSelectedSlider(null);
        }}
      />
      <Modal
        open={showSaveModal}
        header="Save Data"
        onClose={() => setShowSaveModal(false)}
      >
        <form className="w-[300px]" onSubmit={onSaveHandler}>
          <TextField
            label="Enter your email to save data"
            name="userEmail"
            type="email"
            value={userEmail}
            placeholder="Email"
            required
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={!userEmail}
            className="inline-flex w-full justify-center rounded-md py-2 mt-4 text-sm font-semibold text-white shadow-sm bg-blue-600"
          >
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Home;
