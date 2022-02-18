import React, { useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import Information from "../components/Information";
import Logout from "../components/Logout";
import License from "../components/License";
import Swal from "sweetalert2";
import axios from "axios";

export default function EmployeeInfoPage() {
  const history = useHistory();
  const location = useLocation();
  const employeeInfo = location.state?.[0];
  // console.log(employeeInfo);
  const pageTransition = {
    ease: "anticipate",
    type: "tween",
  };

  const handleMove = (action) => {
    history.push({
      pathname: "/user/selectPage",
      state: { ...employeeInfo, action },
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "ต้องการยกเลิก หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("/api-user/register-delete", {
            ...employeeInfo,
          })
          .then(({ data }) => {
            // console.log(data);
            if (data.state) {
              Swal.fire({
                icon: "success",
                title: "ยกเลิกรายการสำเร็จ",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                axios
                  .get(`/api-user/register/${employeeInfo.code}`)
                  .then(({ data }) => {
                    if (data.length === 0) history.push("/");

                    history.push({
                      pathname: "/user/employeeInfoPage",
                      state: data,
                    });
                  });
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "ยกเลิกรายการไม่สำเร็จ",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
      }
    });
  };

  useEffect(() => {
    const chkData = setTimeout(() => {
      // console.log(employeeInfo);
      if (employeeInfo === undefined) {
        history.push("/user/");
      }
    }, 500);

    return () => {
      clearTimeout(chkData);
    };
  });

  if (employeeInfo === undefined) {
    return <div className="min-vh-100 min-vw-100" />;
  }

  const changeButton = () => {
    const { action, zone, zoneNew } = employeeInfo;
    if (action.length === 0) {
      if (zone.length === 0) {
        return (
          <Button
            variant="info"
            className="w-100"
            onClick={() => handleMove("idle")}
          >
            จองล็อคเกอร์
            <i className="fas fa-thumbtack ms-2" />
          </Button>
        );
      } else {
        return (
          <Button
            variant="warning"
            className="w-100"
            onClick={() => handleMove("move")}
          >
            ย้ายตู้
            <i className="fas fa-arrows-alt ms-2" />
          </Button>
        );
      }
    } else {
      return (
        <Card
          body
          className={
            "py-0 shadow-sm bg-" + (action === "move" ? "warning" : "info")
          }
        >
          <Row>
            <Col>
              คำขอ<span>{action === "move" ? "ย้าย" : "จอง"}</span>
            </Col>
            <Col>
              <span>{`Zone ${zoneNew}`}</span>
            </Col>
            <Col className="text-end">
              <span className="cursor-pointer" onClick={handleCancel}>
                ❌
              </span>
            </Col>
          </Row>
        </Card>
      );
    }
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
            <Row>
              <Col xs={12} align="center">
                <h1 className="text-danger font-bold">
                  SNC{" "}
                  <span className="text-dark fw-normal fst-normal">Locker</span>
                </h1>
                <h2> Registration System</h2>
              </Col>
              <Col xs={12} align="center">
                <Card body className="mt-4 mx-4 card-size text-center shadow">
                  <Information employeeInfo={employeeInfo} />
                  <div className="pt-4">{changeButton()}</div>
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
