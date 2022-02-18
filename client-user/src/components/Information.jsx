import React from "react";
import PropTypes from "prop-types";

export default function Information({ employeeInfo }) {
  const formatInfo = () => {
    let {
      zone,
      lockerNo,
      channelNo,
      code,
      name,
      gender,
      tel,
      position,
      firstDate,
      action,
    } = employeeInfo;

    const lockerCode =
      zone.length === 0 || action === "new"
        ? "กรุณาเลือกล็อคเกอร์"
        : `${zone} ${lockerNo} ${channelNo}`;

    gender = gender === "male" ? "ชาย" : "หญิง";

    position = position === "fulltime" ? "พนักงานประจำ" : "พนักงานสัญญาจ้าง";

    firstDate = firstDate?.slice(0, 10)?.split("-")?.reverse()?.join("/");

    return { lockerCode, code, name, gender, tel, position, firstDate };
  };

  return (
    <>
      <h4>ข้อมูลพนักงาน</h4>
      <h3 className="my-5">{formatInfo().lockerCode}</h3>
      <div className="row text-start">
        <div className="col-6 mb-2 text-end">รหัสพนักงาน :</div>
        <div className="col-6 mb-2">{formatInfo().code}</div>
        <div className="col-6 mb-2 text-end">ชื่อ-นามสกุล :</div>
        <div className="col-6 mb-2">{formatInfo().name}</div>
        <div className="col-6 mb-2 text-end">เพศ :</div>
        <div className="col-6 mb-2">{formatInfo().gender}</div>
        <div className="col-6 mb-2 text-end">โทรศัพท์ :</div>
        <div className="col-6 mb-2">{formatInfo().tel}</div>
        <div className="col-6 mb-2 text-end">ตำแหน่ง :</div>
        <div className="col-6 mb-2">{formatInfo().position}</div>
        <div className="col-6 mb-2 text-end">วันเริ่มงาน :</div>
        <div className="col-6 mb-2">{formatInfo().firstDate}</div>
      </div>
    </>
  );
}

Information.propTypes = {
  employeeInfo: PropTypes.object.isRequired,
};
