import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import Swal from "sweetalert2";
import License from "../components/License";
import { motion } from "framer-motion";
import axios from "axios";

export default function Login() {
  const history = useHistory();
  const [employeeId, setEmployeeId] = useState("");

  const pageTransition = {
    ease: "anticipate",
    type: "tween",
  };

  const handleRoute = (e) => {
    e.preventDefault();
    axios.get(`/api-user/register/${employeeId}`).then(({ data }) => {
      if (data.length === 0) {
        Swal.fire({
          icon: "error",
          title: "ไม่พบรหัสพนักงานนี้",
          text: employeeId,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "รหัสพนักงานถูกต้อง",
          showConfirmButton: false,
          timer: 1500,
        }).then(() =>
          history.push({
            pathname: "/user/employeeInfoPage",
            state: data,
          })
        );
      }
    });
  };

  return (
    <>
      <Container fluid className="min-vh-100 min-vw-100">
        <motion.div
          initial={{ opacity: 0, y: "1%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0, y: "1%" }}
          transition={pageTransition}
        >
          <div className="d-flex flex-column justify-content-center align-items-center pb-4 min-body-height">
            <div align="center">
              <h1 className="text-danger font-bold">
                SNC{" "}
                <span className="text-dark fw-normal fst-normal">Locker</span>
              </h1>
              <h2> Registration System</h2>
            </div>
            <div className="text-center ">
              <Form onSubmit={handleRoute}>
                <InputGroup className="mb-3 mt-4 shadow-sm">
                  <FormControl
                    placeholder="Employee ID"
                    type="text"
                    className="border-end-0"
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  />
                  <InputGroup.Text className=" bg-white">
                    <i className="fas fa-user" />
                  </InputGroup.Text>
                </InputGroup>
                <Button className="w-100 shadow-sm mb-3" type="submit">
                  Sign in
                </Button>
                {/* <Link
                  to="/user/newEmployeePage"
                  className="link-info text-decoration-none"
                >
                  ลงทะเบียนพนักงานใหม่
                </Link> */}
              </Form>
            </div>
          </div>
        </motion.div>
        <License />
      </Container>
    </>
  );
}
