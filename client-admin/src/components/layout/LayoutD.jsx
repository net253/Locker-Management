import React from "react";
import { Row, Col } from "react-bootstrap";

import LockerUsed from "./LockerUsed";

export default function LayoutD() {
  const fGroupNo = (num) => {
    return num < 10 ? "0" + num : num;
  };

  return (
    <>
      <Row className="align-items-center d-flex justify-content-center h-75 mb-3 mt-2">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Col xs={5} className="m-2 px-5" key={i}>
              <div className="ps-2">
                <LockerUsed
                  zone="D"
                  num={1 + i * 20}
                  qty={10}
                  height={35}
                  used={true}
                />
                <div
                  className={`bg-locker text-center `}
                  style={{ width: "350px" }}
                >{`${fGroupNo(i + 1)}`}</div>
                <div>
                  <LockerUsed
                    zone="D"
                    num={11 + i * 20}
                    qty={10}
                    height={35}
                    used={11 + i * 20 < 30 ? true : false}
                    // used={true}
                  />
                </div>
              </div>
            </Col>
          ))}

        {/* Disable */}
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Col xs={5} className="m-2 px-5" key={i}>
              <div className="ps-2">
                <LockerUsed
                  zone="D"
                  num={41 + i * 20}
                  qty={10}
                  height={35}
                  used={false}
                />
                <div
                  className="bg-locker text-center"
                  style={{ width: "350px" }}
                >{`${fGroupNo(i + 3)}`}</div>
                <LockerUsed
                  zone="D"
                  num={51 + i * 20}
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
