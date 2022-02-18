import React from "react";
import { Card, Col, Image, Row } from "react-bootstrap";
import square from "../img/square.png";
import CheckIn from "./CheckIn";

export default function Channel() {
  const fGroupNo = (num) => {
    return num < 10 ? "0" + num : num;
  };

  const logo = (num) => {
    return num % 2 ? (
      <i className="fas fa-female fa-2x" />
    ) : num % 3 ? (
      ""
    ) : (
      <i className="fas fa-male fa-2x" />
    );
  };

  return (
    <>
      <Row className="h-100">
        <Col
          xs={4}
          className="px-5 py-4 justify-content-end d-flex flex-column"
        >
          <div className="d-flex">
            <Image
              src={square}
              alt="locker"
              style={{ height: 25 }}
              className="mx-3"
            />
            <p>ว่าง</p>
          </div>
          <div className="d-flex ">
            <Image
              src={square}
              alt="locker"
              style={{ height: 25 }}
              className="mx-3 bg-danger"
            />
            <p>มีการใช้งาน</p>
          </div>
        </Col>

        <Col xs={8} className="px-4 py-2">
          <Card className="h-100 px-3 py-1 border-dark shadow-sm">
            <div align="center">
              {Array(15)
                .fill(0)
                .map((_, i) => (
                  <button
                    className="mx-3 my-2 p-0 border-dark btn btn-outline-light text-dark"
                    key={i}
                    type="button"
                    style={{ height: 110, width: 110 }}
                    onClick={CheckIn}
                  >
                    <Col xs={12} className="h-25">
                      <h3>{`${fGroupNo(i + 1)}`}</h3>
                    </Col>
                    <Col xs={12} className="h-50 pt-3">
                      {logo(i)}
                    </Col>
                  </button>
                ))}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
