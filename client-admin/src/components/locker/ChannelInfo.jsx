import React from "react";
import { Col } from "react-bootstrap";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function ChannelInfo({ chInfo }) {
  const pageTransition = {
    ease: "anticipate",
    type: "tween",
  };
  return (
    <>
      <Col xs={7} className="d-flex justify-content-center align-items-center">
        <motion.div
          initial={{ opacity: 0, x: "-18%" }}
          animate={{ opacity: 1, x: "0%" }}
          exit={{ opacity: 0, x: "-10%" }}
          transition={pageTransition}
        >
          {chInfo.status === "full" ? (
            <div className="row ms-5">
              <h4 className="mb-4">{`${chInfo?.zone} ${chInfo?.lockerNo} ${chInfo?.channelNo}`}</h4>
              <div className="col-6 mb-2">รหัสพนักงาน :</div>
              <div className="col-6 mb-2">{chInfo?.code}</div>
              <div className="col-6 mb-2">ชื่อ-นามสกุล :</div>
              <div className="col-6 mb-2">{chInfo?.name}</div>
              <div className="col-6 mb-2">เพศ :</div>
              <div className="col-6 mb-2">
                {chInfo?.gender === "male"
                  ? "ชาย"
                  : chInfo?.gender === "female"
                  ? "หญิง"
                  : ""}
              </div>
              <div className="col-6 mb-2">โทรศัพท์ :</div>
              <div className="col-6 mb-2">{chInfo?.tel}</div>
              <div className="col-6 mb-2">ตำแหน่ง :</div>
              <div className="col-6 mb-2">
                {chInfo?.position === "fulltime"
                  ? "พนักงานประจำ"
                  : chInfo?.position === "contract"
                  ? "พนักงานสัญญาจ้าง"
                  : ""}
              </div>
              {/* <div className="col-6 mb-2">วันเริ่มงาน :</div>
              <div className="col-6 mb-2">
                {chInfo?.firstDate?.split("-")?.reverse()?.join("/")}
              </div> */}
            </div>
          ) : (
            <div className="text-center">
              <h2>ไม่มีข้อมูล</h2>
            </div>
          )}
        </motion.div>
      </Col>
    </>
  );
}

ChannelInfo.propTypes = {
  chInfo: PropTypes.object.isRequired,
};
