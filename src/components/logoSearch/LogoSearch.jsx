import React, {
  Fragment,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Logo from "../../img/logo.png";
import { UilSearch } from "@iconscout/react-unicons";
import "./LogoSearch.css";
import { useNavigate } from "react-router-dom";
import Conversation from "../Coversation/Conversation";
import profile from "../../api/profile";
import { IconX } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { useRef } from "react";
import { forwardRef } from "react";
const LogoSearch = forwardRef((props, ref) => {
  const { setSelectedItemCallBack } = props;

  const navigate = useNavigate();
  const [userResult, setUserResult] = useState();
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef();

  //call search user api
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // console.log(searchTerm);
      if (!searchTerm) {
        setUserResult(null);
        return;
      }
      searchUsers(searchTerm, 1);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // finishup the search and sendback the selected data
  useEffect(() => {
    if (!selectedResult) {
      setUserResult(null);
      return;
    }

    setSelectedItemCallBack && setSelectedItemCallBack(selectedResult);
    setUserResult(null);
  }, [selectedResult]);

  //handle refs fowarded to textinput
  useImperativeHandle(ref, () => ({
    focusOnSearch() {
      searchInputRef && searchInputRef.current?.focus();
    },
  }));

  //method to search users
  const searchUsers = async (keywords, page) => {
    var result = await profile.trySearchUsers(keywords, page);
    if (!result.ok) {
      showNotification({
        id: "save-data",
        icon: <IconX size={16} />,
        title: "Error",
        message: `${result.status ? result.status : ""} ${result.problem}`,
        autoClose: true,
        disallowClose: false,
        style: { zIndex: "999999" },
      });
      return;
    }
    setUserResult(result.data);
  };

  return (
    <Fragment>
      <div className="LogoSearch">
        <div className="logoIcon" onClick={() => navigate("../home")}>
          <img src={Logo} alt="sda-logo" />
        </div>
        <div className="Search">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="#Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="s-icon">
            <UilSearch />
          </div>
        </div>
      </div>

      {userResult && (
        <div
          className="Chat-list"
          style={{
            maxHeight: "25rem",
            overflowY: "scroll",
          }}
        >
          {userResult.map((chat, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedResult(chat);
              }}
            >
              <Conversation
                data={chat}
                //currentUser={userId}
                //online={checkOnlineStatus(chat)}
              />
            </div>
          ))}
        </div>
      )}
    </Fragment>
  );
});

export default LogoSearch;
