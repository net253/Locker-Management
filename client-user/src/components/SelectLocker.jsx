import React, { useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router";
// import BaseSelect from "react-select";
// import FixRequiredSelect from "../components/FixRequiredSelect";
import Swal from "sweetalert2";
import axios from "axios";
import PropTypes from "prop-types";

export default function SelectLocker({ employeeInfo }) {
  const history = useHistory();
  const initialFormSelect = { zoneNew: "", lockerNoNew: "", channelNoNew: "" };
  const [formSelect, setFormSelect] = useState(initialFormSelect);

  // const [lockerQty, setLockerQty] = useState([]);
  // const [channelQty, setChannelQty] = useState([]);

  const backToInfoPage = () =>
    axios.get(`/api-user/register/${employeeInfo.code}`).then(({ data }) => {
      history.push({
        pathname: "/user/employeeInfoPage",
        state: data,
      });
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { code, action, name } = employeeInfo;

    Swal.fire({
      title: "ยืนยันการทำรายการ",
      html: `
    <p>รหัสพนักงาน : ${code}</p>
    <p>ชื่อ-สกุล พนักงาน : ${name}</p>
    <h1>Zone ${formSelect.zoneNew} </h1>
    `,

      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("/api-user/register", {
            code,
            action,
            ...formSelect,
          })
          .then(({ data }) => {
            if (data.state) {
              Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => backToInfoPage());
            } else {
              Swal.fire({
                icon: "error",
                title: "บันทึกไม่สำเร็จ",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
      }
    });
  };

  const handleCancel = () => {
    backToInfoPage();
  };

  const handleClear = () => {
    setFormSelect(initialFormSelect);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {/* Select Form */}
        <Col xs={12} align="center">
          <Form.Group controlId="formZone" className="my-4 py-0 mt-5 w-75">
            <Form.Select
              required
              className="text-center"
              value={formSelect.zoneNew}
              onChange={({ target: { value: zoneNew } }) =>
                setFormSelect({ ...formSelect, zoneNew })
              }
            >
              <option value="">เลือก Zone</option>
              <option value="A">Zone A</option>
              <option value="B">Zone B</option>
              <option value="C">Zone C</option>
              <option value="D">Zone D</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Button Form */}
        <div className="text-end">
          <Button type="submit" variant="success" className="mt-4 me-2 ">
            <i className="fas fa-check-circle" />
          </Button>

          <Button
            variant="secondary"
            className="mt-4 me-2 "
            onClick={handleClear}
          >
            <i className="far fa-trash-alt" />
          </Button>

          <Button
            variant="danger"
            className="mt-4 me-3 "
            onClick={handleCancel}
          >
            <i className="fas fa-times-circle" />
          </Button>
        </div>
      </Form>
    </>
  );
}

SelectLocker.propTypes = {
  employeeInfo: PropTypes.object.isRequired,
};
