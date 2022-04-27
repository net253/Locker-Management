import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

import GaugeInfo from "../components/piechart/GaugeInfo";
import LayoutB from "../components/layout/LayoutB";
import Indicator from "../components/Indicator";
import { motion } from "framer-motion";

import "../App.css";
import NavMenu from "../components/NavMenu";

import CallZoneUsed from "../components/CallZoneUsed";

export default function ZoneB() {
  const pageTransition = {
    ease: "anticipate",
    type: "tween",
  };

  return (
    <>
      <CallZoneUsed zone="b" />
      <NavMenu />
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: "1%" }}
        transition={pageTransition}
      >
        <Container fluid>
          <Row className="b-height">
            <GaugeInfo zoneName="Zone B" />

            <Col xs={9} className="py-2 ps-0">
              <Card body className="shadow-sm h-100 b-height">
                <LayoutB />
                <Indicator locker="67" all="120" />
              </Card>
            </Col>
          </Row>
        </Container>
      </motion.div>
    </>
  );
}
