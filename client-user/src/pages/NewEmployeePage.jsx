import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  Col,
  Container,
  Row,
  InputGroup,
  FormControl,
  Form,
  Button,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import Logout from "../components/Logout";
import License from "../components/License";

export default function NewEmployeePage() {
  const history = useHistory();
  const initialFormText = {
    nameNew: "",
    codeNew: "",
    telNew: "",
    genderNew: "",
    positionNew: "",
    zoneNew: "",
    firstDateNew: "",
  };
  const [formText, setFormText] = useState(initialFormText);

  const pageTransition = {
    ease: "anticipate",
    type: "tween",
  };

  const handleClear = () => {
    setFormText(initialFormText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "info",
      title: "ยืนยันข้อมูลพนักงาน",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      html: `
      <h3>โซน ${formText.zoneNew}</h3>
      <p>ชื่อ-สกุล: ${formText.nameNew}</p>
      <p>รหัสพนักงาน: ${formText.codeNew}</p>
      <p>เบอร์โทรศัพท์: ${formText.telNew}</p>
      <p>เพศ: ${formText.genderNew == "male" ? "ชาย" : "หญิง"}</p>
      <p>ตำแหน่ง: พนักงาน${
        formText.positionNew == "full" ? "ประจำ" : "สัญญาจ้างและอื่นๆ"
      }</p>
      `,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("/api-user/add-employee", { ...formText })
          .then(({ data }) => {
            Swal.fire({
              icon: data.state ? "success" : "error",
              title: data.state ? "บันทึกสำเร็จ" : "บันทึกไม่สำเร็จ",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              history.push("/user/");
            });
          });
      }
    });
  };

  const handleCancel = () => {
    Swal.fire({
      icon: "warning",
      title: "ยกเลิกการทำรายการ",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        history.push("/user/");
      }
    });
  };

  return (
    <>
      <Container fluid className="min-vh-100 min-vw-100">
        <div className="d-flex flex-column min-body-height">
          <Logout />
          <motion.div
            initial={{ opacity: 0, y: "1%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "1%" }}
            transition={pageTransition}
          >
            <div align="center">
              <h1 className="text-danger font-bold">
                SNC{" "}
                <span className="text-dark fw-normal fst-normal">Locker</span>
              </h1>
              <h2> Registration System</h2>
            </div>

            <Row>
              <Col xs={12} align="center">
                <Card
                  body
                  className="card-size shadow-sm text-center mt-1 p-4 mb-3"
                >
                  <h3>ข้อมูลพนักงานใหม่</h3>
                  <Form onSubmit={handleSubmit}>
                    {/* Input Form */}
                    <Row>
                      <Col xs={12}>
                        <InputGroup className="mt-4">
                          <FormControl
                            placeholder="ชื่อ-สกุล"
                            type="text"
                            className="border-end-0"
                            required
                            value={formText.nameNew}
                            onChange={({ target: { value: nameNew } }) =>
                              setFormText({ ...formText, nameNew })
                            }
                          />
                          <InputGroup.Text
                            id="basic-addon2"
                            className="bg-white"
                          >
                            <i className="fas fa-user" />
                          </InputGroup.Text>
                        </InputGroup>
                      </Col>

                      <Col xs={12} sm={6}>
                        <InputGroup className="mt-4 me-2">
                          <FormControl
                            placeholder="รหัสพนักงาน"
                            type="text"
                            className="border-end-0"
                            required
                            value={formText.codeNew}
                            onChange={({ target: { value: codeNew } }) =>
                              setFormText({ ...formText, codeNew })
                            }
                          />
                          <InputGroup.Text
                            id="basic-addon2"
                            className="bg-white"
                          >
                            <i className="fas fa-id-card" />
                          </InputGroup.Text>
                        </InputGroup>
                      </Col>

                      <Col xs={12} sm={6}>
                        <InputGroup className="mt-4 me-2">
                          <FormControl
                            placeholder="โทรศัพท์"
                            type="text"
                            className="border-end-0"
                            value={formText.telNew}
                            onChange={({ target: { value: telNew } }) =>
                              setFormText({ ...formText, telNew })
                            }
                          />
                          <InputGroup.Text
                            id="basic-addon2"
                            className="bg-white"
                          >
                            <i className="fas fa-phone" />
                          </InputGroup.Text>
                        </InputGroup>
                      </Col>

                      <Col xs={12} sm={6}>
                        <InputGroup className="mt-4">
                          <div className="w-100 opacity-75">
                            <Form.Select
                              required
                              value={formText.genderNew}
                              onChange={({ target: { value: genderNew } }) =>
                                setFormText({ ...formText, genderNew })
                              }
                            >
                              <option value="">เพศ</option>
                              <option value="male">ชาย</option>
                              <option value="female">หญิง</option>
                            </Form.Select>
                          </div>
                        </InputGroup>
                      </Col>

                      <Col xs={12} sm={6}>
                        <InputGroup className="my-4">
                          <div className="w-100 opacity-75">
                            <Form.Select
                              required
                              value={formText.positionNew}
                              onChange={({ target: { value: positionNew } }) =>
                                setFormText({ ...formText, positionNew })
                              }
                            >
                              <option value="">ตำแหน่ง</option>
                              <option value="fulltime">พนักงานประจำ</option>
                              <option value="contract">
                                พนักงานสัญญาจ้างและอื่นๆ
                              </option>
                            </Form.Select>
                          </div>
                        </InputGroup>
                      </Col>

                      <Col xs={12}>
                        <InputGroup className="mb-2">
                          <div className="w-100 opacity-75">
                            <FormControl
                              type="date"
                              required
                              value={formText.firstDateNew}
                              onChange={({ target: { value: firstDateNew } }) =>
                                setFormText({ ...formText, firstDateNew })
                              }
                            />
                          </div>
                        </InputGroup>
                      </Col>
                      <hr />

                      <h5>เลือกโซน</h5>
                      <Col xs={12}>
                        <InputGroup className="mt-2">
                          <div className="w-100 w-100 opacity-75">
                            <Form.Select
                              required
                              className="text-center"
                              value={formText.zoneNew}
                              onChange={({ target: { value: zoneNew } }) =>
                                setFormText({ ...formText, zoneNew })
                              }
                            >
                              <option value="">โซน</option>
                              <option value="A">Zone A</option>
                              <option value="B">Zone B</option>
                              <option value="C">Zone C</option>
                              <option value="D">Zone D</option>
                            </Form.Select>
                          </div>
                        </InputGroup>
                      </Col>
                    </Row>

                    {/* Button Form */}
                    <div className="text-end mt-4">
                      <Button type="submit" variant="success" className="me-2 ">
                        <i className="fas fa-check-circle" />
                      </Button>
                      <Button
                        variant="secondary"
                        className="me-2 "
                        onClick={handleClear}
                      >
                        <i className="far fa-trash-alt" />
                      </Button>
                      <Button variant="danger" onClick={handleCancel}>
                        <i className="fas fa-times-circle" />
                      </Button>
                    </div>
                  </Form>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </div>
        <License />
      </Container>
    </>
  );
}
