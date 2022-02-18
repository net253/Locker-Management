import React, { useRef } from "react";
import { FormControl, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function FormFilterConfirm({ getRequestData }) {
  const getSearch = useRef();

  const handleSearch = (e) => {
    e.preventDefault();

    //  console.log(getSearch.current.value);

    const search = getSearch.current.value;

    if (search) {
      getRequestData(search);
    } else {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกรายละเอียด",
        confirmButtonText: "ตกลง",
      }).then(() => {
        setTimeout(() => getRequestData(), 1000);
      });
    }
  };

  return (
    <>
      <Form onSubmit={handleSearch} className="d-flex w-25 my-2">
        <FormControl
          ref={getSearch}
          type="search"
          placeholder="ค้นหา"
          className="me-3"
          aria-label="Search"
        />
      </Form>
      <hr />
    </>
  );
}
