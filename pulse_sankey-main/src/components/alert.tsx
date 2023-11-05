import React from "react";
import cn from "classnames";
// context
import { useAlertContext, AlertType } from "../context/AlertContext";

// This should be a dumb component and context should not be used inside!
// will fix it later
const Alert = () => {
  const { alerts, deleteAlert } = useAlertContext()
  if(!alerts?.length) return null;
  return(
    <>
      {
        alerts.map((alert) => (
          <div 
            className={cn([
              "p-4 mb-4 text-sm rounded-lg w-[250px] md:w-[400px] absolute top-4 right-4 z-50",
              {
                'text-green-600 bg-green-100': alert.type === AlertType.Success,
                'text-red-600 bg-red-100': alert.type === AlertType.Error,
              }
            ])}
            onClick={() => deleteAlert(alert.id)}
          >
            {alert.message}
          </div>
        ))
      }
    </>
  )
}

export default Alert;
