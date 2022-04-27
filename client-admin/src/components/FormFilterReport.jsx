import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import BaseSelect from "react-select";
import FixRequiredSelect from "../components/FixRequiredSelect";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { updatePresentUsed } from "../store/slices/presentUsedSlice";

export default function FormFilterReport() {
  const dispatch = useDispatch();
  const presentInfo = useSelector((state) => state.presentInfo);
  const initialFormFilter = { zone: "", lockerNo: "" };
  const [formFilter, setFormFilter] = useState(initialFormFilter);
  const [usedLocker, setUsedLocker] = useState([]);

  // const fLockerNo = (num) => {
  //   return num < 10 ? `00` + num : num < 100 ? `0` + num : num;
  // };

  const options = [
    { value: "all", label: "ทั้งหมด" },
    { value: "A", label: "Zone A" },
    { value: "B", label: "Zone B" },
    { value: "C", label: "Zone C" },
    { value: "D", label: "Zone D" },
  ];

  const Select = (props) => (
    <FixRequiredSelect
      {...props}
      SelectComponent={BaseSelect}
      options={props.options}
    />
  );

  const getPresentData = (zone = "", lockerNo = "") => {
    axios
      .post("http://localhost:8090/api/present", { zone, lockerNo })
      .then(({ data }) => {
        // console.log(data);
        dispatch(updatePresentUsed(data));
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const zone = formFilter.zone?.value || "";
    const lockerNo = formFilter.lockerNo?.value || "";

    // console.log(zone, lockerNo);
    getPresentData(zone, lockerNo);
  };

  const clearSelecter = () => {
    setFormFilter(initialFormFilter);
    setUsedLocker([]);
    getPresentData();
  };

  const selectZone = (zone) => {
    setFormFilter({ ...formFilter, zone });
    setUsedLocker([...presentInfo.filter((info) => info.zone === zone.value)]);
  };

  return (
    <>
      <Form onSubmit={handleSearch}>
        <div className="d-flex justify-content-start" id="formZone">
          <Form.Group
            controlId="formZone"
            className="me-3"
            style={{ width: "8%" }}
          >
            <Select
              value={formFilter.zone}
              onChange={(zone) => selectZone(zone)}
              menuPlacement="auto"
              menuPosition="fixed"
              placeholder="Zone"
              classNamePrefix="select"
              name="zone"
              options={options}
              // required
            />
          </Form.Group>

          <Form.Group
            controlId="formLockerNo"
            className="me-2"
            style={{ width: "10%" }}
          >
            <Select
              defaultValue={formFilter.lockerNo}
              onChange={(lockerNo) =>
                setFormFilter({ ...formFilter, lockerNo })
              }
              menuPlacement="auto"
              menuPosition="fixed"
              placeholder="หมายเลขตู้"
              classNamePrefix="select"
              name="lockerNo"
              options={usedLocker
                .map(({ lockerNo }) => lockerNo)
                .filter((lockerNo, i, self) => self.indexOf(lockerNo) === i)
                .map((lockerNo) => ({
                  value: `${lockerNo}`,
                  label: `ตู้ที่ ${lockerNo}`,
                }))}
            />
          </Form.Group>

          <Button variant="secondary" className="py-0 mx-1" type="submit">
            <i className="fas fa-search" />
          </Button>
          <Button
            variant="danger"
            className="py-0 mx-1"
            type="button"
            onClick={clearSelecter}
          >
            <i className="far fa-trash-alt" />
          </Button>
        </div>
      </Form>
    </>
  );
}
