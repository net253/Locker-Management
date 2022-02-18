import React from "react";
import { Image, Col, Row } from "react-bootstrap";
import square from "./img/square.png";

export default function Indicator({ locker, all }) {
  return (
    <>
      <Row className=" align-items-end">
        <Col xs={6}>
          <div className="d-flex">
            <Image
              src={square}
              alt="locker"
              style={{ height: 25, backgroundColor: "#02b511" }}
              className="mx-3"
            />
            <p>ว่าง</p>
          </div>
          <div className="d-flex ">
            <Image
              src={square}
              alt="locker"
              style={{ height: 25, backgroundColor: "#ff0" }}
              className="mx-3"
            />
            <p>มีการใช้งาน</p>
          </div>
          <div className="d-flex ">
            <Image
              src={square}
              alt="locker"
              style={{ height: 25 }}
              className="mx-3 bg-danger"
            />
            <p>ไม่ว่าง</p>
          </div>
          <div className="d-flex ">
            <Image
              src={square}
              alt="locker"
              style={{ height: 25 }}
              className="mx-3"
            />
            <p>ยังไม่เปิดใช้งาน</p>
          </div>
        </Col>
        <Col xs={6} className="text-end pe-5 opacity-75">
          <h6> เปิดใช้งาน </h6>
          <h5>
            {locker} / {all}
          </h5>
        </Col>
      </Row>
    </>
  );
}
