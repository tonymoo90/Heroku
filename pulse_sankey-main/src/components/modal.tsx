import React from "react";
import cn from "classnames";
import XCircleIcon from "@heroicons/react/24/outline/XCircleIcon";

interface Modal {
  open: boolean;
  header: string;
  children?: any;
  primaryButton?: {
    label: string;
    disabled?: boolean;
    onClick: (e: any) => void;
  };
  onClose?: () => void;
}

const Modal = ({
  open = false,
  children,
  header,
  primaryButton,
  onClose,
}: Modal) => {
  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"></div>
      <div className="z-50 bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded text-black relative">
        <XCircleIcon
          className="h-6 w-6 absolute right-[10px] top-2 cursor-pointer"
          onClick={onClose}
        />
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {header}
        </h3>
        <div className="my-2">{children}</div>
        {primaryButton && (
          <div className="flex justify-end gap-2 pt-4">
            {primaryButton && (
              <button
                type="button"
                disabled={primaryButton.disabled}
                className={cn([
                  "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto",
                  !primaryButton?.disabled
                    ? "hover:bg-blue-500 bg-blue-600"
                    : "pointer-events-none cursor-not-allowed bg-gray-300",
                ])}
                onClick={(e) => primaryButton.onClick?.(e)}
              >
                {primaryButton.label}
              </button>
            )}
            {/* {onClose && <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </button>} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
