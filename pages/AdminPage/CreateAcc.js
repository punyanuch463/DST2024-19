"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { updatePageTitle } from "../../utils/routeTitle";
const CreateAccount = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    AdminName: "",
    AdminPassword: "",
    AdminEmail: "",
    PhoneNumber: "",
  });
  const [message, setMessage] = useState(null);
  const router = useRouter();
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
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (
      !formData.AdminName ||
      !formData.AdminPassword ||
      !formData.AdminEmail ||
      !formData.PhoneNumber
    ) {
      setMessage({ text: "กรุณากรอกข้อมูลทั้งหมด", type: "error" });
      return;
    }

    try {
      const res = await fetch("/api/admin/addadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        await fetch("/api/admin/sessionAdmin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminId: data.AdminId }),
        });

        setTimeout(() => {
          router.push("/AdminPage/SettingAcc");
        }, 500);
      } else {
        setMessage({
          text: `ข้อผิดพลาดในการสร้างบัญชี: ${data.message}`,
          type: "error",
        });
      }
    } catch (error) {
      setMessage({ text: "ข้อผิดพลาดในการส่งข้อมูล", type: "error" });
    }
  };

  return (
    <div className="container">
      <div className="status-bar">
        <div className="circle active">1</div>
        <div className="circle">2</div>
        <div className="circle">3</div>
      </div>
      <h1>สร้างบัญชีผู้ดูแลระบบ</h1>
      <div className="subtitle">
        <span>คุณมีบัญชีอยู่แล้ว? </span>
        <a href="/AdminPage/LoginPage">เข้าสู่ระบบ</a>
      </div>
      {message && <p className={`alert ${message.type}`}>{message.text}</p>}
      <form onSubmit={handleCreateAccount}>
        <div className="input-group">
          <label htmlFor="AdminName">ชื่อผู้ใช้</label>
          <input
            type="text"
            id="AdminName"
            name="AdminName"
            value={formData.AdminName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="AdminEmail">อีเมล</label>
          <input
            type="email"
            id="AdminEmail"
            name="AdminEmail"
            value={formData.AdminEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="AdminPassword">รหัสผ่าน</label>
          <div className="input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              id="AdminPassword"
              name="AdminPassword"
              value={formData.AdminPassword}
              onChange={handleChange}
              required
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className="password-icon"
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="PhoneNumber">เบอร์โทรศัพท์</label>
          <input
            type="text"
            id="PhoneNumber"
            name="PhoneNumber"
            value={formData.PhoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="primary-btn">
          ต่อไป
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
