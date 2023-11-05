import axios from "axios";
import axiosInstance from "../config/axios";
// types
import { SliderMappingDataProps } from "../context/SliderContext";
import { SliderData } from "../pages/home";

export type SliderSaveBodyProps = {
  chartDetails: {
    userEmail: string;
    peRatio: number;
    eps: number;
    company: string;
    currency: string;
    date: number;
    unit: string;
    type: string;
    reportingYear: string;
    reportingQuarter: string;
  };
  chartData: SliderData;
};

export const fetchSliderMapping = async (): Promise<{
  data: SliderMappingDataProps[];
}> => {
  return axiosInstance.get("modalmappingv2.json");
};

export const saveSliderValues = async ({
  data,
}: {
  data: SliderSaveBodyProps;
}): Promise<any> => {
  return axios.post(
    "https://y8twn5kxlf.execute-api.us-east-1.amazonaws.com/default/Pulse_Demo",
    data,
    { withCredentials: false },
  );
};
