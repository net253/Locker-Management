import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import Swal from "sweetalert2";
import axios from "axios";

import { updateAuth } from "../store/slices/authSlice";

export default function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const initialFormSignIn = { username: "", password: "" };
  const [formSignIn, setFormSignIn] = useState(initialFormSignIn);

  const handleSignIn = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8090/auth/checklogin", { ...formSignIn })
      .then(({ data }) => {
        if (data.state) {
          const { name, isLoggedIn } = data;
          dispatch(updateAuth({ name, isLoggedIn }));
          Swal.fire({
            icon: "success",
            title: "Login Success.",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            history.push("/admin/zoneA");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Fail.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  return (
    <>
      <Container className="min-vh-100 d-flex flex-column justify-content-center align-items-center min-vw-100">
        <div>
          <div className="text-center h2">
            <b className="text-danger">SNC</b>{" "}
            <span className=" fw-lighter">Locker Management</span>
          </div>

          <div className="card card-body py-4 px-5 mt-4 shadow text-center">
            <p>Sign in to start your session</p>
            <Form onSubmit={handleSignIn}>
              <InputGroup className="mb-3 mt-2">
                <FormControl
                  placeholder="Username"
                  type="text"
                  className="border-end-0"
                  required
                  defaultValue={formSignIn.username}
                  onChange={({ target: { value: username } }) =>
                    setFormSignIn({ ...formSignIn, username })
                  }
                />
                <InputGroup.Text id="basic-addon2" className="bg-white">
                  <i className="fas fa-user" />
                </InputGroup.Text>
              </InputGroup>
              <InputGroup className="mb-4">
                <FormControl
                  placeholder="Password"
                  type="password"
                  className="border-end-0"
                  required
                  defaultValue={formSignIn.password}
                  onChange={({ target: { value: password } }) =>
                    setFormSignIn({ ...formSignIn, password })
                  }
                />
                <InputGroup.Text id="basic-addon2" className="bg-white">
                  <i className="fas fa-lock" />
                </InputGroup.Text>
              </InputGroup>
              <Button className="w-100" type="submit">
                Sign in
              </Button>
            </Form>
          </div>
        </div>
      </Container>
    </>
  );
}
