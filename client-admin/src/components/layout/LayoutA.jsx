import React from "react";
import { Row, Col } from "react-bootstrap";
import LockerUsed from "./LockerUsed";

export default function LayoutA() {
  const fGroupNo = (num) => {
    return num < 10 ? "0" + num : num;
  };

  return (
    <>
      <Row className="align-items-center d-flex justify-content-center h-75 mb-4">
        {/* Group 1-9 */}
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <Col xs={2} className="m-2" key={i}>
              <div className="ps-2">
                <LockerUsed
                  zone="A"
                  num={1 + i * 8}
                  qty={4}
                  height={35}
                  used={true}
                />
                <div
                  className="bg-locker text-center"
                  style={{ width: "140px" }}
                >
                  {`${fGroupNo(i + 1)}`}
                </div>
                <div className={`${5 + i * 8 < 67 ? "" : "opacity-25"}`}>
                  <LockerUsed
                    zone="A"
                    num={5 + i * 8}
                    qty={4}
                    height={35}
                    used={5 + i * 8 < 67 ? true : false}
                  />
                </div>
              </div>
            </Col>
          ))}

        {/* Group 10 */}
        {Array(1)
          .fill(0)
          .map((_, i) => (
            <Col xs={2} className="m-2 opacity-25" key={i}>
              <div className="ps-2">
                <LockerUsed
                  zone="A"
                  num={73 + i * 8}
                  qty={4}
                  height={35}
                  used={false}
                />
                <div
                  className="bg-locker text-center"
                  style={{ width: "140px" }}
                >
                  {`${fGroupNo(i + 10)}`}
                </div>
                <LockerUsed
                  zone="A"
                  num={77 + i * 8}
                  qty={4}
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
