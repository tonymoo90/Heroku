import React from "react";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// components
import Alert from "./components/alert";
// provider
import { Compose } from "./context/Compose";
import SliderContextProvider from "./context/SliderContext";
import AlertContextProvider from "./context/AlertContext";

const Main = () => {
  const providers = [
    SliderContextProvider,
    AlertContextProvider
  ];
  // Create a client
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Compose providers={providers}>
          <Alert />
          <Router />
        </Compose>
      </QueryClientProvider>
    </>
  );
};

export default Main;
