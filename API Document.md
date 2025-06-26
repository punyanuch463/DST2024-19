**API Document**
1. สร้างบัญชีผู้ดูแลระบบใหม่
ลงทะเบียนแอดมินใหม่และส่งรหัสยืนยันอีเมล

``` POST /api/admin/addadmin ```

API นี้ใช้สำหรับสร้างบัญชีผู้ดูแลระบบใหม่ โดยรับข้อมูลจากแบบฟอร์ม และทำการตรวจสอบความถูกต้องของข้อมูลก่อนบันทึกลงฐานข้อมูล พร้อมส่งรหัสยืนยันอีเมลไปยังผู้ใช้

**Headers**
```
•	Content-Type: application/json
```

**Request Body**
```
{
  "AdminName": "admin01",
  "AdminPassword": "StrongPass123!",
  "AdminEmail": "admin@example.com",
  "PhoneNumber": "0912345678"
}
```
**Success Response**

Code: 201 Created

```
{
  "message": "Admin registered successfully. Verification email sent.",
  "AdminId": 101
}
```


**HTTP Response Status Table**

| กรณี                     | HTTP Status | ตัวอย่างข้อความ                                                                 |
|----------------------------|-------------|---------------------------------------------------------------------------------|
| ข้อมูลไม่ครบ              | 400         | `{ "message": "Missing required fields" }`                                      |
| อีเมลไม่ถูกต้อง           | 400         | `{ "message": "Invalid email format" }`                                         |
| รหัสผ่านไม่ปลอดภัย        | 400         | `{ "message": "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร..." }`                 |
| เบอร์โทรไม่ถูกต้อง        | 400         | `{ "message": "หมายเลขโทรศัพท์ต้องมี 10 หลัก..." }`                              |
| อีเมลซ้ำในระบบ            | 400         | `{ "message": "คุณมีอีเมลอยู่ในระบบ กรุณาใช้อีเมลใหม่..." }`                     |
| เซิร์ฟเวอร์มีปัญหา         | 500         | `{ "message": "Internal server error", "error": "..." }`                        |
| Method ไม่รองรับ          | 405         | `Method GET Not Allowed`                                                       |



**2. สร้างบัญชีผู้ใช้ใหม่**
ลงทะเบียนผู้ใช้ใหม่และส่งรหัสยืนยันอีเมล
```POST /api/user/addUser```
API สำหรับลงทะเบียนผู้ใช้งานใหม่ โดยทำการตรวจสอบข้อมูลความถูกต้อง เช่น รูปแบบอีเมล ความแข็งแรงของรหัสผ่าน และความซ้ำซ้อนของอีเมล หลังจากลงทะเบียนสำเร็จ ระบบจะส่งรหัสยืนยันไปยังอีเมลของผู้ใช้งาน

**Headers**
```
•	Content-Type: application/json
```

**Request Body**
```
{
  "UserName": "testuser",
  "UserPassWord": "Abc123$@",
  "UserEmail": "testuser@example.com",
  "PhoneNumber": "0812345678"
}
```

**Success Response**
Code: 201 Created
```
{
  "message": "User registered successfully. Verification email sent.",
  "UserId": 101
}
```

**HTTP Response Status Table**

| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
| ข้อมูลไม่ครบ             | 400         | `{ "message": "Missing required fields" }` |
| อีเมลไม่ถูกต้อง          | 400         | `{ "message": "Invalid email format" }` |
| รหัสผ่านไม่ปลอดภัย        | 400         | `{ "message": "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร..." }` |
| เบอร์โทรไม่ถูกต้อง        | 400         | `{ "message": "หมายเลขโทรศัพท์ต้องมี 10 หลัก..." }` |
| อีเมลซ้ำในระบบ            | 400         | `{ "message": "คุณมีอีเมลอยู่ในระบบ กรุณาใช้อีเมลใหม่..." }` |
| เซิร์ฟเวอร์มีปัญหา        | 500         | `{ "message": "Internal server error", "error": "..." }` |
| Method ไม่รองรับ          | 405         | `Method GET Not Allowed` |




**3. ตรวจสอบสถานะแอดมินการเข้าสู่ระบบจาก Session Cookie**

```GET  /api/admin/getSessionadmin```

API นี้ใช้เพื่อตรวจสอบว่าผู้ดูแลระบบ (Admin) ได้เข้าสู่ระบบอยู่หรือไม่ โดยตรวจสอบจากค่า session-admin ใน cookie ที่แนบมากับ request

**Headers**
```
•	Content-Type: application/json
```

**Request Body**
```
{
  "isAuthenticated": true,
  "AdminID": "1"
}
```

**HTTP Response Status Table**

| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
| ไม่มี cookie แนบมา	| 401	| { "message": "No session found" }
| ไม่มี session หรือ userId ใน cookie	| 401	| { "message": "No userId in session" }
| เกิดข้อผิดพลาดขณะประมวลผล |	500	| { "message": "Internal server error" }
| ใช้ Method ที่ไม่ใช่ GET	| 405	| { "message": "Method not allowed" }

**4. ตรวจสอบสถานะผู้ใช้งานการเข้าสู่ระบบจาก Session Cookie**
```GET  /api/getSession```

ใช้สำหรับตรวจสอบว่า Client มีการเข้าสู่ระบบหรือไม่ โดยดูจากค่า session ที่เก็บไว้ใน cookie ของคำขอ (Request)

**Headers**
```
•	Content-Type: application/json
```

**Request Body**
```
{
  "isAuthenticated": true,
  "userId": "123"
}
```



**HTTP Response Status Table**

| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
| ไม่มี cookie แนบมา	| 401	| { "message": "No session found" }
| ไม่มี session หรือ userId ใน cookie	| 401	| { "message": "No userId in session" }
| เกิดข้อผิดพลาดขณะประมวลผล	| 500	| { "message": "Internal server error" }
| ใช้ Method ที่ไม่ใช่ GET	| 405	| { "message": "Method not allowed" }

**5.อัปโหลดรูปภาพ**
```POST /api/{role}/uploadToFolder```

Request Type: multipart/form-data

**Request Body:**
```
{
  "file": abc123.jpg,
  "{role}Id": "123"
}
```


**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
| Method ไม่รองรับ	| 405	| { "message": "Method not allowed" }
| ไม่มี UserId	| 400	| { "message": "User ID is required" }
| ไม่มีไฟล์ หรือชื่อไฟล์ผิด	| 400	| { "message": "File upload failed or filename is missing" }
| อ่านหรือบันทึกไฟล์ผิดพลาด	| 500	| { "message": "Error saving file" }
| ฟอร์มผิดพลาด	| 500	| { "message": "Error parsing form" }

**6. เพิ่มข้อมูลส่วนตัวของแอดมิน**

```POST /api/admin/update```

**Request Headers:**

•	Cookie: คุกกี้ที่ประกอบด้วย session-admin ซึ่งเก็บ AdminID สำหรับการตรวจสอบ session
```
{
  "fullName": "John Doe",      // ชื่อเต็มของผู้ดูแล
  "gender": "Male",            // เพศของผู้ดูแล (เลือกได้: Male, Female)
  "birthDate": "1985-07-15",   // วันเดือนปีเกิดของผู้ดูแล (รูปแบบ: YYYY-MM-DD)
  "height": 175,               // ความสูงของผู้ดูแล (เป็นตัวเลข)
  "PathProfileImage": "image.jpg", // รูปภาพโปรไฟล์ของผู้ดูแล (ชื่อไฟล์หรือ URL รูปภาพ)
  "address": "123 Street",     // ที่อยู่ของผู้ดูแล
  "houseNumber": "45",         // หมายเลขบ้าน
  "street": "Sukhumvit Road",  // ถนน
  "city": "Bangkok",           // เมือง
  "district": "Sathon",        // เขต
  "province": "Bangkok",       // จังหวัด
  "zip_code": "10120"          // รหัสไปรษณีย์
}
```

**Response:**

•	HTTP Status: 200 OK (ถ้าข้อมูลถูกอัปเดตสำเร็จ)
**•	Response Body:**
```
{
  "message": "ข้อมูลของผู้ดูแลระบบถูกอัปเดตสำเร็จ"
}
```


**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
|  ไม่พบคุกกี้ session	|  401	|  { "message": "ไม่พบ session cookie" }
ไม่มี AdminID ใน session	|  400	|  { "message": "ไม่พบ AdminID ใน session" }
ไม่สามารถอัปเดตข้อมูล	|  500	|  { "message": "ไม่สามารถอัปเดตข้อมูลผู้ดูแลระบบ" }
Method ไม่รองรับ	|  405	|  { "message": "405 Method Not Allowed" }

**7. เพิ่มข้อมูลส่วนตัวของผู้ใช้งาน**
```POST /api/updateUser```
**Request Header:**
•	cookie: คุกกี้ที่มี session เพื่อยืนยันตัวตนของผู้ใช้
**Request Body (JSON):**
```
{
  "fullName": "John Doe",
  "gender": "Male",
  "birthday": "1990-01-01",
  "heightCM": 180,
  "shoeSizeEU": 42,
  "shoeSizeCM": 26.5,
  "PathProfileImage": "profile_image_url.jpg",
  "address": "123 Main St",
  "houseNumber": "10",
  "street": "Main Street",
  "district": "District 1",
  "city": "City Name",
  "province": "Province Name",
  "zip_code": "12345"
}
```
**Response: 200 OK: ข้อมูลผู้ใช้ถูกอัปเดตสำเร็จ**
```
{
  "message": "อัปเดตข้อมูลผู้ใช้สำเร็จ"
}
```


**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
|  ไม่มี session cookie	|  401	|  { "message": "ไม่พบ session cookie" }
|  session ไม่ถูกต้อง	|  400	|  { "message": "Session ไม่ถูกต้อง" }
|  UserId ไม่ถูกต้อง	|  400	|  { "message": "UserId ไม่ถูกต้อง" }
|  รูปแบบวันเกิดไม่ถูกต้อง	|  400	|  { "message": "รูปแบบวันเกิดไม่ถูกต้อง" }
|  ข้อผิดพลาดในการอัปเดตข้อมูล	|  500	|  { "message": "เกิดข้อผิดพลาดขณะอัปเดตข้อมูลผู้ใช้" }
|  Method ไม่รองรับ	|  405	|  { "message": "Method Not Allowed" }

**8. ตรวจสอบรหัสยืนยัน**
```POST /api/{role}/verifyCode```

Request Body (JSON):
```
{
  "{role}Id": 123,
  "code": "verification_code_here"
}
```
Response:

•	200 OK: หากรหัสยืนยันถูกต้อง
```
{
  "message": "Verification successful!"
}
```

**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
| ขาดหายไปของ {role}Id หรือ code	| 400	| { "error": "กรุณากรอก Verification Code." }
| รหัสยืนยันไม่ถูกต้องหรือหมดอายุ	| 400	| { "error": "Verification code ไม่ถูกต้องหรือหมดอายุ." }
| ข้อผิดพลาดในการตรวจสอบฐานข้อมูล	| 500	| { "error": "Internal server error." }
| ใช้ HTTP method ที่ไม่รองรับ	| 405	| { "error": "405 POST Method Not Allowed" }

**9.การตรวจสอบข้อมูลเข้าสู่ระบบของแอดมิน**
```POST /api/admin/loginAdmin```
**Request Body (JSON):**
```
{
  "adminEmail": "admin@example.com",
  "adminPassword": "yourpassword"
}
```
**Response:**
•	 200 OK (เข้าสู่ระบบสำเร็จ)
```
{
  "AdminID": 1,
  "AdminEmail": "admin@example.com"
}
```
**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
| อีเมลไม่ตรงกับข้อมูลในระบบ	| 400	| { "message": "ชื่อผู้ดูแลระบบหรือรหัสผ่านไม่ถูกต้อง" }
| รหัสผ่านไม่ถูกต้อง	| 400	| { "message": "ชื่อผู้ดูแลระบบหรือรหัสผ่านไม่ถูกต้อง" }
| เกิดข้อผิดพลาดในระบบ	| 500	| { "message": "เกิดข้อผิดพลาดในระบบ" }
| ใช้ HTTP method ที่ไม่ใช่ POST	| 405	| Method <method> ไม่ได้รับอนุญาต

**10.การตรวจสอบข้อมูลเข้าสู่ระบบของผู้ใช้งาน**
```POST /api/user/login```
**Request Body (JSON):**
```
{
  "usernameOrEmail": "user@example.com",
  "UserPassWord": "yourpassword"
}
```

**Response:**
•	200 OK: หากการล็อกอินสำเร็จ
```
{
  "UserId": 123,
  "UserEmail": "user@example.com"
}
```
**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
| ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง	| 400	| { "message": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }
| ข้อผิดพลาดในระบบ	| 500	| { "message": "เกิดข้อผิดพลาดในระบบ" }
| ใช้ HTTP method ที่ไม่รองรับ	| 405	| { "message": "Method POST ไม่ได้รับอนุญาต" }

**11.รับรูปภาพจากกล้อง (Base64) แล้ว บันทึกลงในเซิร์ฟเวอร์**
API นี้ใช้สำหรับรับภาพที่อยู่ในรูปแบบ Base64 แล้วบันทึกลงในโฟลเดอร์ public/uploads/foot_images/<userId>/ ของระบบ
```POST /api/saveImage```
 รับข้อมูล:
•	base64Image: รูปภาพในรูปแบบ base64
•	userId: รหัสผู้ใช้เพื่อจัดกลุ่มโฟลเดอร์ภาพ
•	fileName: ชื่อไฟล์ภาพ เช่น foot_top_001.png

**Request Body (JSON):**
```
{
  "base64Image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
  "userId": "12345",
  "fileName": "left_foot.png"
}
```

**Response เมื่อสำเร็จ 200 OK**
```
{ "success": true, "imageUrl": "/uploads/foot_images/12345/left_foot.png" }
```

**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
| ข้อมูลใน request body ไม่ครบ	| 400	| { "success": false, "message": "ข้อมูลไม่ครบถ้วน" }
| เกิดข้อผิดพลาดขณะบันทึกไฟล์	| 500	| { "success": false, "message": "เกิดข้อผิดพลาดในการจัดเก็บรูปภาพ" }
| ส่ง request ด้วย method ที่ไม่ใช่ POST	| 405	| { "success": false, "message": "เกิดข้อผิดพลาดในการจัดเก็บรูปภาพ" }

**12.บันทึกข้อมูลรูปภาพลงในตาราง FootImage**

```POST /api/user/saveFootImage```
Request Body (JSON):
```
{
  "userId": 123,
  "imageCategoryId": 1,
  "side": "left",
  "pathUrl": "/uploads/foot_images/123/left_top.png",
  "orderId": 456
}
```
Response
•	 Success 200 OK
```
{
  "message": "Image saved successfully",
  "id": 27,
  "dateTime": "2025-04-16T14:00:00.000Z"
}
```

**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
| ข้อมูลที่ส่งมาไม่ครบถ้วน ต้องมีทุกฟิลด์ที่กำหนดไว้ เช่น userId, imageCategoryId, side, pathUrl, orderId	| 400 Bad Request	| { "message": " All fields are required " }
| Method ที่ใช้ไม่ถูกต้อง (ต้องเป็น POST เท่านั้น)	| 405 Method Not Allowed	| { "message": “Method not allowed " }
| เกิดข้อผิดพลาดภายในระบบระหว่างการบันทึกข้อมูลภาพ	| 500 Internal Server Error	| { "message": " Method not allowed " }


13. เชื่อมข้อมูล FootData ของผู้ใช้จากฐานข้อมูล
```GET /api/footData?userId=12345```
Response (สำเร็จ):
```
{
  "A": 24.5,
  "B": 12.3,
  "C": 10.1,
  "D": 5.2,
  "E": 5.1,
  "F": 7.0,
  "G": 8.0,
  "H": 3.5,
  "I": 6.5,
  "type": "อุ้งเท้าปกติ"
}
```
 - ใช้แก้ไขข้อมูล FootData ของผู้ใช้จากฐานข้อมูล
PUT  /api/footData
```
Request Body (JSON):
{
  "userId": "12345",
  "status": "active",
  "message": "ข้อมูลได้รับการอัปเดต",
  "A": 25.0,
  "B": 13.0,
  "C": 11.0,
  "D": 6.0,
  "E": 5.5,
  "F": 7.5,
  "G": 8.5,
  "H": 4.0,
  "I": 7.0
}
```
**Response
•	 Success 200 OK**
```
{
  "message": "ข้อมูลถูกบันทึกเรียบร้อย"
}
```

**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
| ข้อมูลไม่ครบถ้วนหรือไม่ถูกต้อง เช่น ขาดพารามิเตอร์ที่จำเป็น	| 400 Bad Request	| { "message": " All fields are required " }
| ไม่พบข้อมูลที่ร้องขอ เช่น ข้อมูล FootData ไม่พบในฐานข้อมูล	| 405 Method Not Allowed	| { "message": “Method not allowed " }
| ข้อผิดพลาดภายในเซิร์ฟเวอร์ เช่น การเชื่อมต่อฐานข้อมูลล้มเหลว	| 500 Internal Server Error	| { "message": " Method not allowed " }

**14.แสดงแบบจำลองสามมิติ**
```GET /api/foot3d```
ดึงข้อมูลเส้นทางของโมเดลเท้า 3 มิติ (Foot3D) ของผู้ใช้ตาม userId และ side (ซ้ายหรือขวา)
**•	Success 200 OK:**
```
{
  "Foot3DPath": "<path-to-foot3d-model>"
}
```

**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
| ขาดพารามิเตอร์ userId หรือ side ในคำขอ | 400 Bad Request	| "Missing userId or side"	
| ไม่พบโมเดล Foot3D สำหรับ userId และ side ที่ระบุ | 404 Not Found	| "Foot3D model not found"	
| เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ | 500 Internal Server Error	| "Internal Server Error"
| ใช้ HTTP method ที่ไม่ถูกต้อง | 405 Method Not Allowed	| "Method Not Allowed"

**15.ระบบแจ้งเตือน**

```GET /api/notification```
**Request Parameters**
-	userId (พารามิเตอร์ใน query): รหัสผู้ใช้
**Response:
-	200 OK:**
```
{
  "notifications": [
    {
      "NotificationID": 1,
      "OrderID": 1001,
      "Message": "ข้อความแจ้งเตือน",
      "isRead": 0,
      "Username": "user123",
      "NotificationDateTime": "2025-04-16 10:00:00",
      "Status": "รอดำเนินการ"
    },
    ...
  ]
}
```


**15. ใช้สำหรับสร้าง Order และ Notification ใหม่สำหรับผู้ใช้ รวมถึงการแจ้งเตือนสำหรับแอดมิน**
``` POST /api/notification```
**(Request Body):**
•	userId (string): รหัสผู้ใช้
•	message (string): ข้อความการแจ้งเตือน
•	status (string): สถานะของการแจ้งเตือน (เช่น "รอดำเนินการ", "เสร็จสิ้น")
**Response
201 Created:**
```
{
  "success": true,
  "message": "Order and Notification created successfully",
  "orderId": 1001
}
```

```PUT /api/notification```

**(Request Body):**

•	notificationId (number): รหัสของการแจ้งเตือนที่ต้องการอัปเดต

**Response):
•	200 OK:**
```
{
  "message": "Notification marked as read"
}

```

```DELETE /api/notification```
**Request Body:**
•	notificationIds (array): รายการ NotificationID ที่ต้องการลบ
•	deleteAll (boolean): ถ้าต้องการลบการแจ้งเตือนทั้งหมด
•	userId (string): รหัสผู้ใช้ (ถ้า deleteAll เป็น true)
**Response):
•	200 OK**
```
{
  "message": "Selected notifications deleted"
}
```


**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
ขาดพารามิเตอร์ userId ในคำขอ | 400 Bad Request	| "Missing userId"	
ขาดข้อมูลที่จำเป็น (เช่น userId, message) | 400 Bad Request	| "Missing required fields"	
เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ | 500 Internal Server Error	| "Internal Server Error"	
ไม่มีการระบุการแจ้งเตือนที่ต้องการลบ | 400 Bad Request	| "Invalid request: No notifications specified"	
ใช้ HTTP method ที่ไม่ถูกต้อง | 405 Method Not Allowed	| "Method Not Allowed"	

**16. สำหรับการจัดการคำสั่งซื้อ**
```POST /api/orderDetailed```
**Request Body:**
```
{
  "userId": "int",             // UserID ของผู้ใช้งาน
  "message": "string",         // ข้อความแจ้งเตือน (Optional)
  "status": "string",          // สถานะของการแจ้งเตือน (Optional)
  "quantity": "int",           // จำนวนสินค้า
  "shippingFee": "float",      // ค่าขนส่ง
  "totalPrice": "float",       // ราคารวม
  "addressOrder": "string",    // ที่อยู่การจัดส่ง
  "houseNumber": "string",     // หมายเลขบ้าน
  "street": "string",          // ถนน
  "city": "string",            // เมือง
  "district": "string",        // เขต
  "province": "string",        // จังหวัด
  "zip_code": "string"         // รหัสไปรษณีย์
}
```

**Response:
•	200 ok**
```
{
  "success": true,
  "message": "Order created successfully",
  "orderId": "int"
}
```

**GET /api/orderDetailed**
Query Parameters:
•	userId: (จำเป็น) ID ของผู้ใช้งานที่ต้องการดึงคำสั่งซื้อ
•	allUserIds: (ไม่จำเป็น) ถ้ากำหนดเป็น true ระบบจะดึงคำสั่งซื้อทั้งหมดของทุกผู้ใช้งาน
**Response 200 OK**
```
{
  "success": true,
  "orders": [
    {
      "OrderDetailedID": "int",
      "UserId": "int",
      "Username": "string",
      "DateTime": "string",
      "Quantity": "int",
      "ShippingFee": "float",
      "TotalPrice": "float",
      "OrderID": "int",
      "Address": "string"
    },
    ...
  ]
}
```

**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
ขาดการระบุ userId ใน request body หรือ query parameter ขณะที่คำสั่งซื้อหรือคำขออื่น ๆ ต้องการ userId | 400 Bad Request	| userId is required	
ไม่มี session หรือ cookie ที่ถูกต้องในการตรวจสอบตัวตนของผู้ใช้ | 401 Unauthorized	| No session found	
HTTP method ที่ใช้ไม่ได้รับการรองรับใน endpoint นั้น ๆ เช่นการใช้ PUT กับ endpoint ที่รองรับแค่ GET หรือ POST | 405 Method Not Allowed	| Method not allowed	
เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์หรือฐานข้อมูลขณะประมวลผลคำขอของผู้ใช้งาน | 500 Internal Server Error	| Internal server error	

**17.สำหรับสร้างคำสั่งรายการ (Order)**
 ใช้สำหรับสร้างคำสั่งซื้อใหม่ (Order) โดยอ้างอิงจาก userId ที่ดึงจาก session (cookie)
```POST  /api/order```
**Response 201 (Created)**
```
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "OrderID": 1,
    "UserID": "123",
    "Status": "รอดำเนินการ",
    ...
  }
}
```

```GET  /api/order ```
Query Parameters:
•	ไม่มี (ใช้ userId จาก session)
**Response:
•	Status: 200 (OK)**
```
{
  "success": true,
  "orders": [
    {
      "OrderID": 1,
      "UserID": "123",
      "Username": "user123",
      "FirstDate": "2025-04-16 12:30:00",
      "LastDate": "2025-04-17 14:00:00",
      "Status": "รอดำเนินการ",
      ...
    },
    ...
  ]
}
```

ใช้สำหรับอัปเดตสถานะคำสั่งซื้อให้เป็น "สำเร็จ"
```PUT /api/order```
**Request Body:**
```
{
  "orderId": 1
}
```	
**Response:
•	Status: 200 (OK)**
```
{
  "success": true,
  "message": "Order status updated successfully"
}
```

**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
ไม่มี session หรือ cookie ที่ถูกต้องเพื่อให้สามารถดึง userId ได้ | 401 Unauthorized	| No session found	
ไม่พบ userId ใน session (cookie) | 401 Unauthorized	| No userId in session	
ไม่มี orderId ใน request body (ใช้สำหรับการอัปเดตสถานะคำสั่งซื้อ) | 400 Bad Request	| Order ID is required	
ใช้ HTTP method ที่ไม่รองรับ เช่น DELETE หรือ PATCH | 405 Method Not Allowed	| Method not allowed	
เกิดข้อผิดพลาดภายในระบบ เช่น การเชื่อมต่อกับฐานข้อมูลหรือการประมวลผลคำขอผิดพลาด | 500 Internal Server Error	| Internal server error	


**18.รับข้อมูลโมเดลเท้า 3D**
```GET /api/foot3d/getUsersWithFoot3D```
**HTTP Status 200)**
```
[
  {
    "UserID": 1,
    "Username": "user1",
    "Foot3DPath": "path/to/foot3d_model_right_1.stl",
    "Side": "Right"
  },
  {
    "UserID": 2,
    "Username": "user2",
    "Foot3DPath": "path/to/foot3d_model_right_2.stl",
    "Side": "Right"
  }
]
```
**HTTP Response Status Table**
| กรณี                    | HTTP Status | ตัวอย่างข้อความ |
|---------------------------|-------------|------------------|
ดึงข้อมูลโมเดลเท้า 3D ข้างขวาล่าสุดได้สำเร็จ | 200	สำเร็จ (Success)		| [ { "UserID": 1, "Username": "user1", "Foot3DPath": "...", "Side": "Right" } ]
มีการเรียกใช้ method ที่ไม่รองรับ เช่น POST, PUT, DELETE | 405	Method Not Allowed		| { "error": "Method Not Allowed" }
เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ เช่น query ผิดพลาด, เชื่อมต่อฐานข้อมูลล้มเหลว	| 500	Internal Server Error	| { "error": "Internal Server Error" }











