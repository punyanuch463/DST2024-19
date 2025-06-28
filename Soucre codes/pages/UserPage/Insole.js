"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBell } from "@fortawesome/free-solid-svg-icons";
import { FaPlus, FaMinus, FaPencilAlt, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import NotificationPopup from "../../components/NotificationPopup";
import useUserSession from "../../utils/sessionUser";
import parseAddress from "../../utils/addressUtils";

const InsoleOrder = () => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [userData, setUserData] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
 const [isMounted, setIsMounted] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true); 
  const [activeButton, setActiveButton] = useState("right");
  const [selectedAddress, setSelectedAddress] = useState({
    addressOrder: "",
    houseNumber: "",
    street: "",
    city: "",
    district: "",
    province: "",
    zip_code: "",
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [modalMessage, setModalMessage] = useState(""); 

    
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
  

  const handleSessionReady = useCallback((uid) => {
    fetchUserData(uid);
    fetchPreviousOrderAddress(uid);
  }, []);

  const userId = useUserSession(handleSessionReady);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/api/user/getUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data[0]);
        if (data[0]?.Address) {
          const newAddress = {
            addressOrder: data[0].Address,
            houseNumber: data[0].houseNumber || "",
            street: data[0].street || "",
            city: data[0].city || "",
            district: data[0].district || "",
            province: data[0].province || "",
            zip_code: data[0].zip_code || "",
          };

          setSavedAddresses((prev) => {
            const updatedAddresses = [...prev, newAddress];
            return updatedAddresses;
          });

          setSelectedAddress({
            addressOrder: data[0].Address,
            houseNumber: data[0].houseNumber || "",
            street: data[0].street || "",
            city: data[0].city || "",
            district: data[0].district || "",
            province: data[0].province || "",
            zip_code: data[0].zip_code || "",
          });
        } else {
          setSavedAddresses([]);
        }
        await fetchPreviousOrderAddress(userId);
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {}, [savedAddresses, selectedAddress]);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `/api/user/notificationUser?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setNotifications(
            Array.isArray(data.notifications) ? data.notifications : []
          );
        } else {
          
        }
      } catch (error) {
        
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleOrder = async () => {
    if (!userId) {
      
      
      setModalMessage("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
      setIsModalOpen(true); 
      router.push("/UserPage/LoginPage");
      return;
    }
    const addressString = `${selectedAddress.houseNumber} ${selectedAddress.street} ${selectedAddress.district} ${selectedAddress.city} ${selectedAddress.province} ${selectedAddress.zip_code}`;

    try {
      const detailedResponse = await fetch("/api/orderDetailed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          quantity,
          shippingFee,
          totalPrice,
          addressOrder: addressString,
          houseNumber: selectedAddress.houseNumber,
          street: selectedAddress.street,
          city: selectedAddress.city,
          district: selectedAddress.district,
          province: selectedAddress.province,
          zip_code: selectedAddress.zip_code,
          message: "คำสั่งซื้อของคุณถูกบันทึกเรียบร้อยแล้ว",
          status: "Unread",
        }),
      });

      const detailedResult = await detailedResponse.json();
      if (detailedResponse.ok) {
        
        setModalMessage("สั่งซื้อสำเร็จ! หมายเลขคำสั่งซื้อ: " + detailedResult.orderId);
        setIsModalOpen(true); 
        setTimeout(() => {
          router.push("/UserPage/HomePageUser");
        }, 2000); 
      }
       else {
        
        setModalMessage(`เกิดข้อผิดพลาด: ${detailedResult.message}`);
        setIsModalOpen(true); 
      }
    } catch (error) {
      setModalMessage("ไม่สามารถสั่งซื้อได้ กรุณาลองอีกครั้ง");
      setIsModalOpen(true); 
    }
  };

  const pricePerUnit = 100;
  const shippingFee = 50;

  useEffect(() => {
    setTotalPrice(pricePerUnit * quantity + shippingFee);
  }, [quantity]);

  const mergeAddresses = (newAddresses) => {
    const uniqueAddresses = new Map();
    newAddresses.forEach((addr) => {
      uniqueAddresses.set(JSON.stringify(addr), addr); 
    });
    return [...uniqueAddresses.values()]; 
  };

  const fetchPreviousOrderAddress = async (userId) => {
    try {
      const response = await fetch(`/api/orderDetailed?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();

        if (
          data?.success &&
          Array.isArray(data.orders) &&
          data.orders.length > 0
        ) {
          
          const sortedOrders = data.orders.sort(
            (a, b) => new Date(b.DateTime) - new Date(a.DateTime)
          );

          
          const uniqueAddressMap = new Map();
          for (const order of sortedOrders) {
            const address = (order.Address || "").trim();
            if (!uniqueAddressMap.has(address) && address !== "") {
              const parsed = parseAddress(address);
              uniqueAddressMap.set(address, {
                addressOrder: address,
                ...parsed,
              });
            }
            if (uniqueAddressMap.size === 3) break; 
          }

          const uniqueAddresses = Array.from(uniqueAddressMap.values());
          setSavedAddresses((prev) => {
            const updatedAddresses = mergeAddresses([
              ...prev,
              ...uniqueAddresses,
            ]);
            return updatedAddresses;
          });

          const firstUniqueAddress = uniqueAddresses[0];
          setSelectedAddress((prevSelected) => {
            return prevSelected.addressOrder
              ? prevSelected
              : firstUniqueAddress;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching orderDetailed:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const fetchFoot3DModel = async () => {
      setIsLoadingModel(true); 
      try {
        const response = await fetch(
          `/api/foot3d?userId=${userId}&side=${activeButton}`
        );
        if (response.ok) {
          const data = await response.json();
          setModelUrl(data.Foot3DPath);
        } else {
          
        }
      } catch (error) {
        
      }
      finally {
        setIsLoadingModel(false); 
      }
    };
    fetchFoot3DModel();
  }, [userId, activeButton]);
  const handleProfileClick = () => {
    router.push("/UserPage/EditAcc");
  };

  
    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    if (!isMounted || isLoadingModel) {
      return <div className="loading">กำลังโหลดข้อมูล...</div>;
    }
    
  return (
    <div className="page-container">
      <div className="header-with-back-icon">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-icon"
          onClick={() => router.back()}
        />
        <div className="top-right-icon">
          <FontAwesomeIcon
            icon={faBell}
            className="notification-icon"
            onClick={() => setShowNotification(!showNotification)}
          />
          <NotificationPopup
            notifications={notifications}
            showNotification={showNotification}
            closeNotification={() => setShowNotification(false)}
          />
          <img
            src={userData?.PathProfileImage || "/default-profile.png"}
            alt="Profile"
            className="profile-pic"
            onClick={handleProfileClick}
          />
        </div>
      </div>

      <div className="insole-container">
        <h1>สั่งซื้อแผ่นรองในรองเท้า</h1>

        { modelUrl ? (
          <div className="order-card-wrapper">
            <div className="order-card">
              <div className="order-info">
                <div className="order-user">
                  <span>
                    ชื่อผู้สั่ง: {userData?.FullName || "กำลังโหลด..."}
                  </span>
                  <span>
                    วันที่สั่ง:{" "}
                    {new Date().toLocaleDateString("th-TH", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                  <span>
                    เวลาที่สั่ง:{" "}
                    {new Date().toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="order-quantity">
                  <span>จำนวนที่สั่ง:</span>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="qty-btn"
                    >
                      <FaMinus />
                    </button>
                    <span className="qty-number">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="qty-btn"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <span className="price-per-unit">
                  💰 ราคาต่อชิ้น: {pricePerUnit} ฿
                </span>{" "}
                <div className="order-address">
                  <div className="address-label">
                    <label htmlFor="address-select">ที่อยู่สำหรับจัดส่ง:</label>
                    {!isEditingAddress ? (
                      <FaPencilAlt
                        className="edit-address-icon"
                        onClick={() => setIsEditingAddress(true)}
                      />
                    ) : (
                      <FaTimes
                        className="edit-address-icon cancel-icon"
                        onClick={() => {
                          
                          if (savedAddresses.length > 0) {
                            setSelectedAddress(savedAddresses[0]);
                          } else {
                            setSelectedAddress({
                              houseNumber: "",
                              street: "",
                              city: "",
                              district: "",
                              province: "",
                              zip_code: "",
                            });
                          }
                          setIsEditingAddress(false);
                        }}
                      />
                    )}
                  </div>

                  {!isEditingAddress ? (
                    <select
                      id="address-select"
                      className="address-select"
                      value={
                        selectedAddress && selectedAddress.houseNumber
                          ? JSON.stringify(selectedAddress)
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "new") {
                          setSelectedAddress({
                            houseNumber: "",
                            street: "",
                            district: "",
                            city: "",
                            province: "",
                            zip_code: "",
                          });
                          setIsEditingAddress(true);
                        } else {
                          try {
                            setSelectedAddress(JSON.parse(value));
                          } catch (error) {
                            
                          }
                        }
                      }}
                    >
                      {[
                        ...new Map(
                          savedAddresses.map((addr) => [
                            JSON.stringify(addr),
                            addr,
                          ])
                        ).values(),
                      ].map((addr, index) => (
                        <option key={index} value={JSON.stringify(addr)}>
                          {`${addr.houseNumber} ${addr.street} ${addr.district} ${addr.city} ${addr.province} ${addr.zip_code}`}
                        </option>
                      ))}
                      <option value="new">กรอกที่อยู่ใหม่</option>
                    </select>
                  ) : (
                    <>
                      <input
                        type="text"
                        required
                        placeholder="บ้านเลขที่"
                        value={selectedAddress?.houseNumber || ""}
                        onChange={(e) =>
                          setSelectedAddress((prev) => ({
                            ...prev,
                            houseNumber: e.target.value,
                          }))
                        }
                      />

                      <input
                        type="text"
                        required
                        placeholder="ถนน"
                        value={selectedAddress?.street || ""}
                        onChange={(e) =>
                          setSelectedAddress((prev) => ({
                            ...prev,
                            street: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="text"
                        required
                        placeholder="อำเภอ/แขวง"
                        value={selectedAddress?.district || ""}
                        onChange={(e) =>
                          setSelectedAddress((prev) => ({
                            ...prev,
                            district: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="text"
                        required
                        placeholder="อำเภอ/เขต"
                        value={selectedAddress?.city || ""}
                        onChange={(e) =>
                          setSelectedAddress((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                      />

                      <input
                        type="text"
                        required
                        placeholder="จังหวัด"
                        value={selectedAddress?.province || ""}
                        onChange={(e) =>
                          setSelectedAddress((prev) => ({
                            ...prev,
                            province: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="text"
                        required
                        placeholder="รหัสไปรษณีย์"
                        value={selectedAddress?.zip_code || ""}
                        onChange={(e) =>
                          setSelectedAddress((prev) => ({
                            ...prev,
                            zip_code: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="confirm-order-btn"
                        onClick={() => {
                          const {
                            houseNumber,
                            street,
                            district,
                            city,
                            province,
                            zip_code,
                          } = selectedAddress;

                          
                          const addressFields = [
                            { label: "ถนน", value: street },
                            { label: "ตำบล/แขวง", value: district },
                            { label: "อำเภอ/เขต", value: city },
                            { label: "จังหวัด", value: province },
                          ];

                          for (const field of addressFields) {
                            if (/\d/.test(field.value)) {
                              
                              
                              setModalMessage(`${field.label} กรอกเป็นตัวอักษรเท่านั้น`);
                              setIsModalOpen(true); 
                              return; 
                            }
                          }
                          
                          if (
                            !houseNumber.trim() ||
                            !street.trim() ||
                            !district.trim() ||
                            !city.trim() ||
                            !province.trim() ||
                            !zip_code.trim()
                          ) {
                            setModalMessage("กรุณากรอกข้อมูลที่อยู่ให้ครบทุกช่องก่อนบันทึก");
                            setIsModalOpen(true); 
                          }
                          
                          if (!/^\d{5}$/.test(zip_code)) {
                            setModalMessage("กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง (5 หลัก)");
                            setIsModalOpen(true); 
                            
                          }

                          setSavedAddresses((prev) => {
                            
                            const isValid =
                              selectedAddress.houseNumber &&
                              selectedAddress.street &&
                              selectedAddress.district &&
                              selectedAddress.city &&
                              selectedAddress.province &&
                              selectedAddress.zip_code;

                            if (!isValid) {
   
                              return prev;
                            }

                            
                            const index = prev.findIndex(
                              (addr) =>
                                addr.houseNumber ===
                                  selectedAddress.houseNumber &&
                                addr.street === selectedAddress.street &&
                                addr.district === selectedAddress.district &&
                                addr.city === selectedAddress.city &&
                                addr.province === selectedAddress.province &&
                                addr.zip_code === selectedAddress.zip_code
                            );

                            if (index !== -1) {
                              
                              const updated = [...prev];
                              updated[index] = selectedAddress;
                              return updated;
                            }

                            
                            return [...prev, selectedAddress];
                          });

                          
                          setIsEditingAddress(false);
                        }}
                      >
                        บันทึกที่อยู่
                      </button>
                    </>
                  )}
                </div>
                <div className="order-price">
                  <div className="price-details">
                    <span>ค่าส่ง:</span>
                    <span className="price-value">
                      {shippingFee ?? "กำลังโหลด..."} ฿
                    </span>
                  </div>

                  <div className="price-details">
                    <span>ราคารวม:</span>
                    <span className="price-value total-price">
                      {totalPrice} ฿
                    </span>
                  </div>
                </div>
              </div>

              <button className="confirm-order-btn" onClick={handleOrder}>
                ยืนยันการสั่งซื้อ
              </button>
            </div>
          </div>
        ) : (
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "18px",
              color: "gray",
            }}
          >
            ยังไม่มีภาพโมเดล 3 มิติ
          </p>
        )}
        
      </div>
      {isModalOpen && (
  <div className="modal">
    <div className="modalContent">
      <span className="close" onClick={closeModal}>
        &times;
      </span>
      <p>{modalMessage}</p>
      <div className="modalButtons">
        <button className="confirmButton" onClick={closeModal}>
          ตกลง
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default InsoleOrder;
