# Foot3DModel_Thesis

## วิธีการเริ่มต้นโปรแกรม

- เริ่มจากการ clone git repository
```
https://github.com/punyanuch463/DST2024-19.git
```

- เข้า folder /Soucre  codes เพื่อ เตรียมโปรเจค สำหรับการทำงาน ```   https://github.com/punyanuch463/DST2024-19/tree/master/Soucre%20codes  ```
- เข้า Mysql เพื่อ Run Foot3DModelData_Final.sql กด Run All 1 ครั้ง เพื่อลง Database ```  https://github.com/punyanuch463/DST2024-19/blob/master/Soucre%20codes/Foot3DModelData_Final.sql ```
- หลังจากนั้นเข้าสู่ code ด้วย vs code และกดเพื่อเข้า terminal สำหรับ set up ตัว node_module 
- ตัว node_modules ได้มีการอัปโหลดไปแล้ว npm install -package-  ไม่ต้องทำการลงเพิ่ม หากไม่สามารถใช้งานได้ ให้ลงตาม

```
npm install react-icons @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons react-datepicker jsonwebtoken nodemailer
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm run dev
```

หรือ

```
npm install
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm run dev
```

## อธิบายฝั่ง Backend

## API Document

https://github.com/punyanuch463/DST2024-19/blob/master/Manual/API%20Document.md

## ส่วนเชื่อมต่อ API External

**1.ส่วนรับรูปถ่ายทั้ง 8 ภาพถ่าย เพื่อนำไปประมวลผลข้อมูลเท้า**

เปลี่ยนใน function handleSaveImage เพื่อใส่ข้อมูล api ของการวิเคราะห์รูปภาพ เพื่อนำข้อมูลเข้าสู่ database 

จาก code เป็นเพียงข้อมูลจำลองขึ้นมาเพื่อใช้ในการทดสอบ
```

  const handleSaveImage = async () => {
    if (capturedImage && userId) {
      const imageCategoryId = 8;
      const side = "right";
      const fileName = "imagefootright4.png";
      const orderId = localStorage.getItem("orderId");
  
      if (orderId) {
        const result = await saveImageToDatabase(capturedImage, userId, imageCategoryId, side, fileName, orderId);
    if (result?.id) {
      
          const type = "อุ้งเท้าปกติ"
          const footData = {
            userId,
            type,
            A: 27.5,
            B: 12.0,
            C: 9.0,
            D: 24.0,
            E: 6.8,
            F: 13.0,
            G: 6.12,
            H: 4.5,
            I: 12.12
          };
  
          try {
            const footResponse = await fetch("/api/footData", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(footData),
            });
  
          } catch (error) {
            
          }
  
        router.push("/UserPage/UserInfo");
      }
    }
  }
  };

```


**2.สำหรับเมื่อกดบันทึกข้อมูลรายละเอียดเท้าทั้งหมด เพื่อวิเคราะห์ข้อมูลเท้าเเละ เพื่อสร้างเเบบจำลองสามมิติ**

เปลี่ยนใน function handleConfirmModal เพื่อใส่ข้อมูลรายละเอียดเท้าเพื่อวิเคราะห์ข้อมูลเท้า api ของการวิเคราะห์ข้อมูลเท้า 
เเละนำข้อมูลวิเคราะห์ เข้าสู่ api ของการสร้างเเบบจำลองสามมิติ เพื่อนำข้อมูลเข้าสู่ database เพื่อเเสดงในภายหลัง

จาก code เป็นเพียงข้อมูลจำลองขึ้นมาเพื่อใช้ในการทดสอบ
```

  const handleConfirmModal = async () => {
    try {
      const response = await fetch(`/api/footData`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...footMeasurements,
          message: "โมเดลเท้า 3 มิติกำลังถูกสร้างขึ้น",
          status: "Unread",
        }),
      });

      if (!response.ok) {
        throw new Error(" เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      
      const foot3dData = [
        { userId, foot3DPath: "/Foot3d/3d001.stl", side: "left" },
        { userId, foot3DPath: "/Foot3d/3d002.stl", side: "right" },
      ];

      for (const foot of foot3dData) {
        const foot3dResponse = await fetch(`/api/foot3d`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(foot),
        });

        if (!foot3dResponse.ok) {
          throw new Error(` Error inserting Foot3D: ${foot.side}`);
        }
      }

```


## รายละเอียดของโครงสร้าง Project

![image](https://github.com/user-attachments/assets/229b23aa-c35f-41c6-94db-29d7b2866bb8)

## 📁 pages

### 📁 AdminPage
- **index.js** - หน้าแรกก่อนเข้าสู่ระบบ (หน้า Register / สมัครสมาชิก)
- **CompletePage.js** - หน้ากรอกรหัสได้รับข้อมูลรหัสในอีเมล เพื่อลงทะเบียนเพิ่มบัญชีใหม่
- **Consent.js** - หน้าข้อตกลงและนโยบาย (PDPA)
- **CreateAcc.js** - หน้าเพิ่มบัญชี Admin ใหม่
- **EditAcc.js** - หน้าแก้ไขข้อมูลบัญชี Admin หลังจากเข้าสู่ระบบแล้ว
- **FootView.js** - หน้าแสดงข้อมูลเท้า (Foot Data) ของผู้ใช้ เพื่อ Download แบบจำลองเท้าสามมิติ
- **HomePage.js** - หน้า Dashboard หลักของ Admin
- **InsoleOrder.js** - หน้าแสดงคำสั่งซื้อของผู้ใช้งาน
- **LoginPage.js** - หน้าเข้าสู่ระบบ Admin
- **Notification.js** - หน้าการแจ้งเตือนเมื่อผุ้ใช้งานมีการดำเนินการกับระบบ
- **SettingAcc.js** - หน้าแก้ไขข้อมูลส่วนตัว Admin ขณะตอนลงทะเบียน
- **UserFoot.js** - หน้าแสดงแบบจำลอง 3 มิติ ของผู้ใช้งาน

![image](https://github.com/user-attachments/assets/9a0e63ed-ffe7-42e9-a5cb-50941e73258e)

### 📁 UserPage
- **index.js** - หน้าแรกก่อนเข้าสู่ระบบ (หน้า Register / สมัครสมาชิก)
- **CompletePage.js** - หน้ากรอกรหัสได้รับข้อมูลรหัสในอีเมล เพื่อลงทะเบียน
- **Consent.js** - หน้าข้อตกลงและนโยบาย (PDPA)
- **ConsentLogin.js** - หน้าข้อตกลงและนโยบาย (PDPA) ใน homepage เพื่อแก้ย้อนหลัง
- **CreateAcc.js** - หน้า Register / สมัครสมาชิก
- **EditAcc.js** - หน้าแก้ไขข้อมูลบัญชีผู้ใช้
- **Guideline.js** - หน้าแนะนำวิธีใช้งานระบบ
- **HomePageUser.js** - หน้า Dashboard หลักของผู้ใช้งาน
- **Insole.js** - หน้าแสดงคำสั่งซื้อของผู้ใช้งาน
- **LoginPage.js** - หน้าเข้าสู่ระบบผู้ใช้งาน
- **Notification.js** - หน้าการแจ้งเตือน
- **SettingAcc.js** - หน้าแก้ไขข้อมูลส่วนตัวผู้ใช้งาน ขณะตอนลงทะเบียน
- **UserFoot.js** - หน้าแสดงแบบจำลอง 3 มิติ ของผู้ใช้งาน
- **UserHistory.js** - หน้าประวัติการใช้งาน / ประวัติการสั่งซื้อ
- **UserInfo.js** - หน้ารายละเอียดข้อมูลเท้าของตัวเอง


![image](https://github.com/user-attachments/assets/4b4a63f4-9243-4664-a662-d9a921ce00e6)

### 📁 takePhotoFoot
- **takephoto.module.css** - แก้ไข css ทั้งหมดของ takePhotoFoot
- **takePhotoFootLeft1.js** - หน้ารูปถ่าย ฝ่าเท้าข้างซ้าย
- **takePhotoFootLeft2.js** - หน้ารูปถ่าย ข้างเท้าด้านในข้างซ้าย
- **takePhotoFootLeft3.js** - หน้ารูปถ่าย มุมหลังเท้าบนกระดาษข้างซ้าย
- **takePhotoFootLeft4.js** - หน้ารูปถ่าย ภาพวาดเท้าบนกระดาษข้างซ้าย
- **takePhotoFootRight1.js** - หน้ารูปถ่าย ฝ่าเท้าข้างขวา
- **takePhotoFootRight2.js** - หน้ารูปถ่าย ข้างเท้าด้านในข้างขวา
- **takePhotoFootRight3.js** - หน้ารูปถ่าย มุมหลังเท้าบนกระดาษข้างขวา
- **takePhotoFootRight4.js** - หน้ารูปถ่าย ภาพวาดเท้าบนกระดาษข้างขวา


![image](https://github.com/user-attachments/assets/2e5aa9cc-8f30-4495-97c4-7d5b80e70d1d)

### 📁 VerifyphotoFoot

- **verifyphoto.module.css** - แก้ไข css ทั้งหมดของ VerifyphotoFoot
- **verPhotoFootLeft1.js** - หน้ายืนยันรูปถ่าย ฝ่าเท้าข้างซ้าย
- **verPhotoFootLeft2.js** - หน้ายืนยันรูปถ่าย ข้างเท้าด้านในข้างซ้าย
- **verPhotoFootLeft3.js** - หน้ายืนยันรูปถ่าย มุมหลังเท้าบนกระดาษข้างซ้าย
- **verPhotoFootLeft4.js** - หน้ายืนยันรูปถ่าย ภาพวาดเท้าบนกระดาษข้างซ้าย
- **verPhotoFootRight1.js** - หน้ายืนยันรูปถ่าย ฝ่าเท้าข้างขวา
- **verPhotoFootRight2.js** - หน้ายืนยันรูปถ่าย ข้างเท้าด้านในข้างขวา
- **verPhotoFootRight3.js** - หน้ายืนยันรูปถ่าย มุมหลังเท้าบนกระดาษข้างขวา
- **verPhotoFootRight4.js** - หน้ายืนยันรูปถ่าย ภาพวาดเท้าบนกระดาษข้างขวา


### 📁 api
จากโครงสร้างโฟลเดอร์ `api` ที่แสดงในภาพ ไฟล์ที่อยู่ภายในโฟลเดอร์ดูเหมือนจะเป็นไฟล์ API สำหรับการจัดการข้อมูลของระบบ ซึ่งอาจเป็นส่วนหนึ่งของ backend ที่พัฒนาโดยใช้ Node.js หรือ framework ที่เกี่ยวข้อง นี่คือคำอธิบายของแต่ละส่วน:

![image](https://github.com/user-attachments/assets/05761b5d-4367-4b98-89a3-5be6c7f4a9a0)

#### 📁 **admin**
โฟลเดอร์นี้เกี่ยวข้องกับการจัดการผู้ดูแลระบบ (Admin) และมี API สำหรับการดำเนินการต่าง ๆ เช่น:
- `addAdmin.js` → เพิ่มบัญชี Admin ระบบใหม่
- `getAdmin.js` → ดึงข้อมูล Admin
- `getSessionAdmin.js` → ตรวจสอบเซสชันของ Admin
- `loginAdmin.js` → ใช้สำหรับเข้าสู่ระบบของ Admin
- `notificationAdmin.js` → จัดการการแจ้งเตือนสำหรับ Admin
- `sendVerificationEmailAdmin.js` → ส่งอีเมลยืนยันตัวตน
- `sessionAdmin.js` → จัดการเซสชันของ Admin
- `updateAdmin.js` → อัปเดตข้อมูล Admin
- `updateConsent.js` → อัปเดตการให้สิทธิ์ของ Admin
- `uploadToFolder.js` → อัปโหลดไฟล์รูปภาพ(Profile)ไปยังโฟลเดอร์ที่กำหนด
- `verifyCode.js` → ตรวจสอบรหัสยืนยัน จากการสร้างบัญชีผู้ใช้งาน

![image](https://github.com/user-attachments/assets/8312e814-7332-4286-afb1-f64c8ef1ce07)

#### 📁 **user**
โฟลเดอร์นี้เกี่ยวข้องกับการจัดการผู้ใช้ทั่วไป (user) และมี API สำหรับการดำเนินการดังนี้:
- `addUser.js` → เพิ่มผู้ใช้ใหม่
- `getUser.js` → ดึงข้อมูลผู้ใช้
- `login.js` → ใช้สำหรับเข้าสู่ระบบของผู้ใช้
- `notificationUser.js` → จัดการการแจ้งเตือนของผู้ใช้
- `saveFootImage.js` → บันทึกภาพเท้าของผู้ใช้
- `sendVerificationEmail.js` → ส่งอีเมลยืนยันตัวตนให้กับผู้ใช้
- `updateConsent.js` → อัปเดตการให้สิทธิ์ของผู้ใช้
- `updateUser.js` → อัปเดตข้อมูลผู้ใช้
- `uploadFootImageToFolder.js` → อัปโหลดภาพเท้าไปยังโฟลเดอร์
- `uploadToFolder.js` → อัปโหลดไฟล์ภาพ(Profile)ไปยังโฟลเดอร์ที่กำหนด
- `verifyCode.js` → ตรวจสอบรหัสยืนยันของผู้ใช้
  

![image](https://github.com/user-attachments/assets/bf44c729-b5f6-4de8-b970-dc21e363583e)

#### 📂 **ไฟล์ API อื่น ๆ**
นอกจากนี้ยังมีไฟล์ API อื่น ๆ ที่จัดการข้อมูลต่าง ๆ เช่น:
- `cameraService.js` และ `cameraZoomService.js` → ฟังก์ชันที่เกี่ยวข้องกับการใช้งานกล้องถ่ายภาพ เริ่มต้นแต่ เปิดกล้อง ถ่ายภาพ และบันทึกข้อภาพ
- `db.js` → การเชื่อมต่อกับฐานข้อมูล
- `foot3d.js` → จัดการข้อมูลโมเดล 3D ของเท้า
- `footData.js` → จัดการข้อมูลเกี่ยวกับรายละเอียดเท้าทั้งหมด
- `getUsersWithFoot3D.js` → ดึงข้อมูลผู้ใช้ที่มีโมเดล 3D ของเท้า
- `imageService.js` → บริการที่เกี่ยวข้องกับการจัดการรูปภาพ บันทึกภาพที่ถ่ายมาไว้ในไฟล์ไหน และ เขียนที่อยู่ path เข้าไป
- `order.js` → จัดการคำสั่ง ในการเพิ่มภาพถ่ายเท้า , ส่งข้อมูลเท้าไปประมวลผล , สั่งซื้อแผ่นรองเท้ส
- `orderDetailed.js` → จัดการคำสั่งซื้อและรายละเอียดคำสั่งซื้อสำหรับแผ่นรองเท้า
- `session.js` → จัดการเซสชันของผู้ใช้


![image](https://github.com/user-attachments/assets/0a9f02c0-3314-4bae-a6ff-277370fad203)

## 📂 utils

- `addressUtils.js` → ตั้งค่าการเเสดงผลของที่อยู่
- `routeTitle.js` → ตั้งค่า Page title ของ web browser
- `sessionUser.js` → ตั้งค่าวิธีการตรวจสอบ userid ของ web browser


![image](https://github.com/user-attachments/assets/0f79a89a-a5ef-4d4a-a297-969cb61344ef)



## 📂 hoc
- `withAuth.js` → จัดการการเข้าถึงของหน้า web browser ตามสิทธิ์ที่ได้รับของ User
- `withAuthAdmin.js` → จัดการการเข้าถึงของหน้า web browser ตามสิทธิ์ที่ได้รับของ Admin


![image](https://github.com/user-attachments/assets/0f593140-3e5a-4269-847e-d6917e1af11a)


## 📂 component
- `Camera.js` → หน้าแสดงการถ่ายรูป ผ่านรูปแบบ Video wrapper Real time เชื่อมกับหน้า takePhotoFoot
- `FooterActions.js` → หน้าแสดงการยืนยันรูปเท้า เชื่อมกับหน้า VerifyphotoFoot
- `ImagePreview.js` → หน้าแสดงภาพถ่ายหลังจากกดถ่ายรูปแล้ว 
- `NotificationPopup.js` → หน้าแสดงการแจ้งเตือนส่วนบนของหน้า web browser
- `OrderCard.js` → หน้าแสดงรายละเอียดข้อมูล order
- `Paginate.js` → หน้าแสดงรายการลำดับของข้อมูล order ทั้งหมด

![image](https://github.com/user-attachments/assets/c4bb8443-0e18-4c8a-98e7-e0cf9f861a2a)


## 📁 public  : ใช้ในการแสดงรูปภาพทั้งหมดใน web browser

![image](https://github.com/user-attachments/assets/2a200901-6260-407a-b9f5-9f8814538ce2)

## 📁 style  : ใช้ในสำหรับแก้ css
  
![image](https://github.com/user-attachments/assets/c7bff526-416f-4a5b-844f-0d4a59d783fe)

## 📁 .env

![image](https://github.com/user-attachments/assets/7c5498d0-5b06-4c45-aa9e-3e253e4817b9)

* วิธีแก้ set .env ใหม่ เราจะทำให้สามารถส่งอีเมลได้จากขั้นตอน ด้านล่าง ดังนี้
```
      https://www.loom.com/share/0d40f48de2874e858c4b40fc9f50d083?sid=8308e627-3c86-4d16-9924-509b25382204
```
* 1.คลิ๊กเข้า link นี้เพื่อ ลงทะเบียนให้สามารถใช่้การยืนยัน 2 ขั้นตอนได้ 
https://support.google.com/accounts/answer/185839?sjid=10816039124386079957-AP&authuser=2 
ทำตามที่บอก เปิดยืนยัน 2 ขั้นตอน พอเปิดแล้วจะใช้งานตัว Add passwords ได้

* 2.คลิ๊กเข้า link นี้เพื่อ เข้าสูระบบ
https://myaccount.google.com/u/2/apppasswords?pli=1&rapt=AEjHL4Mf2I6NlR6_Kb9U-puLDI8xlfgTLo_dwiMAab2cJAn6u-m7bAwpxwgBOrG60xUXV4k8Lv6s598qT3bzkIFh5W4i1n2XYeeYJq2EQTXdyd7RPYleOAw&pageId=none 

จะเป็นตัว Add passwords หลังจากนั้น เพิ่มชื่อเพื่อให้ได้ generate code และนำ code ที่ได้ไปใช้ใน .env และแก้ไขให้เป็น อีเมลของตนเอง

* 3.ไปที่ project เข้าไปที่ .env

```
# Set Email Send Verify
EMAIL_USER= email ที่เราลงทะเบียน 
EMAIL_PASS= รหัสจาก Add passwords
# Set Database Connection
DB_HOST=localhost
DB_USER=root
DB_PASSWORD= รหัสของตัวเอง
DB_NAME=foot3dmodel

```


* วิธีการลงทะเบียนเพื่อใช้งาน email 
- https://support.google.com/accounts/answer/185839?sjid=10816039124386079957-AP&authuser=2 

![image](https://github.com/user-attachments/assets/92da9089-9b82-4bef-b514-525a1e0837c2)

 
- https://myaccount.google.com/u/2/apppasswords?pli=1&rapt=AEjHL4Mf2I6NlR6_Kb9U-puLDI8xlfgTLo_dwiMAab2cJAn6u-m7bAwpxwgBOrG60xUXV4k8Lv6s598qT3bzkIFh5W4i1n2XYeeYJq2EQTXdyd7RPYleOAw&pageId=none 

 
![image](https://github.com/user-attachments/assets/dfa6219c-ae64-4f13-b838-bfafe84d8316)


