import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Modal,
  Button,
  Table,
  Spinner,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";

import NavMenu from "../components/NavMenu";
import GaugeLockerInfo from "../components/locker/GaugeLockerInfo";
import ChannelInfo from "../components/locker/ChannelInfo";
import LockerInfo from "../components/locker/LockerInfo";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import axios from "axios";

import "../App.css";
import { updateLocker } from "../store/slices/lockerSlice";

const GenderSymbol = ({ gender }) => {
  return gender === "male" ? (
    <i className="fas fa-male fa-2x" />
  ) : gender === "female" ? (
    <i className="fas fa-female fa-2x" />
  ) : (
    ""
  );
};

export default function Locker() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  // console.log(location.state);
  const { zone, lockerNo, channelNo } = location.state;
  const { lockerInfo, zoneUsedInfo } = useSelector((state) => state);
  const [isShown, setIsShown] = useState(false);
  const [chInfo, setChInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [listName, setListName] = useState([]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const fGroupNo = (num) => {
    return num < 10 ? "0" + num : num;
  };

  const pageTransition = {
    ease: "anticipate",
    type: "tween",
  };

  const updateLockerInfo = () => {
    axios
      .get(`http://localhost:8090/api/locker-used/${zone}/${lockerNo}`)
      .then(({ data }) => {
        if (data.length > 0) {
          dispatch(updateLocker(data));
        }
      });
  };

  const handleCheckIn = (info) => {
    setChInfo(info);
    if (info.status !== "reserve") {
      if (info.status === "full") {
        Swal.fire({
          title: "ต้องการ Check out ใช่หรือไม่?",
          html: `
        <h3>${info.zone} ${info.lockerNo} ${info.channelNo}</h3>
        <p>รหัสพนักงาน: ${info.code}</p>
        <p>ชื่อ-สกุล: ${info.name}</p>
        `,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#02b511",
          cancelButtonColor: "#d33",
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ยกเลิก",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "หลังจาก Check out ข้อมูลจะหายไป ยืนยันคำขอ?",
              html: `
            <h3>${info.zone} ${info.lockerNo} ${info.channelNo}</h3>
            <p>รหัสพนักงาน: ${info.code}</p>
            <p>ชื่อ-สกุล: ${info.name}</p>
            `,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#02b511",
              cancelButtonColor: "#d33",
              confirmButtonText: "ยืนยัน",
              cancelButtonText: "ยกเลิก",
            }).then((result) => {
              if (result.isConfirmed) {
                axios
                  .post("http://localhost:8090/api/check-out", { ...info })
                  .then(({ data }) => {
                    // console.log(data);
                    Swal.fire({
                      icon: data.state ? "success" : "error",
                      title: data.state
                        ? "Check out สำเร็จ"
                        : "Check out ไม่สำเร็จ",
                      showConfirmButton: false,
                      timer: 1500,
                    }).then(() => updateLockerInfo());
                  });
              }
            });
          }
        });
      } else {
        Swal.fire({
          title: `${info.zone} ${info.lockerNo} ${info.channelNo}`,
          input: "text",
          inputPlaceholder: "รหัสพนักงาน",
          showCancelButton: true,
          confirmButtonColor: "#02b511",
          cancelButtonColor: "#d33",
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ยกเลิก",

          inputValidator: (value) => {
            if (!value) {
              return "กรุณาระบุรหัสพนักงาน.";
            }
          },
        }).then((result) => {
          if (result.isConfirmed) {
            // console.log(result.value);
            const search = result.value;
            const action = "checkin";
            axios
              .post(`http://localhost:8090/api/search`, { search, action })
              .then(({ data }) => {
                if (data.length === 0) {
                  Swal.fire({
                    icon: "error",
                    html: `<h2>ไม่พบข้อมูลพนักงาน</h2>
                  <h2>หรือ</h2>
                  <h2>พนักงานทั้งหมด Check in แล้ว</h2>`,
                    confirmButtonText: "ตกลง",
                  });
                } else {
                  // console.log(data);
                  setListName(data);
                  handleShowModal();
                }
              });
          }
        });
      }
    }
  };

  const handleSelectCheckIn = (info) => {
    Swal.fire({
      title: "ต้องการ Check in ใช่หรือไม่?",
      html: `
      <h3>${chInfo.zone} ${chInfo.lockerNo} ${chInfo.channelNo}</h3>
      <p>รหัสพนักงาน: ${info.code}</p>
      <p>ชื่อ-สกุล: ${info.name}</p>
      <p>เพศ: ${info.gender === "male" ? "ชาย" : "หญิง"}</p>
      <p>ตำแหน่ง: ${
        info.position === "fulltime" ? "พนักงานประจำ" : "พนักงานสัญญาจ้าง"
      }</p>
      <p>วันเริ่มงาน: ${info.firstDate?.split("-")?.reverse()?.join("/")}</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#02b511",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log({ ...chInfo, code: info.code });
        axios
          .post("http://localhost:8090/api/check-in", {
            ...chInfo,
            code: info.code,
          })
          .then(({ data }) => {
            Swal.fire({
              icon: data.state ? "success" : "error",
              title: data.state ? "Check in สำเร็จ" : "Check in ไม่สำเร็จ",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              updateLockerInfo();
              handleCloseModal();
            });
          });
      }
    });
  };

  const handleMouseEnter = (info) => {
    setIsShown(true);
    setChInfo(info);
    if (channelNo === info.channelNo) {
      location.state = { ...location.state, channelNo: "" };
    }
  };

  useEffect(() => {
    const timerWaiting = setTimeout(() => {
      if (lockerInfo.length === 0) {
        history.push("/admin/zoneA");
      }
    }, 1000);

    return () => {
      clearTimeout(timerWaiting);
    };
  }, []);

  if (lockerInfo.length === 0) {
    return (
      <>
        <NavMenu />
        <div
          className="border d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <Spinner animation="border" variant="warning" />
        </div>
      </>
    );
  }

  return (
    <>
      <NavMenu />
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: "1%" }}
        transition={pageTransition}
      >
        <Container fluid>
          <Row className="b-height">
            <Col xs={6} className="py-2 ps-2">
              <Card body className="shadow-sm h-50 mb-1 ">
                <GaugeLockerInfo zone={zone} lockerQty={zoneUsedInfo?.length} />
              </Card>
              <Card className="shadow-sm h-50">
                <Row className="h-100 align-items-center">
                  <LockerInfo
                    zone={zone}
                    lockerNo={lockerNo}
                    lockerInfo={lockerInfo}
                  />
                  {isShown && <ChannelInfo chInfo={chInfo} />}
                </Row>
              </Card>
            </Col>

            <Col xs={6} className="py-2 ps-0">
              <Card className="shadow-sm h-100 mb-0">
                <Row className="h-100">
                  <Col
                    xs={4}
                    className="px-5 py-4 justify-content-end d-flex flex-column"
                  >
                    <Row>
                      <Col xs={4} className="text-end">
                        <p className="fas fa-male fa-2x" />
                      </Col>
                      <Col xs={8}>
                        <p>ชาย</p>
                      </Col>
                      <Col xs={4} className="text-end">
                        <p className="fas fa-female fa-2x" />
                      </Col>
                      <Col xs={8}>
                        <p>หญิง</p>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={8} className="px-4 py-2">
                    <Card className="h-100 px-3 py-1 border-dark shadow-sm">
                      <div align="center">
                        {lockerInfo.map((info, i) => (
                          <button
                            className={
                              "mx-3 my-2 p-0 border-dark btn btn-outline-light text-dark text-center channel-hover" +
                              (Number(channelNo) === i + 1
                                ? " channel-target"
                                : "")
                            }
                            key={i}
                            type="button"
                            style={{ height: 110, width: 110 }}
                            onClick={() => handleCheckIn(info)}
                            onMouseEnter={() => handleMouseEnter(info)}
                            onMouseLeave={() => setIsShown(false)}
                          >
                            <Col xs={12} className="h-25">
                              <h3>{`${fGroupNo(i + 1)}`}</h3>
                            </Col>
                            <Col xs={12} className="h-50 pt-3">
                              {info.status !== "reserve" ? (
                                <GenderSymbol gender={info.gender} />
                              ) : (
                                <i className="fas fa-thumbtack fa-lg" />
                              )}
                            </Col>
                          </button>
                        ))}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </motion.div>

      <Modal size="lg" show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>รายชื่อพนักงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped hover>
            <tbody>
              {listName.map((info, i) => (
                <tr key={i} align="center">
                  <th scope="row" style={{ width: "20%" }}>
                    {info.code}
                  </th>
                  <td>{info.name}</td>
                  <td style={{ width: "20%" }}>
                    {info.position === "fulltime"
                      ? "พนักงานประจำ"
                      : "พนักงานสัญญาจ้าง"}
                  </td>
                  <td>{info.gender === "male" ? "ชาย" : "หญิง"}</td>
                  <td style={{ width: "10%" }}>
                    {info.action.length > 0 ? (
                      <span className="text-danger py-2">มีคำร้อง</span>
                    ) : (
                      <i
                        className="fas fa-user-check text-success btn"
                        onClick={() => handleSelectCheckIn(info)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

GenderSymbol.propTypes = {
  gender: PropTypes.string.isRequired,
};
