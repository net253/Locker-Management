import React from "react";
import { Row, Col } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export default function GaugeLockerInfo({ zone, lockerQty }) {
  const overallInfo = useSelector((state) => state.overallInfo);

  const zoneInfo = overallInfo?.find((info) => info.zone === zone);

  const percentageZone =
    ((zoneInfo?.totalLocker - zoneInfo?.emptyQty) / zoneInfo?.totalLocker) *
    100;

  return (
    <>
      <Row className="h-100 align-items-center">
        <Col xs={6} className=" d-flex justify-content-center">
          <CircularProgressbar
            value={percentageZone}
            text={`${percentageZone.toFixed(2)}%`}
            strokeWidth={10}
            className="w-75 mb-3"
            styles={buildStyles({
              textColor: "black",
              pathColor: "#02b511",
              trailColor: "white",
            })}
          />
        </Col>
        <Col xs={6} className=" d-flex h-75">
          <div className="row mx-2">
            <h4 className="text-center">Zone {zone}</h4>
            <div className="col-9">ล็อคเกอร์เปิดใช้งาน</div>
            <div className="col-3 text-end">{lockerQty} ตู้ </div>
            <div className="col-9">พนักงานประจำ</div>
            <div className="col-3 text-end">{zoneInfo?.fulltimeQty} คน</div>
            <div className="col-9">พนักงานสัญญาจ้าง</div>
            <div className="col-3 text-end">{zoneInfo?.contractQty} คน</div>
            <div className="col-9">ชาย</div>
            <div className="col-3 text-end">{zoneInfo?.maleQty} คน</div>
            <div className="col-9">หญิง</div>
            <div className="col-3 text-end">{zoneInfo?.femaleQty} คน</div>
          </div>
        </Col>
      </Row>
    </>
  );
}

GaugeLockerInfo.propTypes = {
  zone: PropTypes.string.isRequired,
  lockerQty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
