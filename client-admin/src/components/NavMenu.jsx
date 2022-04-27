import React, { useRef, useState } from "react";
import {
  Container,
  Nav,
  Form,
  FormControl,
  Navbar,
  Image,
  Modal,
  Button,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "./img/logo.png";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";

import { updateLocker } from "../store/slices/lockerSlice";

export default function NavMenu() {
  const dispatch = useDispatch();
  const history = useHistory();
  const getSearch = useRef();
  const [showModal, setShowModal] = useState(false);
  const [listName, setListName] = useState([]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSearch = (e) => {
    e.preventDefault();

    const search = getSearch.current.value;
    const action = "used";
    if (search) {
      axios
        .post(`http://localhost:8090/api/search`, { search, action })
        .then(({ data }) => {
          if (data.length === 0) {
            Swal.fire({
              icon: "error",
              html: `<h2>ไม่พบข้อมูลพนักงาน</h2>`,
              confirmButtonText: "ตกลง",
            });
          } else {
            // console.log(data);
            setListName(data);
            handleShowModal();
          }
        });
    } else {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกรายละเอียด",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const handleSelectSearch = (info) => {
    const { zone, lockerNo, channelNo } = info;
    axios
      .get(`http://localhost:8090/api/locker-used/${zone}/${lockerNo}`)
      .then(({ data }) => {
        if (data.length > 0) {
          getSearch.current.value = "";
          dispatch(updateLocker(data));
          history.push({
            pathname: "/admin/locker",
            state: {
              zone,
              lockerNo,
              channelNo,
            },
          });
        }
      });
  };

  const handleLogout = () => {
    axios.post("/auth/logout").then(({ data }) => {
      if (data.state) {
        history.push("/admin/");
      }
    });
  };

  return (
    <>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container fluid>
          <Navbar.Brand
            // href="/zoneA"
            style={{ fontSize: ".6rem" }}
            align="center"
          >
            <Link to="/admin/zoneA" className="text-decoration-none">
              <Image src={logo} alt="locker" style={{ width: 60 }} />
              <p className="my-0 text-light">Locker Management System</p>
            </Link>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Link to="/admin/zoneA" className="nav-link">
                Zone A
              </Link>
              <Link to="/admin/zoneB" className="nav-link">
                Zone B
              </Link>
              <Link to="/admin/zoneC" className="nav-link">
                Zone C
              </Link>
              <Link to="/admin/zoneD" className="nav-link">
                Zone D
              </Link>
              <Link to="/admin/report" className="nav-link">
                ข้อมูลปัจจุบัน
              </Link>
              <Link to="/admin/record" className="nav-link">
                ประวัติ
              </Link>
              <Link to="/admin/confirmMove" className="nav-link">
                คำร้องขอ
              </Link>
            </Nav>
            <Form onSubmit={handleSearch} className="d-flex">
              <FormControl
                ref={getSearch}
                type="search"
                placeholder="Search..."
                className="me-3"
                aria-label="Search"
              />
            </Form>
            <div className="text-light" onClick={handleLogout}>
              <i className="fas fa-power-off mx-3 logout-hover" />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal size="lg" show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>รายชื่อพนักงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: "70vh", overflow: "auto" }}>
            <Table striped hover>
              <tbody>
                {listName.map((info, i) => (
                  <tr key={i} align="center">
                    <th scope="row" style={{ width: "20%" }}>
                      {info.code}
                    </th>
                    <td>{`${info.zone} ${info.lockerNo} ${info.channelNo}`}</td>
                    <td className="text-start">{info.name}</td>
                    <td style={{ width: "20%" }}>
                      {info.position === "fulltime"
                        ? "พนักงานประจำ"
                        : "พนักงานสัญญาจ้าง"}
                    </td>
                    <td>{info.gender === "male" ? "ชาย" : "หญิง"}</td>
                    <td style={{ width: "10%" }}>
                      <Button onClick={() => handleSelectSearch(info)}>
                        {/* <i className="fas fa-user-check" /> */}
                        <i className="fas fa-link" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
