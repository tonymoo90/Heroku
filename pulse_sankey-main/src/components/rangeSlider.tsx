import React, { useState, useEffect, useRef } from "react";

interface TimelineRangeSlider {
  children: React.ReactNode;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  onChange: (startDate: Date, endDate: Date) => void;
}

const TimelineRangeSlider = ({
  children,
  dateRange,
  onChange,
}: TimelineRangeSlider) => {
  const [leftPosition, setLeftPosition] = useState(0);
  const [rightPosition, setRightPosition] = useState(100);
  const sliderRef = useRef(null);
  const [sliderHeight, setSliderHeight] = useState("auto");

  useEffect(() => {
    if (sliderRef.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      setSliderHeight(`${sliderRect.height}px`);
    }
  }, []);

  const handleLeftDrag = (e: any) => {
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newPosition =
      (((e?.clientX || e.touches[0].clientX) - sliderRect.left) /
        sliderRect.width) *
      100;
    if (newPosition >= 0 && newPosition < rightPosition - 10) {
      setLeftPosition(newPosition);
    }
  };

  const handleRightDrag = (e: any) => {
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newPosition =
      (((e?.clientX || e.touches[0].clientX) - sliderRect.left) /
        sliderRect.width) *
      100;
    if (newPosition <= 100 && newPosition > leftPosition + 10) {
      setRightPosition(newPosition);
    }
  };

  useEffect(() => {
    handleDragEnd();
  }, [leftPosition, rightPosition]);

  const mouseHandler = (e: any, fn: any) => {
    e.preventDefault();
    document.addEventListener("mousemove", fn);
    document.addEventListener("touchmove", fn);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", fn);
    });
    document.addEventListener("touchend", () => {
      document.removeEventListener("touchmove", fn);
    });
  };

  const handleDragEnd = () => {
    if (!dateRange?.endDate || !dateRange?.startDate) return;
    const totalMilliseconds =
      dateRange.endDate.getTime() - dateRange.startDate.getTime();
    const startDate = new Date(
      dateRange.startDate.getTime() + totalMilliseconds * (leftPosition / 100),
    );
    const endDate = new Date(
      dateRange.startDate.getTime() + totalMilliseconds * (rightPosition / 100),
    );
    onChange(startDate, endDate);
  };

  return (
    <div className="relative w-full rounded overflow-hidden">
      <div
        className="absolute left-0 right-0 h-full bg-[#30303070]"
        style={{ left: `${leftPosition}%`, right: `${100 - rightPosition}%` }}
      />
      <div
        id="left-drag"
        className="absolute -right-1 top-[35%] w-2 h-[20px] bg-gray-300 rounded cursor-col-resize z-20"
        style={{ left: `${leftPosition}%` }}
        onMouseDown={(e) => mouseHandler(e, handleLeftDrag)}
        onTouchStart={(e) => mouseHandler(e, handleLeftDrag)}
      />
      <div
        id="right-drag"
        className="absolute -right-1 top-[35%] w-2 h-[20px] bg-gray-300 rounded cursor-col-resize z-20"
        style={{ right: `${100 - rightPosition}%` }}
        onMouseDown={(e) => mouseHandler(e, handleRightDrag)}
        onTouchStart={(e) => mouseHandler(e, handleRightDrag)}
      />
      <div className="w-full" ref={sliderRef} style={{ height: sliderHeight }}>
        {children}
      </div>
    </div>
  );
};

export default TimelineRangeSlider;
