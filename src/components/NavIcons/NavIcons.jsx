import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Home from "../../img/home.png";
import Notification from "../../img/noti.png";
import Messages from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import { UilSearch } from "@iconscout/react-unicons";
import * as Icon from "react-feather";
import ChatContext from "../../auth/ChatContext";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

const NavIcons = ({ isLauncherBar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("🚀 ~ file: NavIcons.jsx ~ line 12 ~ NavIcons ~ location", location)
  const { messageBadge } = useContext(ChatContext);

  const UserDropdown = () => {
    // const { logout, isAuthenticated } = useAuth0();
    return (
      <DropdownMenu right>
        <DropdownItem
          tag="a"
          href="#"
          className="dropdownPopupItem"
          // onClick={(e) => handleNavigation(e, "/pages/profile")}
        >
          <Icon.User size={14} className="mr-50" />
          <span className="align-middle">Edit Profile</span>
        </DropdownItem>
        <DropdownItem
          tag="a"
          href="#"
          className="dropdownPopupItem"
          // onClick={(e) => handleNavigation(e, "/email/inbox")}
        >
          <Icon.Mail size={14} className="mr-50" />
          <span className="align-middle">My Inbox</span>
        </DropdownItem>
        <DropdownItem
          tag="a"
          href="#"
          className="dropdownPopupItem"
          // onClick={(e) => handleNavigation(e, "/todo/all")}
        >
          <Icon.CheckSquare size={14} className="mr-50" />
          <span className="align-middle">Tasks</span>
        </DropdownItem>
        <DropdownItem
          tag="a"
          href="#"
          className="dropdownPopupItem"
          // onClick={(e) => handleNavigation(e, "/chat")}
        >
          <Icon.MessageSquare size={14} className="mr-50" />
          <span className="align-middle">Chats</span>
        </DropdownItem>
        <DropdownItem
          tag="a"
          href="#"
          className="dropdownPopupItem"
          // onClick={(e) => handleNavigation(e, "/ecommerce/wishlist")}
        >
          <Icon.Heart size={14} className="mr-50" />
          <span className="align-middle">WishList</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem
          tag="a"
          href="/pages/login"
          className="dropdownPopupItem"
          // onClick={(e) => {
          //   e.preventDefault();
          //   if (isAuthenticated) {
          //     return logout({
          //       returnTo:
          //         window.location.origin + process.env.REACT_APP_PUBLIC_PATH,
          //     });
          //   } else {
          //     const provider = props.loggedInWith;
          //     if (provider !== null) {
          //       if (provider === "jwt") {
          //         return props.logoutWithJWT();
          //       }
          //       if (provider === "firebase") {
          //         return props.logoutWithFirebase();
          //       }
          //     } else {
          //       history.push("/pages/login");
          //     }
          //   }
          // }}
        >
          <Icon.Power size={14} className="mr-50" />
          <span className="align-middle">Log Out</span>
        </DropdownItem>
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
      <img src={Notification} alt="" />
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
              Najuna James
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
              src="https://localhost:7204/media/images/f88016a5-24e4-4110-8a4b-ce979ba09916.jpg"
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
