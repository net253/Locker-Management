import React, { useState } from "react";
import { Form, Button, Table, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { updatePresentUsed } from "../store/slices/presentUsedSlice.js";

export default function TableReport() {
  const dispatch = useDispatch();
  const presentInfo = useSelector((state) => state.presentInfo);
  const [show, setShow] = useState(false);

  const [empInfo, setEmpInfo] = useState({});
  const [oldCode, setOldCode] = useState("");

  const handleShow = (info) => {
    setEmpInfo(info);
    setOldCode(info.code);
    setShow(true);
  };
  const handleClose = () => setShow(false);

  const handleDetete = (info) => {
    Swal.fire({
      title: "ยืนยันการ Check out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#198754",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(info);
        axios
          .post("http://localhost:8090/api/check-out", { ...info })
          .then(({ data }) => {
            Swal.fire({
              title: data.state ? "ดำเนินการเสร็จสิ้น" : "ดำเนินการล้มเหลว",
              icon: data.state ? "success" : "error",
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              getPresentData();
            });
          });
      }
    });
  };

  const getPresentData = (zone = "", lockerNo = "") => {
    axios
      .post("http://localhost:8090/api/present", { zone, lockerNo })
      .then(({ data }) => {
        dispatch(updatePresentUsed(data));
      });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const newCode = empInfo.code;
    console.log({ oldCode, newCode, ...empInfo });

    Swal.fire({
      title: "ยืนยันการแก้ไขข้อมูล",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("http://localhost:8090/api/edit", {
            newCode,
            oldCode,
            ...empInfo,
          })
          .then(({ data }) => {
            Swal.fire({
              title: data.state ? "ดำเนินการเสร็จสิ้น" : "ดำเนินการล้มเหลว",
              icon: data.state ? "success" : "error",
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              getPresentData();
              setShow(false);
            });
          });
      }
    });
  };

  return (
    <>
      <hr />
      <div style={{ height: "60vh", overflow: "auto" }}>
        <Table striped hover bordered>
          <thead className="bg-dark text-white">
            <tr align="center">
              <th scope="col">ลำดับที่</th>
              <th scope="col">รหัสตู้</th>
              <th scope="col">รหัสพนักงาน</th>
              <th scope="col" style={{ width: "20%" }}>
                ชื่อ-สกุล
              </th>
              {/* <th scope="col" style={{ width: "20%" }}>
                วันเริ่มงาน
              </th> */}
              <th scope="col">ตำแหน่ง</th>
              <th scope="col" style={{ width: "15%" }}>
                การจัดการ
              </th>
            </tr>
          </thead>
          <tbody>
            {presentInfo.length === 0 ? (
              <tr>
                <th colSpan="7" className="text-center h3">
                  ไม่พบข้อมูล
                </th>
              </tr>
            ) : (
              presentInfo.map((info, i) => (
                <tr align="center" key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{`${info.zone.toUpperCase()} ${info.lockerNo} ${
                    info.channelNo
                  }`}</td>
                  <td>{info.code}</td>
                  <td className="text-start ps-5">{info.name}</td>
                  {/* <td>{info?.firstDate?.split("-")?.reverse()?.join("/")}</td> */}
                  <td className="text-start ps-5">
                    พนักงาน
                    {info.position === "fulltime"
                      ? "ประจำ"
                      : "สัญญาจ้างและอื่นๆ"}
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      className="mx-2 py-0"
                      onClick={() => handleShow(info)}
                    >
                      <i className="fas fa-user-edit" />
                    </Button>

                    <Button
                      variant="danger"
                      className="mx-2 py-0"
                      onClick={() => handleDetete(info)}
                    >
                      <i className="fas fa-user-times" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <Modal size="md" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลพนักงาน</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEdit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formCode">
              <Form.Label>รหัสพนักงาน</Form.Label>
              <Form.Control
                type="text"
                defaultValue={empInfo.code}
                onChange={({ target: { value } }) =>
                  setEmpInfo({ ...empInfo, code: value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>ชื่อพนักงาน</Form.Label>
              <Form.Control
                type="text"
                defaultValue={empInfo.name}
                onChange={({ target: { value } }) =>
                  setEmpInfo({ ...empInfo, name: value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formFirstDate">
              <Form.Label>วันเริ่มงาน</Form.Label>
              <Form.Control
                type="date"
                defaultValue={empInfo.firstDate}
                onChange={({ target: { value } }) =>
                  setEmpInfo({ ...empInfo, firstDate: value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPosition">
              <Form.Label>ตำแหน่ง</Form.Label>
              <Form.Select
                defaultValue={empInfo.position}
                onChange={({ target: { value } }) =>
                  setEmpInfo({ ...empInfo, position: value })
                }
                required
              >
                <option value="">กรุณาระบุตำแหน่ง</option>
                <option value="fulltime">พนักงานประจำ</option>
                <option value="contract">พนักงานสัญญาจ้าง</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGender">
              <Form.Label>เพศ</Form.Label>
              <Form.Select
                defaultValue={empInfo.gender}
                onChange={({ target: { value } }) =>
                  setEmpInfo({ ...empInfo, gender: value })
                }
                required
              >
                <option value="">กรุณาระบุเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTel">
              <Form.Label>เบอร์โทรศัพท์</Form.Label>
              <Form.Control
                type="text"
                defaultValue={empInfo.tel}
                onChange={({ target: { value } }) =>
                  setEmpInfo({ ...empInfo, tel: value })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={handleClose}>
              ปิด
            </Button>
            <Button type="submit">ยืนยัน</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
