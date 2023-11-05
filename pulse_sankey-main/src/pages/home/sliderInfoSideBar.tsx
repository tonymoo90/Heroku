import React, { useRef, useState, useMemo, useEffect } from "react";
import axios from "axios";
import { format, subMonths } from "date-fns";
import cn from "classnames";
import { useQuery } from "@tanstack/react-query";
// component
import SideBar from "../../components/sideBar";
import LineChart, {
  LineChartData,
  ZoomType,
  zoomsConfig,
} from "../../components/charts/line";
// hooks
import useOnOutsideClick from "../../hooks/useOnClickOutside";
import { useSliderContext } from "../../context/SliderContext";
// types
import { SliderMappingDataProps } from "../../context/SliderContext";
// icons
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
// Date
import { SliderSettings, SliderType } from "../../config/sankey";

interface SliderInfoSideBar {
  showSidebar: boolean;
  data?: SliderMappingDataProps;
  closeSideBar: () => void;
}

const SliderInfoSideBar = ({
  showSidebar = false,
  data,
  closeSideBar,
}: SliderInfoSideBar) => {
  const sideBarRef = useRef<HTMLDivElement>();
  const [activeTab, setActiveTab] = useState(0);
  const [activeZoom, setActiveZoom] = useState(ZoomType.ALL);
  const { selectedSlider } = useSliderContext();
  const [timelineFilter, setTimeLineFilter] = useState<{
    startDate: Date;
    endDate: Date;
  }>();

  useOnOutsideClick(sideBarRef.current, () => {
    if (!showSidebar) return;
    setActiveZoom(ZoomType.ALL);
    setActiveTab(0);
    closeSideBar();
  });

  const { data: chartData, isLoading } = useQuery({
    queryKey: ["fetchChartData", data?.link],
    queryFn: async (): Promise<LineChartData[]> => {
      if (!data?.link) return [];
      const res = await axios.get(data.link);
      return res?.data as LineChartData[];
    },
  });

  const filteredChartData = useMemo(() => {
    if (!chartData?.length) return [];
    if (activeZoom !== ZoomType.ALL) {
      const months = zoomsConfig.find(({ label }) => label === activeZoom)?.val;
      return chartData
        .filter(({ date }) => new Date(date) >= subMonths(new Date(), months))
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
    }
    return chartData;
  }, [activeZoom, chartData]);

  useEffect(() => {
    if (!filteredChartData.length) return;
    setTimeLineFilter({
      startDate: new Date(filteredChartData[0].date),
      endDate: new Date(filteredChartData[filteredChartData.length - 1].date),
    });
  }, [filteredChartData]);

  const timeLineFilteredData = useMemo(() => {
    if (!timelineFilter?.startDate) return filteredChartData;
    return filteredChartData.filter(
      ({ date }) =>
        new Date(date) >= timelineFilter?.startDate &&
        new Date(date) <= timelineFilter?.endDate,
    );
  }, [filteredChartData, timelineFilter]);

  const stats = useMemo((): [string, string, number, string, boolean][] => {
    if (!timeLineFilteredData?.length || !data) return [];
    const latest = timeLineFilteredData[timeLineFilteredData.length - 1];
    const max = timeLineFilteredData[timeLineFilteredData.length - 1];
    const min = timeLineFilteredData[0];
    const prefix = SliderSettings[selectedSlider]?.prefix || "";

    const firstVal = timeLineFilteredData[0].value;
    let changeValue = latest.value - firstVal;
    if (prefix !== "%") {
      changeValue = (changeValue / Math.abs(firstVal)) * 100;
    }

    let isChangePositive = true;
    if (SliderSettings[selectedSlider].type === SliderType.Positive) {
      isChangePositive = changeValue >= 0;
    } else {
      isChangePositive = changeValue < 0;
    }

    return [
      [
        "latest",
        format(new Date(latest.date), "'Q'Q yyyy"),
        latest.value,
        prefix,
        true,
      ],
      [
        "change",
        `Since ${format(new Date(min.date), "'Q'Q yyyy")}`,
        parseFloat(changeValue.toFixed(1)),
        "%",
        isChangePositive,
      ],
      [
        "maximum",
        format(new Date(max.date), "'Q'Q yyyy"),
        max.value,
        prefix,
        true,
      ],
      [
        "minimum",
        format(new Date(min.date), "'Q'Q yyyy"),
        min.value,
        prefix,
        true,
      ],
    ];
  }, [timeLineFilteredData]);

  const Button = ({
    text,
    active = false,
  }: {
    text: string;
    active?: boolean;
  }) => (
    <button
      className={cn([
        "bg-transparen py-2 px-10 border rounded-xl",
        {
          "text-white border-green-500": active,
          "text-gray-400 border-0": !active,
        },
      ])}
    >
      {text}
    </button>
  );

  const onZoomChange = (zoom: ZoomType) => {
    setActiveZoom(zoom);
  };

  const timeLineDates = {
    startDate: new Date(filteredChartData?.[0]?.date),
    endDate: new Date(filteredChartData[filteredChartData.length - 1]?.date),
  };

  return (
    <SideBar open={showSidebar}>
      <div className="bg-[#232323] h-full overflow-auto" ref={sideBarRef}>
        {showSidebar && (
          <XMarkIcon
            className="h-5 w-5 absolute top-[10px] right-[12px] pointer"
            onClick={closeSideBar}
          />
        )}
        <div className="p-6 mt-2">
          <LineChart
            data={timeLineFilteredData}
            timeLineData={filteredChartData}
            category={data?.category}
            activeZoom={activeZoom}
            parentRef={sideBarRef}
            isLoading={isLoading}
            prefix={SliderSettings[selectedSlider]?.prefix}
            timelineFilter={timeLineDates}
            onTimelineFilterChange={(startDate, endDate) =>
              setTimeLineFilter({ startDate, endDate })
            }
            onZoomChange={onZoomChange}
          />
          <div className="flex flex-wrap uppercase mt-4 justify-between px-2 py-2 md:px-6 md:py-4 bg-[#2d2d2e] rounded-md">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <h3 className="text-[10px] sm:text-[16px]">{stat[0]}</h3>
                <p className="text-[10px] text-gray-400">{stat[1]}</p>
                <h1
                  className={cn([
                    "font-bold text-[12px] sm:text-[22px]",
                    stat[4] ? "text-green-500" : "text-red-500",
                  ])}
                >
                  {`${stat[2]}${stat[3]}`}
                </h1>
              </div>
            ))}
          </div>
        </div>
        <h1 className="py-4 text-center bg-black">
          {SliderSettings?.[selectedSlider]?.label?.toUpperCase()}
        </h1>
        <div className="p-6 text-[14px] overflow-hidden">
          <div className="flex justify-between w-[350px] m-auto mb-6">
            <Button text="SUMMARY" active={activeTab === 0} />
            <Button text="DATA" active={activeTab === 1} />
          </div>
          {data?.description}
        </div>
      </div>
    </SideBar>
  );
};

export default SliderInfoSideBar;
