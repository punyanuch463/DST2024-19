"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { updatePageTitle } from "../../utils/routeTitle";
const AdminLogin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    adminEmail: "",
    adminPassword: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = async () => {
    if (!formData.adminEmail) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกอีเมลผู้ดูแลระบบ",
        type: "error",
      });
      return;
    }

    if (!formData.adminPassword) {
      setMessage({
        text: "ข้อผิดพลาด: กรุณากรอกรหัสผ่านผู้ดูแลระบบ",
        type: "error",
      });
      return;
    }

    try {
      const loginRes = await fetch("/api/admin/loginadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const loginData = await loginRes.json();
      if (loginRes.ok) {
        const sessionRes = await fetch("/api/admin/sessionAdmin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminId: loginData.AdminID }),
        });

        const sessionData = await sessionRes.json();

        if (sessionRes.ok) {
          setMessage({ text: "เข้าสู่ระบบสำเร็จ", type: "success" });
          setTimeout(() => {
            router.push("/AdminPage/HomePage");
          }, 500);
        } else {
          setMessage({
            text: `ข้อผิดพลาด: ${sessionData.message}`,
            type: "error",
          });
        }
      } else {
        setMessage({ text: `ข้อผิดพลาด: ${loginData.message}`, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "ข้อผิดพลาดในการส่งข้อมูล", type: "error" });
    }
  };

  return (
    <div className="container">
      <h1>เข้าสู่ระบบผู้ดูแลระบบ</h1>
      {message.text && (
        <p className={`alert ${message.type}`}>{message.text}</p>
      )}

      <div className="subtitle">
        <span>ยังไม่มีบัญชี? </span>
        <a href="/AdminPage/CreateAcc">สร้างบัญชี</a>
      </div>
      <form>
        <div className="input-group">
          <label htmlFor="adminEmail">อีเมล</label>
          <input
            type="email"
            id="adminEmail"
            name="adminEmail"
            autoComplete="username"
            value={formData.adminEmail}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="adminPassword">รหัสผ่าน</label>
          <div className="input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              id="adminPassword"
              name="adminPassword"
              autoComplete="current-password"
              value={formData.adminPassword}
              onChange={handleChange}
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className="password-icon"
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>

        <button type="button" className="primary-btn" onClick={handleNext}>
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
