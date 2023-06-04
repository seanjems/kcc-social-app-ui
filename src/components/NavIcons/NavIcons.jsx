import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Home from "../../img/home.png";
import Notification from "../../img/noti.png";
import Messages from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import { UilSearch } from "@iconscout/react-unicons";
import * as Icon from "react-feather";
import ChatContext from "../../auth/ChatContext";
import "./NavIcons.css";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { useState } from "react";
import notifications from "../../api/notifications";
import profile from "../../api/profile";
import AuthContext from "../../auth/context";

const NavIcons = ({ isLauncherBar }) => {
  const [notificationsList, setNotificationsList] = useState();
  const [userProfile, setUserProfile] = useState({});
  const userContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("🚀 ~ file: NavIcons.jsx ~ line 12 ~ NavIcons ~ location", location)
  const { messageBadge } = useContext(ChatContext);

  const getUserProfile = async () => {
    var userId = userContext.user.UserId;

    // var userId = userProfileId ? userProfileId : userContext.user.UserId;
    // console.log("userId and user context", userContext, userId);

    // call api

    var user = await profile.tryGetUserProfile(userId, null);
    if (!user.ok) {
      return;
    }

    setUserProfile(user.data);
    console.log(
      "🚀 ~ file: NavIcons.jsx:49 ~ getUserProfile ~ user.data:",
      user.data
    );
  };

  const handleGetNotifications = async () => {
    var list = await notifications.tryGetNotificationsForUser();

    if (!list.ok) {
      // showNotification({
      //   id: "save-data",
      //   icon: <IconX size={16} />,
      //   title: "Error",
      //   message: `${list.status ? list.status : ""} ${list.problem}`,
      //   autoClose: true,
      //   disallowClose: false,
      //   style: { zIndex: "999999" },
      // });
      console.log("Error fetching notifications", list.originalError);
      return;
    }
    setNotificationsList(list.data);
    console.log(
      "🚀 ~ file: NavIcons.jsx:46 ~ handleGetNotifications ~ list.data:",
      list.data
    );
  };
  useEffect(() => {
    handleGetNotifications();
    getUserProfile();
  }, []);
  const UserDropdown = () => {
    // const { logout, isAuthenticated } = useAuth0();
    return (
      <DropdownMenu right>
        <DropdownItem
          tag="a"
          href="#"
          className="dropdownPopupItem"
          onClick={() => navigate("../profile")}
        >
          <Icon.User size={14} className="mr-50" />
          <span className="align-middle">My Profile</span>
        </DropdownItem>
        <DropdownItem
          tag="a"
          href="#"
          className="dropdownPopupItem"
          onClick={() => navigate("../profile/edit")}
        >
          <Icon.CheckSquare size={14} className="mr-50" />
          <span className="align-middle">Update Profile</span>
        </DropdownItem>
        <DropdownItem
          tag="a"
          href="#"
          className="dropdownPopupItem"
          onClick={() => navigate("../chat")}
        >
          <Icon.Mail size={14} className="mr-50" />
          <span className="align-middle">My Inbox</span>
        </DropdownItem>
        <DropdownItem
          tag="a"
          href="#"
          className="dropdownPopupItem"
          onClick={() => navigate("../article")}
        >
          <Icon.List size={14} className="mr-50" />
          <span className="align-middle">Articles</span>
        </DropdownItem>
        {/* <DropdownItem
          tag="a"
          href="#"
          className="dropdownPopupItem"
          // onClick={(e) => handleNavigation(e, "/chat")}
        >
          <Icon.ShoppingCart size={14} className="mr-50" />
          <span className="align-middle">Tithe & Offertory</span>
        </DropdownItem> */}

        <DropdownItem divider />
        <DropdownItem
          tag="a"
          href="#"
          className="dropdownPopupItem"
          onClick={() => {
            userContext.setUser(null);
            localStorage.removeItem("token");
          }}
        >
          <Icon.Power size={14} className="mr-50" />
          <span className="align-middle">Log Out</span>
        </DropdownItem>
      </DropdownMenu>
    );
  };
  const NotificationDropdown = () => {
    // const { logout, isAuthenticated } = useAuth0();
    return (
      <DropdownMenu
        left
        style={{
          width: "400px",
          height: "300px",
        }}
      >
        <div style={{ height: "fitContent" }}>
          <span
            className="nameBold"
            style={{
              marginLeft: "0.5rem",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            Notifications
          </span>

          <DropdownItem divider />
        </div>
        <div style={{ width: "100%", height: "85%", overflow: "auto" }}>
          {notificationsList &&
            notificationsList.map((item, key) => (
              <DropdownItem
                tag="a"
                href="#"
                className="dropdownPopupItem"
                // onClick={(e) => handleNavigation(e, "/pages/profile")}
              >
                <NotificationItem notificationItem={item} key={key} />
              </DropdownItem>
            ))}
        </div>
      </DropdownMenu>
    );
  };
  return (
    <div className="navIcons">
      <img src={Home} alt="" onClick={() => navigate("../home")} />

      {isLauncherBar ? (
        <UilSearch
          onClick={() => navigate("../search")}
          style={{ height: "2rem", width: "2rem" }}
        />
      ) : (
        "" // <UilSetting style={{ height: "2rem", width: "2rem" }} />
      )}

      <UncontrolledDropdown
        tag="li"
        className="dropdown-user nav-item"
        style={{ listStyle: "none" }}
      >
        <DropdownToggle
          tag="a"
          className="nav-link dropdown-user-link d-flex  align-items-center"
          style={{ gap: "rem" }}
        >
          <img
            src={Notification}
            alt=""
            style={{ height: "2rem", width: "2rem" }}
          />
        </DropdownToggle>
        <NotificationDropdown />
      </UncontrolledDropdown>
      <div style={{ position: "relative" }}>
        <img src={Messages} alt="" onClick={() => navigate("../chat")} />
        {messageBadge > 0 && (
          <span
            className="badge badge-dark"
            style={{
              //position: "absolute",
              right: "-0.5rem",
              bottom: "-0.5rem",
              //backgroundColor: "red",
            }}
          >
            {messageBadge}
          </span>
        )}
      </div>
      <UncontrolledDropdown
        tag="li"
        className="dropdown-user nav-item"
        style={{ listStyle: "none" }}
      >
        <DropdownToggle
          tag="a"
          className="nav-link dropdown-user-link d-flex  align-items-center"
          style={{ gap: "rem" }}
        >
          <div className="d-flex flex-column align-items-end justify-content-center hideMobile">
            <span
              style={{ fontWeight: "bold", fontSize: "0.7rem" }}
              className="text-bold"
            >
              {`${userProfile.firstName ?? ""} ${userProfile.lastname ?? ""}`}
            </span>
            <span
              style={{ fontWeight: "lighter", fontSize: "0.6rem" }}
              className="user-status"
            >
              Available
            </span>
          </div>
          <span data-tour="user">
            <img
              style={{
                borderRadius: "50%",
                overflow: "clip",
                marginLeft: "0.5rem",
              }}
              src={userProfile?.profilePicUrl}
              height="40"
              width="40"
              alt="avatar"
            />
          </span>
        </DropdownToggle>
        <UserDropdown />
      </UncontrolledDropdown>
    </div>
  );
};

export default NavIcons;

const NotificationItem = ({ notificationItem }) => (
  <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem", display: "flex" }}>
    <span data-tour="user">
      <img
        style={{
          borderRadius: "50%",
          overflow: "clip",
          marginRight: "1rem",
        }}
        src={notificationItem.userProfilePic}
        height="40"
        width="40"
        alt="avatar"
      />
    </span>
    <div className="d-flex flex-column align-items-start justify-content-center">
      <span className="nameBold">{notificationItem.title}</span>
      {notificationItem.message && (
        <span className="nameGrey" style={{ overflowX: "wrap" }}>
          {notificationItem.message}
        </span>
      )}
      <hr
        style={{ marginTop: "0px", marginBottom: "0px" }}
        className="nameSeparator"
      />
    </div>
  </div>
);
