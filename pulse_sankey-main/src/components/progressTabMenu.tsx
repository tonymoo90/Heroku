import React, { useEffect, useState } from "react";
import cn from "classnames";

interface Props {
  options: string[];
  mainContainerId: string;
  contentClassName: string;
}

const ProgressTabMenu = ({
  options,
  mainContainerId,
  contentClassName,
}: Props) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const tabs = document.querySelectorAll(".tab");
    const container: any = mainContainerId
      ? document.getElementById(mainContainerId)
      : window;
    const contents = document.querySelectorAll(`.${contentClassName}`);

    const handleScroll = () => {
      let newActiveTab = 0;
      let tabProgress = 0;

      contents.forEach((content: HTMLDivElement, idx) => {
        const conatinerScrollTop =
          (container?.scrollTop || container?.scrollY) + 110;
        if (
          conatinerScrollTop >= content.offsetTop &&
          conatinerScrollTop < content.offsetTop + container.clientHeight
        ) {
          newActiveTab = idx;
          const scrollProgress =
            (conatinerScrollTop - content.offsetTop) / content.clientHeight;
          tabProgress = parseInt((scrollProgress * 100).toFixed(0));
        }
      });
      setActiveTab(newActiveTab);
      setScrollPercentage(tabProgress);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      tabs.forEach((tab) => {
        tab.removeEventListener("click", () => {});
      });
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleTabClick = (idx: number) => {
    const targetContent = document.getElementById(`${contentClassName}-${idx}`);
    const container = document.getElementById(mainContainerId);
    if (!targetContent) return;

    setActiveTab(idx);
    container.scrollTo({
      top: targetContent.offsetTop - 110,
      behavior: "smooth",
    });
  };

  return (
    <>
      {options.map((option: string, idx) => (
        <div
          className={cn([
            "flex items-center text-[10px] sm:text-sm uppercase tab",
            {
              "text-gray-600": activeTab !== idx,
            },
          ])}
        >
          <div className="cursor-pointer" onClick={() => handleTabClick(idx)}>
            {option}
          </div>
          <div
            className={cn([
              "h-[2px] bg-gray-600 mx-4 rounded transition-width duration-300",
              activeTab === idx ? "w-[50px] sm:w-[100px]" : "w-0",
            ])}
          >
            <div
              className="bg-white h-[2px] rounded"
              style={{ width: `${scrollPercentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProgressTabMenu;
