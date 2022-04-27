import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { updateUsedZone } from "../store/slices/usedZoneSlice";

export default function CallZoneUsed({ zone }) {
  const dispatch = useDispatch();
  const getZoneUsed = () => {
    axios
      .get(`http://localhost:8090/api/zone-used/${zone}`)
      .then(({ data }) => {
        // console.log(data);
        dispatch(updateUsedZone(data));
      });
  };

  useEffect(() => {
    const loadPage = setTimeout(() => {
      getZoneUsed();
    }, 0);

    return () => {
      clearTimeout(loadPage);
    };
  }, []);
  return <div />;
}
