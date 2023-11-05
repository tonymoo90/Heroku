import React, { useState, ReactNode } from "react";
import cn from "classnames";
// icon
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";

import SliderCom from "rc-slider";

export enum SliderType {
  Negative = "#b81818",
  Positive = "#188c1a",
  Basic = "#545955",
}

interface Slider {
  id: string;
  label: string;
  description?: string | ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  type?: SliderType;
  prefix?: string;
  simple?: boolean;
  onChange: (val: number) => void;
  onInfoClick?: (id: string) => void;
}

const InputBubble = ({ value, prefix }: { value: number; prefix: string }) => (
  <div className="h-[20px] px-2 rounded-lg bg-zinc-700 text-[10px] flex items-center justify-center">
    {value} {prefix}
  </div>
);

const Slider = ({
  id,
  label,
  description,
  value,
  min = 0,
  max = 500,
  step = 1,
  type = SliderType.Basic,
  prefix,
  simple = false,
  onInfoClick,
  onChange,
}: Slider) => {
  const [tempVal, setTempVal] = useState<any>(value);

  return (
    <div className="text-white w-full">
      <div className={cn({ hidden: simple })}>
        <div className="flex justify-between">
          <div className="flex">
            <div className="bold text-[12px] uppercase break-all max-w-[200px]">
              {label}
            </div>
            <Squares2X2Icon
              className="h-4 w-4 ml-2 z-10"
              onClick={() => onInfoClick?.(id)}
            />
          </div>
          <InputBubble value={tempVal} prefix={prefix} />
        </div>
        <div className="text-[10px] font-light uppercase italic my-2">
          {description}
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className={cn({ hidden: !simple })}>
          <InputBubble value={tempVal} prefix={prefix} />
        </div>
        <SliderCom
          defaultValue={tempVal}
          value={tempVal}
          min={min}
          max={max}
          step={step}
          handleStyle={{ backgroundColor: "none", border: "none", opacity: 1 }}
          trackStyle={{ backgroundColor: type }}
          onChange={(val) => setTempVal(val)}
          onAfterChange={onChange}
        />
      </div>
    </div>
  );
};

export default Slider;
