import React from "react";
import { OverlayTrigger, Tooltip, Image } from "react-bootstrap";
import squares from "../img/square01.png";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import axios from "axios";
import { updateLocker } from "../../store/slices/lockerSlice";

export default function LockerUsed({ zone, num, qty, height, used }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const zoneUsedInfo = useSelector((state) => state.zoneUsedInfo);
  const fLockerNo = (num) => {
    return num < 10 ? "00" + num : num < 100 ? "0" + num : "" + num;
  };

  const handleRoute = (i) => {
    const lockerNo = fLockerNo(num + i);
    axios.get(`/api/locker-used/${zone}/${lockerNo}`).then(({ data }) => {
      if (data.length > 0) {
        dispatch(updateLocker(data));
        history.push({
          pathname: "/admin/locker",
          state: { zone, lockerNo },
        });
      }
    });
  };

  const notUseLocker = () => {
    Swal.fire({
      showConfirmButton: true,
      icon: "warning",
      title: "ล็อคเกอร์นี้ยังไม่เปิดใช้งาน",
      confirmButtonText: "ตกลง",
      // timer: 1500,
    });
  };

  const compareStatus = (i) => {
    const findStatus = zoneUsedInfo.find(
      (info) => info.zone === zone && info.lockerNo === fLockerNo(num + i)
    );

    if (findStatus?.status) {
      return findStatus.status === "full"
        ? "#dc3545"
        : findStatus.status === "used"
        ? "#ff0"
        : "#02b511";
    } else {
      return "none";
    }
  };

  const lockerInUsed = (zone, num, i, used) => {
    if (zone === "A" || zone === "B") {
      if (num + i <= 67) {
        handleRoute(i);
      } else {
        notUseLocker();
      }
    } else {
      used ? handleRoute(i) : notUseLocker();
    }
  };

  return (
    <>
      {Array(qty)
        .fill(0)
        .map((_, i) => (
          <OverlayTrigger
            key={i}
            overlay={
              <Tooltip id={`tooltip-{top}`}>
                {`${zone} ${fLockerNo(num + i)}`}
              </Tooltip>
            }
          >
            <button
              className="m-0 p-0 border-0 btn btn-outline-secondary"
              style={{
                backgroundColor: compareStatus(i),
              }}
              key={i}
              type="button"
              value={fLockerNo(num + i)}
              onClick={() => lockerInUsed(zone, num, i, used)}
            >
              <Image src={squares} alt="locker" style={{ height }} />
            </button>
          </OverlayTrigger>
        ))}
    </>
  );
}

LockerUsed.prototype = {
  zone: PropTypes.string.isRequired,
  num: PropTypes.number.isRequired,
  qty: PropTypes.number.isRequired,
  height: PropTypes.number,
  used: PropTypes.bool,
};

LockerUsed.defaultProps = {
  height: 35,
  used: true,
};
