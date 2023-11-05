import React from "react";
import ReactDOM from "react-dom";
import Main from "./main";
import { BrowserRouter } from "react-router-dom";
// style
import "./main.css";
import "rc-slider/assets/index.css";

ReactDOM.render(
  <BrowserRouter>
    <Main />
  </BrowserRouter>,
  document.getElementById("root"),
);
