export const updatePageTitle = (url) => {
  const pageTitles = {
    // User Page
    "/UserPage/CreateAcc": "สร้างบัญชีของคุณ",
    "/UserPage/LoginPage": "เข้าสู่ระบบ",
    "/UserPage/SettingAcc": "ตั้งค่าบัญชีผู้ใช้",
    "/": "สร้างบัญชีของคุณ",
    "/UserPage": "สร้างบัญชีของคุณ",
    "/UserPage/EditAcc": "แก้ไขการตั้งค่าบัญชี",
    "/UserPage/HomePageUser": "หน้าหลัก",
    "/UserPage/CompletePage": "หน้ายืนยันตัวตน",
    "/UserPage/Consent": "ยินยอมความเป็นส่วนตัว",
    "/UserPage/UserFoot": "แสดงแบบจำลอง3มิติ",
    "/UserPage/UserHistory": "ประวัติย้อนหลัง",
    "/UserPage/UserInfo": "แสดงรายละเอียดข้อมูลเท้า",
    "/UserPage/Notification": "หน้าแจ้งเตือน",
    "/UserPage/Insole" : "หน้าสั่งแผ่นรองในรองเท้า",
    "/UserPage/UserHistory" : "หน้าประวัติ",
    "/UserPage/Guideline" : "หน้าคู่มือ",
    //    User VerifyPhoto 
    "/VerifyphotoFoot/verPhotoFootLeft1": "ยืนยันภาพฝ่าเท้าข้างซ้าย",
    "/VerifyphotoFoot/verPhotoFootLeft2": "ยืนยันภาพข้างเท้าด้านในข้างซ้าย",
    "/VerifyphotoFoot/verPhotoFootLeft3":
      "ยืนยันภาพมุมหลังเท้าบนกระดาษข้างซ้าย",
    "/VerifyphotoFoot/verPhotoFootLeft4": "ยืนยันภาพวาดเท้าบนกระดาษข้างซ้าย",
    "/VerifyphotoFoot/verPhotoFootRight1": "ยืนยันภาพฝ่าเท้าข้างซ้าย",
    "/VerifyphotoFoot/verPhotoFootRight2": "ยืนยันภาพข้างเท้าด้านในข้างซ้าย",
    "/VerifyphotoFoot/verPhotoFootRight3":
      "ยืนยันภาพมุมหลังเท้าบนกระดาษข้างซ้าย",
    "/VerifyphotoFoot/verPhotoFootRight4": "ยืนยันภาพวาดเท้าบนกระดาษข้างซ้าย",
    //    User TakePhoto
    "/takePhotoFoot/takePhotoFootLeft1": "ถ่ายภาพฝ่าเท้าข้างขวา",
    "/takePhotoFoot/takePhotoFootLeft2": "ถ่ายภาพข้างเท้าด้านในข้างขวา",
    "/takePhotoFoot/takePhotoFootLeft3": "ถ่ายภาพมุมหลังเท้าบนกระดาษข้างขวา",
    "/takePhotoFoot/takePhotoFootLeft4": "ถ่ายภาพวาดเท้าบนกระดาษข้างขวา",
    "/takePhotoFoot/takePhotoFootRight1": "ถ่ายภาพฝ่าเท้าข้างขวา",
    "/takePhotoFoot/takePhotoFootRight2": "ถ่ายภาพข้างเท้าด้านในข้างขวา",
    "/takePhotoFoot/takePhotoFootRight3": "ถ่ายภาพมุมหลังเท้าบนกระดาษข้างขวา",
    "/takePhotoFoot/takePhotoFootRight4": "ถ่ายภาพวาดเท้าบนกระดาษข้างขวา",
    // Admin Page
    "/AdminPage/CreateAcc": "สร้างบัญชีของผู้ดูแลระบบ",
    "/AdminPage/LoginPage": "เข้าสู่ระบบผู้ดูแลระบบ",
    "/AdminPage/SettingAcc": "ตั้งค่าบัญชีผู้ดูแลระบบ",
    "/AdminPage": "สร้างบัญชีของผู้ดูแลระบบ",
    "/AdminPage/EditAcc": "แก้ไขการตั้งค่าบัญชีผู้ดูแลระบบ",
    "/AdminPage/HomePage": "หน้าหลักผู้ดูแลระบบ",
    "/AdminPage/CompletePage": "ยืนยันตัวตนผู้ดูแลระบบ",
    "/AdminPage/Consent": "ยินยอมความเป็นส่วนตัวผู้ดูแลระบบ",
    "/AdminPage/FootView": "แสดงรายการจำลอง3มิติ",
    "/AdminPage/InsoleOrder": "แสดงประวัติย้อนหลัง",
    "/AdminPage/Notification": "แสดงการแจ้งเตือน",
    "/AdminPage/UserFoot": "ดาวน์โหลดแบบจำลอง3มิติ"
  };

  document.title = pageTitles[url] || "My Web App";
};
