import React from "react";

import "./FollowersCard.css";
import { useState } from "react";
import profile from "../../api/profile";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router";
const FollowersCard = (userName = null) => {
  const [toFollowList, setToFollowList] = useState();
  const [followersList, setFollowersList] = useState();
  const [page, setPage] = useState(1);
  const [updateToFollow, setUpdateToFollow] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getToFollow();
    getFollowers();
  }, [updateToFollow]);

  const getToFollow = async () => {
    //var userId = userProfileId ? userProfileId : userContext.user.UserId;
    // console.log("userId and user context", userContext, userId);

    var result = await profile.tryGetTofollow();
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

    setToFollowList(result.data);
  };

  const getFollowers = async () => {
    //var userId = userProfileId ? userProfileId : userContext.user.UserId;
    // console.log("userId and user context", userContext, userId);

    var result = await profile.tryGetFollowing(userName, 1);
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

    setFollowersList(result.data);
  };

  const handleViewPage = (profile) => {
    navigate(`/${profile.userName}`);
  };

  const handleFollow = async (idx) => {
    var toFollowListBackup = JSON.parse(JSON.stringify(toFollowList));
    var toFollowListCopy = [...toFollowList];
    toFollowListCopy.splice(idx, 1);
    // console.log(
    //   "after splicing the array",
    //   toFollowListCopy,
    //   toFollowListBackup
    // );
    setToFollowList(toFollowListCopy);

    //update backend server

    var result = await profile.tryCreateFollowerToggle({
      toFollowId: toFollowListBackup[idx]?.userId,
    });

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
      setToFollowList(toFollowListBackup);
      return;
    }

    //refetch follow suggestions if all followed
    if (toFollowListBackup.length === 1) {
      setUpdateToFollow(!updateToFollow);
    }
  };

  return (
    <div className="FollowersCard">
      <h3>Who is following you</h3>
      {toFollowList && (
        <>
          {toFollowList?.slice(0, 4)?.map((follower, id) => {
            return (
              <div className="follower" key={id}>
                <div>
                  <img src={follower.profilePicUrl} alt="" />
                  <div className="followername">
                    <span className="FollowerName">{`${
                      follower.firstName ? follower.firstName : ""
                    } ${follower.lastname ? follower.lastname : ""}`}</span>
                    {follower.userName && <span>@{follower.userName}</span>}
                  </div>
                </div>
                <button
                  className="f-button button"
                  onClick={() => handleFollow(id)}
                >
                  Follow
                </button>
              </div>
            );
          })}
          {followersList?.slice(0, 4)?.map((follower, id) => {
            return (
              <div className="follower" key={id}>
                <div>
                  <img src={follower.profilePicUrl} alt="" />
                  <div className="followername">
                    <span className="FollowerName">{`${
                      follower.firstName ? follower.firstName : ""
                    } ${follower.lastname ? follower.lastname : ""}`}</span>
                    {follower.userName && <span>@{follower.userName}</span>}
                  </div>
                </div>
                <button
                  className="f-button button"
                  onClick={() => handleViewPage(follower)}
                >
                  View
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default FollowersCard;
