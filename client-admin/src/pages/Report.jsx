import React, { useEffect } from "react";
import FormFilterReport from "../components/FormFilterReport";
import TableReport from "../components/TableReport";
import { Card, Container, Button } from "react-bootstrap";
import NavMenu from "../components/NavMenu";
import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updatePresentUsed } from "../store/slices/presentUsedSlice.js";

import ReactExport from "react-data-export";

export default function Report() {
  const dispatch = useDispatch();
  const presentInfo = useSelector((state) => state.presentInfo);

  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  const pageTransition = {
    ease: "anticipate",
    type: "tween",
  };

  const getPresentData = (zone = "", lockerNo = "") => {
    axios.post("/api/present", { zone, lockerNo }).then(({ data }) => {
      dispatch(updatePresentUsed(data));
    });
  };

  useEffect(() => {
    const loadPage = setTimeout(() => {
      getPresentData();
    }, 0);

    return () => {
      clearTimeout(loadPage);
    };
  }, []);

  // console.log(presentInfo);

  return (
    <>
      <NavMenu />
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: "1%" }}
        transition={pageTransition}
      >
        <Container fluid className="py-2 px-1 b-height">
          <Card body className="shadow-sm">
            <h2 className="text-center mb-2">ข้อมูลผู้ใช้ปัจจุบัน</h2>
            <FormFilterReport />
            <TableReport />
            <div className="d-flex justify-content-end">
              <ExcelFile
                element={
                  <Button variant="success" className="mt-3">
                    <i className="fas fa-file-export me-2" />
                    Export
                  </Button>
                }
                filename="ข้อมูลปัจจุบัน"
              >
                <ExcelSheet data={presentInfo} name="Employee">
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
                  <ExcelColumn label="วันเริ่มงาน" value="firstDate" />
                  <ExcelColumn label="เบอร์โทรศัพท์" value="tel" />
                </ExcelSheet>
              </ExcelFile>
            </div>
          </Card>
        </Container>
      </motion.div>
    </>
  );
}
