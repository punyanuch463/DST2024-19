"use client";

import React, { useState, useEffect } from "react";
import { updatePageTitle } from "../../utils/routeTitle";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCheck,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import withAuthAdmin from "../../hoc/withAuthAdmin";

const SettingAccount = () => {
  const router = useRouter();
  const [Adminid, setAdminid] = useState(null);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [PathProfileImageFile, setPathProfileImageFile] = useState(null);
  const [PathProfileImageUrl, setPathProfileImageUrl] = useState(null); 
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    birthDate: "",
    age: "",
    height: "",
    address: "",
    houseNumber: "",
    street: "",
    city: "",
    district: "",
    province: "",
    zip_code: "",
    consent: false,
  });

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
    let isMounted = true;

    const fetchSession = async () => {
      try {
        const res = await fetch("/api/admin/getSessionadmin");
        const data = await res.json();

        if (res.ok && isMounted) {
          setAdminid(data.AdminID);
        } else if (isMounted) {
          setMessage("ไม่พบข้อมูลผู้ใช้งาน กรุณาล็อกอินใหม่");
        }
      } catch (error) {
        if (isMounted) {
          setMessage("ไม่พบข้อมูลผู้ใช้งาน กรุณาล็อกอินใหม่");
        }
      }
    };

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNext = async () => {
    if (!formData.fullName) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลชื่อ-นามสกุล",
        type: "error",
      });
      return;
    }
    if (!formData.gender) {
      setMessage({ text: "ข้อผิดพลาด: กรุณากรอกข้อมูลเพศ", type: "error" });
      return;
    }
    if (!formData.birthDate) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลวันเดือนปีเกิด",
        type: "error",
      });
      return;
    }
    if (!formData.height) {
      setMessage({ text: "ข้อผิดพลาด: กรุณากรอกข้อมูลส่วนสูง", type: "error" });
      return;
    }

    if (!formData.houseNumber) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลบ้านเลขที่",
        type: "error",
      });
      return;
    }
    if (!formData.street) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลถนน",
        type: "error",
      });
      return;
    }
    if (!formData.district) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลแขวง",
        type: "error",
      });
      return;
    }

    if (!formData.city) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลเขต",
        type: "error",
      });
      return;
    }
    if (!formData.province) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลจังหวัด",
        type: "error",
      });
      return;
    }
    if (!formData.zip_code) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกข้อมูลรหัสไปรษณีย์",
        type: "error",
      });
      return;
    }

    setMessage("");

    try {
      let uploadedImageUrl = null;
      if (PathProfileImageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", PathProfileImageFile);
        uploadFormData.append("AdminID", Adminid);
        const uploadRes = await fetch("/api/admin/uploadToFolder", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadData = await uploadRes.json();

        if (uploadRes.ok && uploadData.success) {
          uploadedImageUrl = uploadData.imageUrl;
        } else {
          setMessage(`เกิดข้อผิดพลาดในการอัปโหลดภาพ: ${uploadData.message}`);
          return;
        }
      }
      const formattedDob = new Date(formData.birthDate)
        .toISOString()
        .split("T")[0];

      const res = await fetch("/api/admin/updateAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Adminid: Adminid,
          ...formData,
          birthDate: formattedDob,
          PathProfileImage: uploadedImageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/AdminPage/Consent");
      } else {
        setMessage({
          text: data.message || "เกิดข้อผิดพลาดในการลงทะเบียน",
          type: "error",
        });
      }
    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  const toggleGenderVisibility = () => {
    setIsGenderOpen(!isGenderOpen);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPathProfileImageFile(file);
      setPathProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [id]: value,
      };

      if (
        id === "houseNumber" ||
        id === "street" ||
        id === "city" ||
        id === "district" ||
        id === "province" ||
        id === "zip_code"
      ) {
        updatedFormData.address = `${updatedFormData.houseNumber || ""} ${
          updatedFormData.street || ""
        } ${updatedFormData.district || ""}  ${updatedFormData.city || ""} ${
          updatedFormData.province || ""
        } ${updatedFormData.zip_code || ""}`.trim();
      }

      return updatedFormData;
    });
    if (id === "birthDate") {
      const age = calculateAge(value);
      setFormData({ ...formData, birthDate: value, age: age });
    }
  };

  function calculateAge(dateOfBirth) {
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

  return (
    <div className="container">
      <div className="status-bar">
        <div className="circle complete">
          <FontAwesomeIcon icon={faCheck} />
        </div>
        <div className="circle active">2</div>
        <div className="circle">3</div>
      </div>
      <h1>ตั้งค่าบัญชี</h1>

      {message && <p className={`alert ${message.type}`}>{message.text}</p>}

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
                PathProfileImageUrl || "/default-profile.png"
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
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="gender">เพศ</label>
          <div className="select-wrapper-setting">
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
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
          <label htmlFor="birthday">วันเกิด</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
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
            value={formData.age}
            readOnly
          />
        </div>

        <div className="input-group">
          <label htmlFor="heightCM">ส่วนสูง (เซนติเมตร)</label>
          <input
            type="heightCM"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            step="0.01"
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
            value={formData.houseNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="street">ถนน</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="district">แขวง(ตำบล)</label>
          <input
            type="text"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="city">เขต</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="province">จังหวัด</label>
          <input
            type="text"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="zip_code">รหัสไปรษณีย์</label>
          <input
            type="text"
            id="zip_code"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="address">การแสดงผลที่อยู่</label>
          <textarea
          type="text"
            id="address"
            name="address"
            value={formData.address || ""}
            readOnly
            rows="4"
          />
        </div>
      </div>

      <div className="fixed-button-container">
        <button type="button" className="primary-btn" onClick={handleNext}>
          ต่อไป
        </button>
      </div>
    </div>
  );
};

export default withAuthAdmin(SettingAccount);
