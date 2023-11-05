import React, { RefObject } from "react";
import cn from "classnames";

interface SideBar {
  children?: JSX.Element;
  open: boolean;
  ref?: RefObject<HTMLDivElement>;
}

const SideBar = ({ children, open, ref }: SideBar) => {
  return (
    <div
      ref={ref}
      className={cn([
        "fixed top-0 right-0 bottom-0 bg-black",
        open
          ? "transition-width duration-500 w-full sm:w-[600px] px-2 z-20"
          : "w-0",
      ])}
    >
      {children}
    </div>
  );
};

export default SideBar;
