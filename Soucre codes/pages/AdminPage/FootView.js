import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaSearch} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBell } from "@fortawesome/free-solid-svg-icons";
import NotificationPopup from "../../components/NotificationPopup";
import { updatePageTitle } from "../../utils/routeTitle";
import withAuthAdmin from "../../hoc/withAuthAdmin";

const FootView = () => {
  const toggleNotification = () => setShowNotification(!showNotification);
  const [notifications, setNotifications] = useState([]);
  const [AdminID, setAdminID] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const closeNotification = () => setShowNotification(false);
  const [PathProfileImage, setPathProfileImage] = useState(
    "/default-profile.png"
  );
  const router = useRouter();
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getUsersWithFoot3D");
        const data = await response.json();
        setUsers(data);
      } catch (error) {}
    };
    fetchUsers();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const [searchUserID, setSearchUserID] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [searchSide, setSearchSide] = useState("");

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const filteredUsers = users.filter((user) => {
    const userIDMatch = user.UserID.toString().includes(searchUserID);
    const usernameMatch = user.Username.toLowerCase().includes(
      searchUsername.toLowerCase()
    );
    const userSide =
      searchSide === "" ||
      (["ซ้าย", "ซ", "ซ้", "ซ้า", "left"].includes(searchSide.toLowerCase()) &&
        user.Side.toLowerCase() === "left") ||
      (["ขวา", "ข", "ขว", "right"].includes(searchSide.toLowerCase()) &&
        user.Side.toLowerCase() === "right") ||
      user.Side.toLowerCase().includes(searchSide.toLowerCase());
    return userIDMatch && usernameMatch && userSide;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (selectedUserId) {
      const updateSessionAndNavigate = async () => {
        try {
          const response = await fetch("/api/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: selectedUserId }),
          });

          if (response.ok) {
            router.push("/AdminPage/UserFoot");
          }
        } catch (error) {}
      };

      updateSessionAndNavigate();
    }
  }, [selectedUserId]);

  const handleViewModel = (userId) => {
    setSelectedUserId(userId);
  };

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

      <div className="footView-container">
        <h1>รายการผู้ใช้</h1>

        <div className="search-container">
          <div className="input-container">
            <input
              type="text"
              placeholder="รหัส"
              value={searchUserID}
              onChange={(e) => setSearchUserID(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
        <div className="cardContainer">
          {currentUsers.map((user, index) => (
            <div className="order-card" key={index}>
              <span className="order-id">รหัสการสั่ง: {user.UserID}</span>
              <div className="order-date">ชื่อผู้สั่ง: {user.Username}</div>
              <div className="model-row">
                <span>โมเดลเท้า 3 มิติ</span>
                {user.UserID ? (
                  <button
                    className="view-btn"
                    onClick={() => handleViewModel(user.UserID)}
                  >
                    ดู
                  </button>
                ) : (
                  <span className="text-gray-500">ไม่มีข้อมูล</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="pagination-btn"
          >
            <FaChevronLeft />
          </button>
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number + 1)}
              className={
                currentPage === number + 1 ? "active" : "pagination-btn"
              }
            >
              {number + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="pagination-btn"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};
export default withAuthAdmin(FootView);
