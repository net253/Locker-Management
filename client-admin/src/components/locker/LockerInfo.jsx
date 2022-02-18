import React from "react";
import { useHistory } from "react-router-dom";
import { Col, Button } from "react-bootstrap";
import PropTypes from "prop-types";

export default function LockerInfo({ zone, lockerNo, lockerInfo }) {
  const Locker = useHistory();
  const handleRoute = () => {
    Locker.push("/admin/record");
  };

  const maleQty =
    lockerInfo?.filter(({ gender }) => gender === "male")?.length || 0;
  const femaleQty =
    lockerInfo?.filter(({ gender }) => gender === "female")?.length || 0;

  return (
    <>
      <Col
        xs={5}
        className=" d-flex justify-content-center h-75 border-end border-dark border-1"
      >
        <div className="row">
          <h4 className="text-center">{`${zone} ${lockerNo}`}</h4>
          <div className="row h-50 ms-4">
            <div className="col-7">ใช้ไปทั้งหมด</div>
            <div className="col-5 text-end pe-5">
              {maleQty + femaleQty} / 15
            </div>
            <div className="col-7">ชาย</div>
            <div className="col-5 text-end pe-5">{maleQty} คน</div>
            <div className="col-7">หญิง</div>
            <div className="col-5 text-end pe-5">{femaleQty} คน</div>
          </div>
          <Button
            variant="secondary"
            className="py-1 ms-5"
            style={{ width: "38%", height: "fit-content" }}
            onClick={handleRoute}
          >
            <i className="far fa-clipboard" /> ประวัติ
          </Button>
        </div>
      </Col>
    </>
  );
}

LockerInfo.prototype = {
  zone: PropTypes.string.isRequired,
  lockerNo: PropTypes.string.isRequired,
  lockerInfo: PropTypes.arrayOf(PropTypes.object),
};
