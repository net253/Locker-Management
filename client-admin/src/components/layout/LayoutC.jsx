import React from "react";
import { Row, Col } from "react-bootstrap";

import LockerUsed from "./LockerUsed";

export default function LayoutC() {
  const fGroupNo = (num) => {
    return num < 10 ? "0" + num : num;
  };

  return (
    <>
      <Row className="align-items-center d-flex justify-content-center h-75 mb-3 mt-2">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Col xs={5} className="m-2 px-5" key={i}>
              <div className="ps-2">
                <LockerUsed
                  zone="C"
                  num={1 + i * 20}
                  qty={10}
                  height={35}
                  used={true}
                />
                <div
                  className="bg-locker text-center"
                  style={{ width: "350px" }}
                >{`${fGroupNo(i + 1)}`}</div>
                <div>
                  <LockerUsed
                    zone="C"
                    num={11 + i * 20}
                    qty={10}
                    height={35}
                    used={11 + i * 20 < 90 ? true : false}
                    // used={true}
                  />
                </div>
              </div>
            </Col>
          ))}

        {/* Disable */}
        {Array(1)
          .fill(0)
          .map((_, i) => (
            <Col xs={5} className="m-2 px-5 " key={i}>
              <div className="ps-2">
                <LockerUsed
                  zone="C"
                  num={101 + i * 20}
                  qty={10}
                  height={35}
                  used={false}
                />
                <div
                  className="bg-locker text-center"
                  style={{ width: "350px" }}
                >{`${fGroupNo(i + 6)}`}</div>
                <LockerUsed
                  zone="C"
                  num={111 + i * 20}
                  qty={10}
                  height={35}
                  used={false}
                />
              </div>
            </Col>
          ))}
      </Row>
    </>
  );
}
