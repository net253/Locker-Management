import React from "react";

// import Swal from "sweetalert2";
// import { useHistory } from "react-router";
// import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Logout() {
  // const history = useHistory();

  // const handleLogout = () => {
  //   Swal.fire({
  //     icon: "warning",
  //     title: "ออกจากระบบ",
  //     showCancelButton: true,
  //     confirmButtonText: "ตกลง",
  //     cancelButtonText: "ยกเลิก",
  //     confirmButtonColor: "#00c91e",
  //     cancelButtonColor: "#c90202",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       history.push("/");
  //     }
  //   });
  // };

  return (
    <>
      <Link
        to={"/user/"}
        className="d-flex justify-content-end text-dark text-decoration-none m-2"
      >
        <i className="fas fa-sign-out-alt fa-2x" />
      </Link>
    </>
  );
}
