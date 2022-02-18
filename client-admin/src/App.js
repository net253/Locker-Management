import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

import { Switch, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import {
  ConfirmMove,
  Locker,
  Login,
  Record,
  Report,
  ZoneA,
  ZoneB,
  ZoneC,
  ZoneD,
} from "./pages";

import CallAPI from "./components/CallAPI";

function App() {
  const location = useLocation();
  return (
    <div>
      <CallAPI />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/admin/" component={Login} />
          <Route path="/admin/zoneA" component={ZoneA} />
          <Route path="/admin/zoneB" component={ZoneB} />
          <Route path="/admin/zoneC" component={ZoneC} />
          <Route path="/admin/zoneD" component={ZoneD} />
          <Route path="/admin/report" component={Report} />
          <Route path="/admin/locker" component={Locker} />
          <Route path="/admin/record" component={Record} />
          <Route path="/admin/confirmMove" component={ConfirmMove} />
        </Switch>
      </AnimatePresence>
    </div>
  );
}

export default App;
