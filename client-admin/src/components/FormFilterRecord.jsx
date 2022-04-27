import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import BaseSelect from "react-select";
import FixRequiredSelect from "../components/FixRequiredSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { updateHistory } from "../store/slices/historySlice";
import fdatetime from "../libs/fdatetime";

export default function FormFilterReport() {
  const dispatch = useDispatch();
  const overallInfo = useSelector((state) => state.overallInfo);
  const [lockerQty, setLockerQty] = useState(0);

  const initialFormFileter = {
    zone: "",
    lockerNo: "",
    channelNo: "",
    startDate: "",
    endDate: "",
    action: "",
  };

  const [formFilter, setFormFilter] = useState(initialFormFileter);
  // console.log(formFilter);

  const clearSelecter = () => {
    setFormFilter(initialFormFileter);

    axios
      .post("http://localhost:8090/api/history", {
        zone: "A",
      })
      .then(({ data }) => {
        dispatch(updateHistory(data));
      });
  };

  const options = [
    { value: "all", label: "ทั้งหมด" },
    { value: "A", label: "Zone A" },
    { value: "B", label: "Zone B" },
    { value: "C", label: "Zone C" },
    { value: "D", label: "Zone D" },
  ];

  const actionOptions = [
    { value: "", label: "ทั้งหมด" },
    { value: "checkin", label: "Check in" },
    { value: "checkout", label: "Check out" },
  ];

  const fLockerNo = (num) => {
    return num < 10 ? `00` + num : num < 100 ? `0` + num : num;
  };
  const fChannelNo = (num) => {
    return num + 1 < 10 ? "0" + num : num;
  };

  const Select = (props) => (
    <FixRequiredSelect
      {...props}
      SelectComponent={BaseSelect}
      options={props.options}
    />
  );

  const handleSearch = (e) => {
    e.preventDefault();

    const zone = formFilter.zone?.value || "";
    const lockerNo = formFilter.lockerNo?.value || "";
    const channelNo = formFilter.channelNo?.value || "";
    let startDate = formFilter.startDate || "";
    startDate = fdatetime(startDate).getFDate;
    let endDate = formFilter.endDate || "";
    endDate = fdatetime(endDate).getFDate;
    const action = formFilter.action?.value || "";

    console.log(zone, lockerNo, channelNo, startDate, endDate, action);

    axios
      .post("http://localhost:8090/api/history", {
        zone,
        lockerNo,
        channelNo,
        startDate,
        endDate,
        action,
      })
      .then(({ data }) => {
        dispatch(updateHistory(data));
      });
  };

  const selectZone = (zone) => {
    setFormFilter({ ...formFilter, zone });
    if (zone.value !== "all") {
      const { totalLocker } = overallInfo.find(
        (info) => info.zone === zone.value
      );
      setLockerQty(totalLocker / 15);
    }
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
              required
            />
          </Form.Group>

          <Form.Group
            controlId="formLockerNo"
            className="me-2"
            style={{ width: "10%" }}
          >
            <Select
              value={formFilter.lockerNo}
              onChange={(lockerNo) =>
                setFormFilter({ ...formFilter, lockerNo })
              }
              menuPlacement="auto"
              menuPosition="fixed"
              placeholder="หมายเลขตู้"
              classNamePrefix="select"
              name="lockerNo"
              options={Array(lockerQty)
                .fill(0)
                .map((_, i) => ({
                  value: `${fLockerNo(i + 1)}`,
                  label: `ตู้ที่ ${fLockerNo(i + 1)}`,
                }))}
            />
          </Form.Group>

          <Form.Group
            controlId="formSlot"
            className="me-3"
            style={{ width: "10%" }}
          >
            <Select
              value={formFilter.channelNo}
              onChange={(channelNo) =>
                setFormFilter({ ...formFilter, channelNo })
              }
              menuPlacement="auto"
              menuPosition="fixed"
              placeholder="หมายเลขช่อง"
              classNamePrefix="select"
              name="channelno"
              options={Array(15)
                .fill(0)
                .map((_, i) => ({
                  value: `${fChannelNo(i + 1)}`,
                  label: `ช่องที่ ${fChannelNo(i + 1)}`,
                }))}
            />
          </Form.Group>

          <Form.Group controlId="formDate" className="me-3">
            <DatePicker
              placeholderText="วันเริ่ม - สิ้นสุด"
              dateFormat="dd/MM/yyyy"
              selectsRange={true}
              startDate={formFilter.startDate}
              endDate={formFilter.endDate}
              onChange={([startDate, endDate]) => {
                setFormFilter({ ...formFilter, startDate, endDate });
              }}
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formStatus" className="me-3">
            <Select
              value={formFilter.action}
              onChange={(action) => setFormFilter({ ...formFilter, action })}
              menuPlacement="auto"
              menuPosition="fixed"
              placeholder="สถานะ"
              classNamePrefix="select"
              name="zone"
              options={actionOptions}
              // required
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
