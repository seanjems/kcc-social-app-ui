import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import "./NameLink.css";

const NameLink = ({ dataObj, callBackFn }) => {
  // console.log("🚀 ~ file: NameLink.jsx ~ line 6 ~ NameLink ~ dataObj", dataObj);
  const data = dataObj.creatorUSer;

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");
  // console.log("🚀 ~ file: NameLink.jsx ~ line 6 ~ NameLink ~ data", data);

  // const daysAgo = (pastDate) => {
  //   const date1 = new Date();
  //   const date2 = new Date(pastDate);
  //   const diffTime = Math.abs(date2 - date1);
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   console.log(diffTime + " milliseconds");
  //   console.log(diffDays + " days");
  // };
  //console.log(data);

  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }
  return (
    <>
      <div className="follower ">
        <div>
          {/* {online && <div className="online-dot"></div>} */}
          <img
            src={data?.profilePicUrl}
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="d-flex flex-column">
            <div className="d-flex">
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => callBackFn(data)}
                className="mr-1"
              >
                {data?.firstName} {data?.lastName}
              </span>

              {data?.userName && (
                <span
                  onClick={() => callBackFn(data)}
                  style={{ cursor: "pointer", marginLeft: "0.5rem" }}
                  className="text-secondary"
                >
                  {"  "}@{data?.userName}
                </span>
              )}
            </div>
            {dataObj.createdAt && (
              <small className="text-secondary">
                {/* use twitter timaago style */}
                {timeAgo.format(
                  convertUTCDateToLocalDate(new Date(dataObj.createdAt)),
                  "twitter"
                )}
                {/* {console.log(
                  "🚀 ~ file: NameLink.jsx ~ line 60 ~ NameLink ~ dataObj.createdAt",
                  dataObj.createdAt
                )} */}
              </small>
            )}{" "}
            {/* {console.log(
            // "🚀 ~ file: NameLink.jsx ~ line 63 ~ NameLink ~ createdAt",
            // data.createdAt
            // )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default NameLink;
