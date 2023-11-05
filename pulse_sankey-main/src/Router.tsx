import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
// pages
const Home = lazy(() => import("../src/pages/home"));

const Router = () => (
  <Suspense fallback={"loading"}>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </Suspense>
);

export default Router;
