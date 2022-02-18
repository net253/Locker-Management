import Swal from "sweetalert2";

export default function CheckIn() {
  Swal.fire({
    title: "A XXX XX",
    input: "text",
    inputPlaceholder: "รหัสพนักงาน",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    cancelButtonColor: "red",
    customClass: {
      actions: "my-actions",
      confirmButton: "order-1",
      denyButton: "order-2",
      cancelButton: "order-3",
    },
    footer: `<a href='./NewInput' class="nav-link link-dark">พนักงานใหม่</a>`,
    inputValidator: (value) => {
      if (!value) {
        return "กรุณาระบุรหัสพนักงาน.";
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        cancelButtonColor: "red",
        confirmButtonText: "บันทึก",
        icon: `info`,
        html: ` <div class="modal-dialog modal-dialog-scrollable">
          <h4 className="mb-2">A XXX XX</h4>
          <div>รหัสพนักงาน: XXXXXXX</div>
          <div>ชื่อ-สกุล: XXXXX XXXXXXX</div>
          <div>เพศ: XXXX</div>
          <div>โทรศัพท์: XXX-XXXXXXX</div>
          <div>ตำแหน่ง: XXXXXXXX</div>
          <div>วันเริ่มงาน: XX/XX/XXXX</div>
        </>`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            showConfirmButton: false,
            icon: "success",
            title: "บันทึกสำเร็จ",
            timer: 1500,
          });
        }
      });
    }
  });
}
