import React from "react";
import { Col, Card } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Piestyle.css";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

export default function GaugeInfo({ zoneName }) {
  const overallInfo = useSelector((state) => state.overallInfo);

  const sumOverall = () => {
    let usedQty = 0;
    let totalQty = 0;
    let fulltimeQty = 0;
    let contractQty = 0;
    let maleQty = 0;
    let femaleQty = 0;

    overallInfo.forEach((info) => {
      usedQty += info.totalLocker - info.emptyQty;
      totalQty += info.totalLocker;
      fulltimeQty += info.fulltimeQty;
      contractQty += info.contractQty;
      maleQty += info.maleQty;
      femaleQty += info.femaleQty;
    });

    return { usedQty, totalQty, fulltimeQty, contractQty, maleQty, femaleQty };
  };

  const overallPercentage =
    (sumOverall()?.usedQty / sumOverall()?.totalQty) * 100;

  const zoneInfo = overallInfo.find(
    ({ zone }) => zone === zoneName.split(" ")[1]
  );

  const zonePercentage =
    ((zoneInfo?.totalLocker - zoneInfo?.emptyQty) / zoneInfo?.totalLocker) *
    100;

  return (
    <>
      <Col xs={3} className=" py-2">
        {/* Card Overall */}
        <Card className="shadow-sm" style={{ height: "55%" }}>
          <Card.Body>
            <div className="text-center">
              <h3>Overall</h3>
              <CircularProgressbar
                value={overallPercentage}
                text={`${overallPercentage.toFixed(2)}%`}
                strokeWidth={10}
                className="w-s-pie mb-3"
                styles={buildStyles({
                  textColor: "black",
                  pathColor: "#02b511",
                  trailColor: "white",
                })}
              />
            </div>

            <div className="row mx-2">
              <div className="col-8">จำนวนช่องเก็บของทั้งหมด</div>
              <div className="col-4 text-end">
                {sumOverall()?.totalQty} ช่อง
              </div>
              <div className="col-8">พนักงานประจำ</div>
              <div className="col-4 text-end">
                {sumOverall()?.fulltimeQty} คน
              </div>
              <div className="col-8">พนักงานสัญญาจ้าง</div>
              <div className="col-4 text-end">
                {sumOverall()?.contractQty} คน
              </div>
              <div className="col-8">ชาย</div>
              <div className="col-4 text-end">{sumOverall()?.maleQty} คน</div>
              <div className="col-8">หญิง</div>
              <div className="col-4 text-end">{sumOverall()?.femaleQty} คน</div>
            </div>
          </Card.Body>
        </Card>

        {/* Zone */}
        <Card className="my-2 shadow-sm " style={{ height: "44%" }}>
          <Card.Body>
            <div className="text-center">
              <h3>{zoneName}</h3>
              <CircularProgressbar
                value={zonePercentage}
                text={`${zonePercentage.toFixed(2)}%`}
                strokeWidth={5}
                className="w-s-pie my-2"
                styles={buildStyles({
                  textColor: "black",
                  pathColor: "red",
                  trailColor: "white",
                })}
              />
            </div>
            <div className="row mx-2">
              <div className="col-5">ใช้ไปทั้งหมด</div>
              <div className="col-7 text-end">
                {zoneInfo?.totalLocker - zoneInfo?.emptyQty} /{" "}
                {zoneInfo?.totalLocker} ช่อง
              </div>
              <div className="col-7">ชาย</div>
              <div className="col-5 text-end">{zoneInfo?.maleQty} คน</div>
              <div className="col-7">หญิง</div>
              <div className="col-5 text-end">{zoneInfo?.femaleQty} คน</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

GaugeInfo.prototype = {
  zoneName: PropTypes.string.isRequired,
};
