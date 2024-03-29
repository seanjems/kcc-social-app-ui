import React, { useState } from "react";
import { useEffect } from "react";
import "../../pages/Chat/Chat.css";

// import { useDispatch } from "react-redux";
// import { getUser } from "../../api/UserRequests";
const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);
  // const dispatch = useDispatch();

  useEffect(() => {
    //const userId = data.members.find((id) => id !== currentUser);
    const getUserData = async () => {
      // try
      // {
      //     const {data} =await getUser(userId)
      //    setUserData(data)
      //    dispatch({type:"SAVE_USER", data:data})
      // }
      // catch(error)
      // {
      //   console.log(error)
      // }
    };

    // getUserData();
  }, []);
  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <img
            src={
              data.profilePicUrl.startsWith("media")
                ? `${process.env.REACT_APP_PUBLIC_API_URL}/${data.profilePicUrl}`
                : data.profilePicUrl
            }
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="name d-flex flex-column">
            <span className="fw-bold">
              {data?.firstName} {data?.lastName}
            </span>
            <span style={{ color: online ? "#51e200" : "" }}>
              {online ? "Online" : ""}
            </span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
