import React, { useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import License from "../components/License";
import SelectLocker from "../components/SelectLocker";
import { motion } from "framer-motion";
import { useLocation, useHistory } from "react-router";
import Logout from "../components/Logout";

export default function SelectPage() {
  const location = useLocation();
  // const history = useHistory();
  const employeeInfo = location.state;

  const pageTransition = {
    ease: "anticipate",
    type: "tween",
  };

  // useEffect(() => {
  //   const chkData = setTimeout(() => {
  //     if (!employeeInfo) {
  //       history.push("/employeeInfoPage");
  //     }
  //   }, 500);

  //   return () => {
  //     clearTimeout(chkData);
  //   };
  // });

  // if (!employeeInfo) {
  //   return <div className="min-vh-100 min-vw-100" />;
  // }

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
                <Card body className="mt-5 mx-4 card-size text-center shadow">
                  <h4>เลือกโซนที่ต้องการ</h4>
                  <SelectLocker employeeInfo={employeeInfo} />
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
