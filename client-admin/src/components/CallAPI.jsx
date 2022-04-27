import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { updateOverall } from "../store/slices/overallSlice";

export default function CallAPI() {
  const dispatch = useDispatch();

  const getOverallData = () => {
    axios.get("http://localhost:8090/api/overall").then(({ data }) => {
      // console.log(data);
      dispatch(updateOverall(data));
    });
  };

  useEffect(() => {
    const loadPage = setTimeout(() => {
      getOverallData();
    }, 0);

    return () => {
      clearTimeout(loadPage);
    };
  }, []);

  return <div />;
}
