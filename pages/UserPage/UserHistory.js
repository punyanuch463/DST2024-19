import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronDown,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NotificationPopup from "../../components/NotificationPopup";
import { updatePageTitle } from "../../utils/routeTitle";
import Pagination from "../../components/Paginate";
import OrderCard from "../../components/OrderCard";

const Orders = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [PathProfileImage, setPathProfileImage] = useState("/default-profile.png");
  const [oldestOrderDate, setOldestOrderDate] = useState(null);
  const [orderCode, setOrderCode] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router) {
      const handleRouteChange = (url) => {
        updatePageTitle(url);
      };

      router.events.on("routeChangeComplete", handleRouteChange);

      
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, [router]);

  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orderDetailed?userId=${userId}`);
        if (response.ok) {
          const dataOrderDetails = await response.json();
          setOrderDetails(dataOrderDetails.orders); 
        }
      } catch (error) {
       
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrderDetails();
  }, [userId]);

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/order?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
          
        } else {
          
        }
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionRes = await fetch("/api/getSession");
        const sessionData = await sessionRes.json();

        if (sessionRes.ok && sessionData.userId) {
          setUserId(sessionData.userId);
          fetchUserData(sessionData.userId);
        } else {
          router.push("/UserPage/LoginPage");
        }
      } catch (error) {
        
        router.push("/UserPage/LoginPage");
      }
    };

    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(`/api/user/getUser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setPathProfileImage(data[0]?.PathProfileImage || "/default-profile.png");
        }
      } catch (error) {
        
      }
    };

    fetchSessionData();
  }, [router]);

  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const toggleNotification = () => setShowNotification(!showNotification);
  const closeNotification = () => setShowNotification(false);

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

  const stripTime = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const [currentPage, setCurrentPage] = useState(1); 
  const [ordersPerPage] = useState(5); 
  const [totalPages, setTotalPages] = useState(1); 

  
  const paginateOrders = (orders, currentPage, ordersPerPage) => {
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    return orders.slice(indexOfFirstOrder, indexOfLastOrder);
  };
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.DateTime);
    const statusMatch = selectedStatus ? order.Status === selectedStatus : true;
    const orderIdMatches =
      order.OrderID?.toString().includes(orderCode) ?? false;

    const dateMatch =
      (!startDate || stripTime(orderDate) >= new Date(stripTime(startDate))) &&
      (!endDate ||
        stripTime(orderDate) <=
          new Date(
            new Date(stripTime(endDate)).setDate(
              new Date(stripTime(endDate)).getDate()
            )
          ));

    return orderIdMatches && statusMatch && dateMatch;
  });
  const sortedFilteredOrders = filteredOrders.sort(
    (a, b) => b.OrderID - a.OrderID
  );
  const currentOrders = paginateOrders(
    sortedFilteredOrders,
    currentPage,
    ordersPerPage
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredOrders.length / ordersPerPage));
  }, [filteredOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      
      const oldestOrder = orders.reduce((oldest, currentOrder) => {
        const currentDate = new Date(currentOrder.DateTime);
        const oldestDate = new Date(oldest.DateTime);
        return currentDate < oldestDate ? currentOrder : oldest;
      });
      if (oldestOrder?.DateTime) {
        setStartDate(new Date(oldestOrder.DateTime)); 
        setOldestOrderDate(new Date(oldestOrder.DateTime));
      }
    }
  }, [orders]); 


  const handleProfileClick = () => {
    router.push("/UserPage/EditAcc");
  };
  
  return (
    <div>
      <div className="header-with-back-icon">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-icon"
          onClick={() => router.push("/UserPage/HomePageUser")}
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
            <img src={PathProfileImage} alt="Profile" className="profile-pic" onClick={handleProfileClick} />
        </div>
      </div>

      <div className="searchBar">
        <h1>ประวัติการดำเนินการ</h1>

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
          <div className="select-wrapper">
            <select
            type='text'
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-select"
            >
              <option value="">สถานะ</option>
              <option value="รอดำเนินการ">รอดำเนินการ</option>
              <option value="สำเร็จ">สำเร็จ</option>
              <option value="ยกเลิก">ยกเลิก</option>
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="select-icon" />
          </div>
        </div>

        <div className="searchStartEndDate">
          <div className="startDate">
            <FaCalendarAlt className="calendar-icon"/>
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
    currentOrders.map((order, index) => {
      return (
        <OrderCard
          key={index}
          orderID={order.OrderID}
          status={order.Status === "รอดำเนิน" ? "รอดำเนินการ" : order.Status}
          date={order.DateTime}
          username={order.Username}
          firstdate={order.FirstDateTime}
          lastdate={order.LastDateTime}
          orderDetails={orderDetails}
        />
        
      );
      
    })
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

export default Orders;
