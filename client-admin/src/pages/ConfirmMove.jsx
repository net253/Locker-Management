import React, { useState, useEffect } from "react";
import NavMenu from "../components/NavMenu";
import { motion } from "framer-motion";
import { Container, Table, Card, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import FormFilterConfirm from "../components/FormFilterConfirm";

export default function ConfirmMove() {
  const pageTransition = {
    ease: "anticipate",
    type: "tween",
  };

  const initialFormConfirm = {
    code: "",
    name: "",
    zoneNew: "",
    lockerNoNew: "",
    channelNoNew: "",
  };

  const [show, setShow] = useState(false);

  const [requestData, setRequestData] = useState([]);
  const [lockerEmpty, setLockerEmpty] = useState([]);
  const [channelEmpty, setChannelEmpty] = useState([]);
  const [formConfirm, setFormConfirm] = useState(initialFormConfirm);

  //Check at ----------------------------------------------------------------------
  function chkAt(position, gender) {
    if (position === "fulltime") {
      return gender === "male" ? "fm" : "ff";
    } else {
      return gender === "male" ? "cm" : "cf";
    }
  }

  // Modal Handle ------------------------------------------------------------------
  const handleShow = (info) => {
    console.log(info);
    const { zoneNew, position, gender } = info;
    setShow(true);
    getLockerEmpty(zoneNew, position, gender);
    setFormConfirm({ ...formConfirm, ...info });
  };

  const handleClose = () => {
    setFormConfirm({ ...formConfirm, lockerNoNew: "", channelNoNew: "" });
    setShow(false);
  };

  // Fetch API ------------------------------------------------------------------
  const getLockerEmpty = (zone, position, gender) => {
    axios
      .get(`http://localhost:8090/api/zone-used/${zone}`)
      .then(({ data }) => {
        // console.log(data);
        setLockerEmpty(
          data
            ?.filter(
              ({ status, attribute }) =>
                status !== "full" && attribute == chkAt(position, gender)
            )
            ?.map(({ lockerNo }) => lockerNo)
        );
      });
  };

  const getRequestData = (search = "") => {
    axios
      .post(`http://localhost:8090/api/request`, { search })
      .then(({ data }) => {
        setRequestData(data);
        // console.log(data);
      });
  };

  const handleCancel = (code) => {
    Swal.fire({
      title: "ต้องการยกเลิกคำขอ หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("http://localhost:8090/api-user/register-delete", {
            code,
          })
          .then(({ data }) => {
            getRequestData();
          });
      }
    });
  };

  const selectLockerNo = (lockerNoNew) => {
    // console.log(lockerNoNew);
    const { zoneNew } = formConfirm;
    setFormConfirm({ ...formConfirm, lockerNoNew, channelNoNew: "" });

    axios
      .get(`http://localhost:8090/api/locker-used/${zoneNew}/${lockerNoNew}`)
      .then(({ data }) => {
        setChannelEmpty(
          data
            ?.filter(({ status }) => status !== "full")
            ?.map(({ channelNo }) => channelNo)
        );
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "ยืนยันการทำรายการ",
      html: `
    <p>รหัสพนักงาน : ${formConfirm.code}</p>
    <p>ชื่อ-สกุล พนักงาน : ${formConfirm.name}</p>
    <h1>${formConfirm.zoneNew} ${formConfirm.lockerNoNew} ${formConfirm.channelNoNew}</h1>
    `,

      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(formConfirm);
        axios
          .post("http://localhost:8090/api/request-confirm", {
            ...formConfirm,
          })
          .then(({ data }) => {
            if (data.state) {
              Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                setShow(false);
                setFormConfirm(initialFormConfirm);
                getRequestData();
              });
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

  useEffect(() => {
    const loadPage = setTimeout(() => {
      getRequestData();
    }, 0);

    return () => {
      clearTimeout(loadPage);
    };
  }, []);

  return (
    <>
      <NavMenu />
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: "1%" }}
        transition={pageTransition}
      >
        <Container fluid className="px-1 py-2 b-height">
          <Card body className="shadow-sm">
            <h2 className="text-center">การจัดการคำร้อง</h2>
            <FormFilterConfirm getRequestData={getRequestData} />

            <div style={{ height: "69vh", overflow: "auto" }}>
              <Table striped hover bordered className="align-middle">
                <thead className="bg-dark text-white">
                  <tr align="center">
                    <th scope="col" style={{ width: "5%" }}>
                      ลำดับที่
                    </th>
                    <th scope="col">รหัสตู้เดิม</th>
                    <th scope="col">รหัสพนักงาน</th>
                    <th scope="col" style={{ width: "18%" }}>
                      ชื่อ-สกุล
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      เพศ
                    </th>
                    <th scope="col">ตำแหน่ง</th>
                    <th scope="col">คำร้อง</th>
                    <th scope="col" style={{ width: "15%" }}>
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requestData.map((info, i) => (
                    <tr key={i} className="text-center">
                      <th>{i + 1}</th>
                      <td>
                        {info.zone
                          ? `${info.zone} ${info.lockerNo} ${info.channelNo}`
                          : "-"}
                      </td>
                      <td>{info.code}</td>
                      <td className="text-start ps-5">{info.name}</td>
                      <td>{info.gender === "male" ? "ชาย" : "หญิง"}</td>
                      <td>
                        พนักงาน
                        {info.position === "fulltime" ? "ประจำ" : "สัญญาจ้าง"}
                      </td>
                      <td>
                        Zone {info.zoneNew.toUpperCase()}{" "}
                        {info.action === "new" && (
                          <span className="badge bg-warning">new</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="success"
                          className="mx-2"
                          onClick={() => handleShow(info)}
                        >
                          <i className="fas fa-check" />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleCancel(info.code)}
                        >
                          <i className="fas fa-ban" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>

          <Modal size="md" show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                เลือกตู้และช่องใน Zone {formConfirm.zoneNew}
              </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="d-flex justify-content-center">
                  <Form.Select
                    className="mx-2"
                    required
                    value={formConfirm.zoneNew}
                    onChange={({ target: { value: zoneNew } }) => {
                      setFormConfirm({
                        ...formConfirm,
                        zoneNew,
                        lockerNoNew: "",
                        channelNoNew: "",
                      });
                      getLockerEmpty(
                        zoneNew,
                        formConfirm.position,
                        formConfirm.gender
                      );
                    }}
                  >
                    <option value="">เลือกโซน</option>
                    <option value="A">Zone A</option>
                    <option value="B">Zone B</option>
                    <option value="C">Zone C</option>
                    <option value="D">Zone D</option>
                  </Form.Select>

                  <Form.Select
                    className="mx-2"
                    required
                    value={formConfirm.lockerNoNew}
                    onChange={({ target: { value } }) => selectLockerNo(value)}
                  >
                    <option value="">เลือกตู้</option>
                    {lockerEmpty.map((lockerNo, i) => (
                      <option key={i} value={lockerNo}>
                        ตู้ที่ {lockerNo}
                      </option>
                    ))}
                  </Form.Select>

                  <Form.Select
                    className="me-2"
                    required
                    value={formConfirm.channelNoNew}
                    disabled={!formConfirm.lockerNoNew.length}
                    onChange={({ target: { value: channelNoNew } }) =>
                      setFormConfirm({ ...formConfirm, channelNoNew })
                    }
                  >
                    <option value="">เลือกช่อง</option>
                    {channelEmpty.map((channelNo, i) => (
                      <option key={i} value={channelNo}>
                        ช่องที่ {channelNo}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Modal.Body>

              <Modal.Footer>
                <Button type="submit" variant="primary">
                  ยืนยัน
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Container>
      </motion.div>
    </>
  );
}
