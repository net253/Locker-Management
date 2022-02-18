import React from "react";
import { Row, Col } from "react-bootstrap";

import LockerUsed from "./LockerUsed";

export default function LayoutB() {
  const fGroupNo = (num) => {
    return num < 10 ? "0" + num : num;
  };

  return (
    <>
      <Row className="align-items-center d-flex justify-content-center h-75 mb-3 mt-2">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <Col xs={3} className="m-2 px-4" key={i}>
              <div className="ps-2">
                <LockerUsed
                  zone="B"
                  num={1 + i * 10}
                  qty={5}
                  height={40}
                  used={true}
                />
                <div
                  className="bg-locker text-center"
                  style={{ width: "200px" }}
                >{`${fGroupNo(i + 1)}`}</div>
                <LockerUsed
                  zone="B"
                  num={6 + i * 10}
                  qty={5}
                  height={40}
                  used={true}
                />
              </div>
            </Col>
          ))}
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Col xs={3} className="m-2 px-4 opacity-25" key={i}>
              <div className="ps-2">
                <LockerUsed
                  zone="B"
                  num={71 + i * 10}
                  qty={5}
                  height={40}
                  used={false}
                />
                <div
                  className="bg-locker text-center"
                  style={{ width: "200px" }}
                >{`${fGroupNo(i + 8)}`}</div>
                <LockerUsed
                  zone="B"
                  num={76 + i * 10}
                  qty={5}
                  height={40}
                  used={false}
                />
              </div>
            </Col>
          ))}
      </Row>
    </>
  );
}
