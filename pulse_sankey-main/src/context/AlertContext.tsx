import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  PropsWithChildren,
} from "react";

export enum AlertType {
  Error = "error",
  Success = "success"
}

export type Alert = {
  id: number;
  type: AlertType;
  message: JSX.Element | string;
}

export interface AlertContextType {
  alerts: Alert[];
  setAlert: (newAlert: Alert) => void;
  deleteAlert: (alertIdx: number) => void;
  setErrorAlert: (message: JSX.Element | string) => void;
  setSuccessAlert: (message: JSX.Element | string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);
let alertIdCounter = 0;

const AlertContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const setAlert = (newAlert: Alert) => {
    setAlerts((prevAlerts) => [...prevAlerts, newAlert])
  }

  const deleteAlert = (alertId: number) => {
    setAlerts((prevAlerts) => {
      return prevAlerts.filter(({ id }) => id !== alertId)
    })
  }

  const setErrorAlert = (message: JSX.Element | string) => {
    const newAlert = { type: AlertType.Error, message, id: alertIdCounter++ };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    disapearMessage(newAlert.id);
  }

  const setSuccessAlert = (message: JSX.Element | string) => {
    const newAlert = { type: AlertType.Success, message, id: alertIdCounter++ };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    disapearMessage(newAlert.id);
  }

  const disapearMessage = (id: number) => {
    setTimeout(() => {
      deleteAlert(id);
    }, 5000);
  }

  const value = useMemo(
    () => ({
      alerts,
      setAlert,
      deleteAlert,
      setErrorAlert,
      setSuccessAlert
    }),
    [alerts, setAlert, deleteAlert, setErrorAlert, setSuccessAlert],
  );

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

export default AlertContextProvider;

export const useAlertContext = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("Something went wrong with useAlertContext");
  }
  return ctx;
};
