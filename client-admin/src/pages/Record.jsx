import React, { useEffect } from "react";
import { Card, Container, Form, Button } from "react-bootstrap";
import FormFilterRecord from "../components/FormFilterRecord";
import NavMenu from "../components/NavMenu";
import { motion } from "framer-motion";
import TableRecord from "../components/TableRecord";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { updateHistory } from "../store/slices/historySlice";
import ReactExport from "react-data-export";

export default function Record() {
  const dispatch = useDispatch();
  const historyInfo = useSelector((state) => state.historyInfo);

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  const pageTransition = {
    ease: "anticipate",
    type: "tween",
  };

  const getHistoryData = () => {
    axios
      .post("http://localhost:8090/api/history", { zone: "" })
      .then(({ data }) => dispatch(updateHistory(data)));
  };

  useEffect(() => {
    const loadPage = setTimeout(() => {
      getHistoryData();
    }, 0);

    return () => {
      clearTimeout(loadPage);
    };
  }, []);

  // console.log(historyInfo);

  return (
    <>
      <NavMenu />
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: "1%" }}
        transition={pageTransition}
      >
        <Container fluid className="px-1 py-2 b-height">
          <Card body className="shadow-sm">
            <h2 className="text-center mb-4">ประวัติการใช้งาน</h2>
            <FormFilterRecord />
            <Form>
              <hr />
              <TableRecord />
            </Form>
            {/* <div className="d-flex justify-content-end">
              <ExcelFile
                element={
                  <Button variant="success" className="mt-3">
                    <i className="fas fa-file-export me-2" />
                    Export
                  </Button>
                }
                filename="ประวัติการใช้งาน"
              >
                <ExcelSheet data={historyInfo} name="Employee">
                  <ExcelColumn label="โซน" value="zone" />
                  <ExcelColumn label="ตู้ที่" value="lockerNo" />
                  <ExcelColumn label="ช่องที่" value="channelNo" />
                  <ExcelColumn label="รหัสพนักงาน" value="code" />
                  <ExcelColumn label="ชื่อ-สกุล" value="name" />
                  <ExcelColumn
                    label="เพศ"
                    value={(gen) => (gen.gender === "male" ? "ชาย" : "หญิง")}
                  />
                  <ExcelColumn
                    label="ตำแหน่ง"
                    value={(pos) =>
                      pos.position === "fulltime"
                        ? "พนักงานประจำ"
                        : "พนักงานสัญญาจ้างและอื่นๆ"
                    }
                  />
                  <ExcelColumn
                    label="วันเริ่มใช้งานล็อคเกอร์"
                    value="datetime"
                  />
                  <ExcelColumn label="เบอร์โทรศัพท์" value="tel" />
                  <ExcelColumn
                    label="สถานะ"
                    value={(status) =>
                      status.action === "checkin" ? "Check-in" : "Check-out"
                    }
                  />
                </ExcelSheet>
              </ExcelFile>
            </div> */}
          </Card>
        </Container>
      </motion.div>
    </>
  );
}
