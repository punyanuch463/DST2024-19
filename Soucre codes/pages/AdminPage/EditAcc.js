"use client";
import React, { useState, useEffect } from "react";
import { updatePageTitle } from "../../utils/routeTitle";
import withAuthAdmin from "../../hoc/withAuthAdmin";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronDown,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";

const EditAccount = () => {
  const router = useRouter();
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [PathProfileImageFile, setPathProfileImageFile] = useState(null);
  const [PathProfileImage, setPathProfileImage] = useState(null);
  const [AdminID, setAdminID] = useState(null);
  const [userData, setUserData] = useState({
    fullName: "",
    gender: "",
    birthDate: "",
    age: "",
    height: "",
    address: "",
    houseNumber: "",
    street: "",
    district: "",
    city: "",
    province: "",
    zip_code: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  useEffect(() => {
    updatePageTitle(router.pathname);
    const handleRouteChange = (url) => {
      updatePageTitle(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionRes = await fetch("/api/admin/getSessionadmin");
        const sessionData = await sessionRes.json();
        if (sessionRes.ok && sessionData.AdminID) {
          setAdminID(sessionData.AdminID);
          fetchAdminData(sessionData.AdminID);
        }
      } catch (error) {
        setMessage({
          text: "เกิดข้อผิดพลาดในการดึงข้อมูล session",
          type: "error",
        });
        setIsLoading(false);
      }
    };

    const fetchAdminData = async (adminID) => {
      if (adminID) {
        try {
          const response = await fetch(`/api/admin/getAdmin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ AdminID: adminID }),
          });

          if (response.ok) {
            const data = await response.json();

            const formattedBirthDate = data[0].BirthDate
              ? new Date(data[0].BirthDate).toISOString().split("T")[0]
              : "";

            const age = formattedBirthDate
              ? calculateAge(formattedBirthDate)
              : "";

            setUserData({
              fullName: data[0].FullName || "",
              gender: data[0].Gender || "",
              birthDate: formattedBirthDate,
              height: data[0].Height || "",
              age: age,

              address: data[0].Address || "",
              houseNumber: data[0].houseNumber || "",
              street: data[0].street || "",
              district: data[0].district || "",
              city: data[0].city || "",
              province: data[0].province || "",
              zip_code: data[0].zip_code || "",
            });
            setPathProfileImage(
              data[0].PathProfileImage
                ? `/${data[0].PathProfileImage.replace(/^\/|AdminPage\//, "")}`
                : "/default-profile.png"
            );
          } else {
            const errorData = await response.json();
            setMessage({
              text: errorData.message || "ไม่สามารถดึงข้อมูลผู้ใช้",
              type: "error",
            });
          }
        } catch (err) {
          setMessage({ text: "เกิดข้อผิดพลาดที่ไม่คาดคิด", type: "error" });
        } finally {
          setIsLoading(false);
        }
      } else {
        setMessage({ text: "ไม่พบ Id ใน session", type: "error" });
        setIsLoading(false);
      }
    };

    if (AdminID) {
      fetchAdminData(AdminID);
    } else {
      fetchSessionData();
    }
  }, [AdminID]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => {
      let updatedData = { ...prevData, [id]: value };
      if (id === "birthDate") {
        updatedData.age = value ? calculateAge(value) : "";
      }
      if (
        [
          "houseNumber",
          "street",
          "district",
          "city",
          "province",
          "zip_code",
        ].includes(id)
      ) {
        updatedData.address = `${updatedData.houseNumber || ""}  ${
          updatedData.street || ""
        } ${updatedData.city || ""}  ${updatedData.province || ""} ${
          updatedData.zip_code || ""
        }`.trim();
      }

      return updatedData;
    });
  };
  function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return "";

    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  const handleNext = async () => {
    if (!userData.fullName) {
      setMessage({ text: "กรุณากรอกข้อมูลชื่อ-นามสกุล", type: "error" });
      return;
    }
    if (!userData.gender) {
      setMessage({ text: "กรุณากรอกข้อมูลเพศ", type: "error" });
      return;
    }
    if (!userData.birthDate) {
      setMessage({ text: "กรุณาเลือกวันเกิด", type: "error" });
      return;
    }
    if (!userData.height) {
      setMessage({ text: "กรุณากรอกข้อมูลส่วนสูง", type: "error" });
      return;
    }

    if (!userData.houseNumber) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลบ้านเลขที่",
        type: "error",
      });
      return;
    }
    if (!userData.street) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลถนน",
        type: "error",
      });
      return;
    }
    if (!userData.district) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลแขวง",
        type: "error",
      });
      return;
    }

    if (!userData.city) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลเขต",
        type: "error",
      });
      return;
    }
    if (!userData.province) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลจังหวัด",
        type: "error",
      });
      return;
    }
    if (!userData.zip_code) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลรหัสไปรษณีย์",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "" });

    try {
      let uploadedImageUrl = null;

      if (PathProfileImageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", PathProfileImageFile);
        uploadFormData.append("AdminID", AdminID);

        const uploadRes = await fetch("/api/admin/uploadToFolder", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadData = await uploadRes.json();

        if (uploadRes.ok && uploadData.success) {
          uploadedImageUrl = uploadData.imageUrl;
        } else {
          setMessage({
            text: `เกิดข้อผิดพลาดในการอัปโหลดภาพ: ${uploadData.message}`,
            type: "error",
          });
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch("/api/admin/updateAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          AdminID: AdminID,
          ...userData,
          birthday: userData.birthDate,
          PathProfileImage: uploadedImageUrl || PathProfileImage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "แก้ไขข้อมูลสำเร็จ", type: "success" });
        setTimeout(() => {
          router.push(`/AdminPage/HomePage`);
        }, 500);
      } else {
        setMessage({ text: `เกิดข้อผิดพลาด: ${data.message}`, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "เกิดข้อผิดพลาดในการส่งข้อมูล", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  const toggleGenderVisibility = () => {
    setIsGenderOpen(!isGenderOpen);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPathProfileImageFile(file);
      setPathProfileImage(URL.createObjectURL(file));
    }
  };
  const handleLogout = async (sessionType) => {
    await fetch("/api/logOut", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionType }),
      credentials: "include",
    });
    window.location.href = "/AdminPage/LoginPage";
  };

  return (
    <div className="container">
      <FontAwesomeIcon
        icon={faArrowLeft}
        className="back-icon"
        onClick={() => window.history.back()}
      />
      <h1>ตั้งค่าบัญชี</h1>

      {message.text && (
        <p className={`alert ${message.type}`}>{message.text}</p>
      )}

      <div className="profile-image-wrapper">
        <input
          type="file"
          accept="image/*"
          id="PathProfileImage"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <label htmlFor="PathProfileImage" className="profile-image-label">
          <div
            className="profile-image"
            style={{
              backgroundImage: `url(${
                PathProfileImage?.replace(/^\/UserPage\//, "/") ||
                "/default-profile.png"
              })`,
            }}
          ></div>
          <FontAwesomeIcon icon={faCamera} className="camera-icon" />
        </label>
      </div>
      <div className="form-Container">
        <div className="input-group">
          <label htmlFor="fullName">ชื่อ-นามสกุล</label>
          <input
            type="text"
            id="fullName"
            value={userData.fullName || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="gender">เพศ</label>
          <div className="select-wrapper-setting">
            <select
              type="text"
              id="gender"
              value={userData.gender || ""}
              onChange={handleInputChange}
              className={isGenderOpen ? "open" : ""}
              required
            >
              <option value="">เลือกเพศ</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่นๆ</option>
            </select>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="select-icon"
              onClick={toggleGenderVisibility}
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="birthDate">วันเกิด</label>
          <input
            type="text"
            id="birthDate"
            name="birthDate"
            value={userData.birthDate || ""}
            onChange={handleInputChange}
            max={
              new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                .toISOString()
                .split("T")[0]
            }
          />
        </div>

        <div className="input-group">
          <label>อายุ</label>
          <input
            type="text"
            id="age"
            name="age"
            value={userData.age || ""}
            readOnly
          />
        </div>

        <div className="input-group">
          <label htmlFor="heightCM">ส่วนสูง (เซนติเมตร)</label>
          <input
            type="heightCM"
            id="height"
            value={userData.height || ""}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="houseNumber">บ้านเลขที่</label>
          <input
            type="text"
            id="houseNumber"
            name="houseNumber"
            value={userData.houseNumber}
            onChange={handleInputChange}
            required
            placeholder="กรอกชื่อบ้านเลขที่"
          />
        </div>

        <div className="input-group">
          <label htmlFor="street">ถนน</label>
          <input
            type="text"
            id="street"
            name="street"
            value={userData.street}
            onChange={handleInputChange}
            required
            placeholder="กรอกชื่อถนน"
          />
        </div>

        <div className="input-group">
          <label htmlFor="district">แขวง (ตำบล)</label>
          <input
            type="text"
            id="district"
            name="district"
            value={userData.district}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="city">เขต (อำเภอ)</label>
          <input
            type="text"
            id="city"
            name="city"
            value={userData.city}
            onChange={handleInputChange}
            required
            placeholder="กรอกชื่อเมือง"
          />
        </div>

        <div className="input-group">
          <label htmlFor="province">จังหวัด</label>
          <input
            type="text"
            id="province"
            name="province"
            value={userData.province}
            onChange={handleInputChange}
            required
            placeholder="กรอกชื่อจังหวัด"
          />
        </div>

        <div className="input-group">
          <label htmlFor="zip_code">รหัสไปรษณีย์</label>
          <input
            type="text"
            id="zip_code"
            name="zip_code"
            value={userData.zip_code}
            onChange={handleInputChange}
            required
            placeholder="กรอกรหัสไปรษณีย์"
          />
        </div>

        <div className="input-group">
          <label htmlFor="address">การแสดงผลที่อยู่</label>
         
          <input
            type="text"
            id="address"
            name="address"
            value={userData.address || ""}
            readOnly
            rows="4"
            placeholder="กรุณากรอกที่อยู่"
          />
        </div>
      </div>
      <div className="fixed-button-container">
        <button
          type="button"
          className="edit-btn"
          onClick={handleNext}
          disabled={isLoading}
        >
          {isLoading ? "กำลังดำเนินการ..." : "แก้ไขข้อมูลส่วนตัว"}
        </button>

        <button
          type="button"
          className="logout-btn"
          onClick={() => handleLogout("session-admin")}
          disabled={isLoading}
        >
          {isLoading ? "กำลังดำเนินการ..." : "ออกจากระบบ"}
        </button>

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuthAdmin(EditAccount);
