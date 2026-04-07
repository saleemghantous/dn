import React, { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBarComp from "./components/NavBarComp/NavBarComp";
import 'bootstrap/dist/css/bootstrap.min.css';
// import AboutComp from "./components/AboutComp/AboutComp";
import LoginComp from "./components/LoginComp/LoginComp";
import AdminComp from "./components/AdminComp/AdminComp";
import DashboardComp from "./components/DashboardComp/DashboardComp";
import "./App.css"

function App() {

  return (
    <div className="App">
      <BrowserRouter basename="">
        <Routes>
          <Route exact path="/" element={<LoginComp/>} />
          <Route exact path="/admin" element={<AdminComp />} />
          <Route exact path="/dashboard" element={<DashboardComp />} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;



