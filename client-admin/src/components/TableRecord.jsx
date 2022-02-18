import React from "react";
import { Table } from "react-bootstrap";

import { useSelector } from "react-redux";

export default function TableRecord() {
  const historyInfo = useSelector((state) => state.historyInfo);

  const formatNewDatetime = (oldDatetime) => {
    if (oldDatetime) {
      const [date, time] = oldDatetime.split(" ");
      return date.split("-").reverse().join("/") + " " + time;
    }
    return oldDatetime;
  };

  return (
    <>
      <div style={{ height: "60vh", overflow: "auto" }}>
        <Table bordered hover>
          <thead className="bg-dark text-white">
            <tr align="center">
              <th scope="col">ลำดับที่</th>
              <th scope="col" style={{ width: "20%" }}>
                วันที่
              </th>
              <th scope="col">รหัสตู้</th>
              <th scope="col">รหัสพนักงาน</th>
              <th scope="col" style={{ width: "20%" }}>
                ชื่อ-สกุล
              </th>
              <th scope="col">ตำแหน่ง</th>
              <th scope="col" style={{ width: "15%" }}>
                สถานะการใช้งาน
              </th>
            </tr>
          </thead>
          <tbody>
            {historyInfo.length === 0 ? (
              <tr>
                <th colSpan="7" className="text-center h3">
                  ไม่พบข้อมูล
                </th>
              </tr>
            ) : (
              historyInfo.map((info, i) => (
                <tr align="center" key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{formatNewDatetime(info.datetime)}</td>
                  <td className="text-uppercase">{`${info.zone} ${info.lockerNo} ${info.channelNo}`}</td>
                  <td>{info.code}</td>
                  <td className="text-start ps-5">{info.name}</td>
                  <td className="text-start ps-5">
                    พนักงาน
                    {info.position === "fulltime" ? "ประจำ" : "สัญญาจ้าง"}
                  </td>
                  <td>
                    {info.action === "checkin" ? (
                      <i className="fas fa-check-circle text-success fa-lg" />
                    ) : (
                      <i className="fas fa-times-circle text-danger fa-lg" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}
