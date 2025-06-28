import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBell } from "@fortawesome/free-solid-svg-icons";
import NotificationPopup from "../../components/NotificationPopup";
import { updatePageTitle } from "../../utils/routeTitle";
import Pagination from "../../components/Paginate";
import OrderCard from "../../components/OrderCard";

const InsoleOrder = () => {
  const router = useRouter();
  const [AdminID, setAdminID] = useState(null);
  const [PathProfileImage, setPathProfileImage] = useState(
    "/default-profile.png"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [oldestOrderDate, setOldestOrderDate] = useState(null);
  const [orderCode, setOrderCode] = useState("");
  const [userName, setUserName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleNotification = () => setShowNotification(!showNotification);
  const closeNotification = () => setShowNotification(false);

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
      } catch (error) {}
    };
    const fetchAdminData = async (AdminID) => {
      try {
        const response = await fetch(`/api/admin/getAdmin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ AdminID: AdminID }),
        });

        if (response.ok) {
          const data = await response.json();
          setPathProfileImage(
            data[0].PathProfileImage || "/default-profile.png"
          );
        }
      } catch (error) {}
    };

    fetchSessionData();
  }, []);
  useEffect(() => {
    if (AdminID) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`/api/admin/notificationAdmin`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Admin-ID": AdminID,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.notifications && data.notifications.length > 0) {
              setNotifications(data.notifications);
            } else {
              setNotifications([]);
            }
          }
        } catch (error) {}
      };

      fetchNotifications();
    }
  }, [AdminID]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/order?allUserIds=true`);
      if (response.ok) {
        const data = await response.json();
        const allOrders = [].concat(...data.allOrders.map((user) => user));

        setOrders(allOrders);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUserIds = async () => {
    try {
      const response = await fetch("/api/orderDetailed?allUserIds=true");
      if (response.ok) {
        const data = await response.json();
        const allOrders = [].concat(
          ...data.allOrdersDetailed.map((user) => user.orders)
        );

        setOrderDetails(allOrders);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUserIds();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const oldestOrder = orders.reduce((oldest, currentOrder) => {
        const currentDate = new Date(currentOrder.DateTime);
        const oldestDate = new Date(oldest.DateTime);
        return currentDate < oldestDate ? currentOrder : oldest;
      });

      if (oldestOrder && oldestOrder.DateTime) {
        const start = new Date(oldestOrder.DateTime);
        setStartDate(start);
        setOldestOrderDate(start);
      }
    }
  }, [orders]);

  const stripTime = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  let hasError = false;
  useEffect(() => {
    let filtered = orders
      .filter((order) => {
        const userNameMatches =
          order.Username?.toString()
            .toLowerCase()
            .includes(userName.toLowerCase()) ?? false;
        const orderIdMatches =
          order.OrderID?.toString()
            .toLowerCase()
            .includes(orderCode.toLowerCase()) ?? false;
        const dateMatch =
          (!startDate ||
            new Date(stripTime(order.DateTime)) >=
              new Date(stripTime(startDate))) &&
          (!endDate ||
            new Date(stripTime(order.DateTime)) <=
              new Date(
                new Date(stripTime(endDate)).setDate(
                  new Date(stripTime(endDate)).getDate()
                )
              ));

        return orderIdMatches && userNameMatches && dateMatch;
      })
      .sort((a, b) => b.OrderID - a.OrderID);

    setFilteredOrders(filtered);
  }, [orders, userName, orderCode, startDate, endDate]);
  const ordersPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const handleProfileClick = () => {
    router.push("/AdminPage/EditAcc");
  };
  return (
    <div>
      <div className="header-with-back-icon">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-icon"
          onClick={() => router.push("/AdminPage/HomePage")}
        />
        <div className="top-right-icon">
          <FontAwesomeIcon
            icon={faBell}
            className="notification-icon"
            onClick={toggleNotification}
          />
          <NotificationPopup
            notifications={notifications}
            showNotification={showNotification}
            closeNotification={closeNotification}
          />
          <img
            src={PathProfileImage}
            alt="Profile"
            className="profile-pic"
            onClick={handleProfileClick}
          />
        </div>
      </div>
      <div className="searchBar">
        <h1>รายการสั่งซื้อ</h1>

        <div className="orderStatusGroup">
          <div className="searchItemOrderId">
            <FaSearch />
            <input
              type="text"
              placeholder="รหัสการสั่ง"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
            />
          </div>
          <div className="searchItem username">
            <FaSearch />
            <input
              type="text"
              placeholder="ชื่อผู้ใช้งาน"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </div>

        <div className="searchStartEndDate">
          <div className="startDate">
            <FaCalendarAlt className="calendar-icon" />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              minDate={oldestOrderDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="เริ่มวันที่"
            />
          </div>
          <div className="endDate">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={oldestOrderDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="ถึงวันที่"
            />
          </div>
        </div>
      </div>
      <div className="orders-container">
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : currentOrders.length > 0 ? (
          currentOrders.map((order, index) => (
            <OrderCard
              key={index}
              orderID={order.OrderID}
              status={order.Status}
              date={order.DateTime}
              username={order.Username}
              firstdate={order.FirstDateTime}
              lastdate={order.LastDateTime}
              orderDetails={orderDetails}
              isAdmin={true}
            />
          ))
        ) : (
          <p>ไม่พบข้อมูล</p>
        )}
      </div>
      <div className="pagination">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default InsoleOrder;
