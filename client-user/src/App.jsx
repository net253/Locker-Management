import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import "sweetalert2/dist/sweetalert2.min.css";

import { Switch, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { Login, EmployeeInfoPage, SelectPage, NewEmployeePage } from "./pages";

export default function App() {
  const location = useLocation();
  return (
    <>
      <div className="overflow-hidden">
        <AnimatePresence exitBeforeEnter>
          <Switch location={location} key={location.pathname}>
            <Route exact path="/user/" component={Login} />
            <Route path="/user/employeeInfoPage" component={EmployeeInfoPage} />
            <Route path="/user/selectPage" component={SelectPage} />
            {/* <Route path="/user/newEmployeePage" component={NewEmployeePage} /> */}
          </Switch>
        </AnimatePresence>
      </div>
    </>
  );
}
