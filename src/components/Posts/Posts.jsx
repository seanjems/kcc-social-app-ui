import React, { useContext, useEffect, useState } from "react";

import "./Posts.css";
import { CommentSection } from "react-comments-section";
import "react-comments-section/dist/index.css";

import Like from "../../img/notlike.png";
import Liked from "../../img/like.png";
import Share from "../../img/share.png";
import Comment from "../../img/comment.png";
import comments from "../../api/comments";
import AuthContext from "../../auth/context";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import posts from "../../api/posts";

const Posts = ({ data, idx, handleLike }) => {
  const userContext = useContext(AuthContext);

  const [postComments, setPostComments] = useState([]);
  const [postCommentsBackup, setPostCommentsBackup] = useState([]);
  const [commentPage, setCommentPage] = useState(0);
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    if (commentPage > 0) {
      handleGetComment();
    }
  }, [commentPage]);

  const handleGetComment = async () => {
    var postId = data?.id;
    var list = await comments.tryGetCommentsPerPost(postId);

    if (!list.ok) {
      showNotification({
        id: "save-data",
        icon: <IconX size={16} />,
        title: "Error",
        message: `${list.status ? list.status : ""} ${list.problem}`,
        autoClose: true,
        disallowClose: false,
        style: { zIndex: "999999" },
      });
      console.log("Error fetching commets", list.originalError);
      return;
    }
    setPostComments(list.data);
    const originalValues = JSON.parse(JSON.stringify(list.data));
    setPostCommentsBackup(originalValues);
  };

  const handlePostComment = async (dataToApi, isReplyComment = false) => {
    console.log("data to send to the api", dataToApi);
    var { userId, comId, avatarUrl, userProfile, fullName, text, replies } =
      dataToApi;
    var formData = new FormData();
    // coverpic && formData.append("coverpic", coverpic);
    // profilepic && formData.append("profilepic", profilepic);
    formData.append("postId", data.id);
    formData.append("commentDesc", text);
    isReplyComment &&
      formData.append(
        "parentCommentId",
        dataToApi.parentOfRepliedCommentId
          ? dataToApi.parentOfRepliedCommentId
          : dataToApi.repliedToCommentId
      );

    //console.log(formData, "formdata Headers....");

    const result = await comments.tryPostComment(formData);

    if (!result.ok) {
      setPostComments(postCommentsBackup);
      showNotification({
        icon: <IconX size={16} />,
        title: "Error",
        message: `${result.status ? result.status : ""} ${result.problem}`,
        autoClose: true,
        disallowClose: false,
        style: { zIndex: "999999" },
      });
      console.log("Error fetching commets", result.originalError);

      return;
    }
    console.log("After success", result);
    setPostComments(result.data.result);
    setPostCommentsBackup(result.data.result);
  };
  const handleEditComment = async (dataToApi) => {
    console.log("data to send to the api", dataToApi);
    var { userId, comId, avatarUrl, userProfile, fullName, text, replies } =
      dataToApi;
    var formData = new FormData();
    // coverpic && formData.append("coverpic", coverpic);
    // profilepic && formData.append("profilepic", profilepic);
    formData.append("id", comId);
    formData.append("commentDesc", text);

    //console.log(formData, "formdata Headers....");

    const result = await comments.tryPutComment(formData);

    if (!result.ok) {
      setPostComments(postCommentsBackup);
      showNotification({
        icon: <IconX size={16} />,
        title: "Error",
        message: `${result.status ? result.status : ""} ${result.problem}`,
        autoClose: true,
        disallowClose: false,
        style: { zIndex: "999999" },
      });
      console.log("Error fetching commets", result.originalError);

      return;
    }
    //console.log("After success", result);
    // setPostComments(result.data.result);
    setPostCommentsBackup(currentData);
  };
  const handleDeleteComment = async (dataToApi) => {
    console.log("data to send to the api", dataToApi);
    var {
      userId,
      comIdToDelete,
      avatarUrl,
      userProfile,
      fullName,
      text,
      replies,
    } = dataToApi;

    const result = await comments.tryDeleteComments(comIdToDelete);

    if (!result.ok) {
      setPostComments(postCommentsBackup);
      showNotification({
        icon: <IconX size={16} />,
        title: "Error",
        message: `${result.status ? result.status : ""} ${result.problem}`,
        autoClose: true,
        disallowClose: false,
        style: { zIndex: "999999" },
      });
      console.log("Error fetching commets", result.originalError);

      return;
    }
    //console.log("After success", result);
    //setPostComments(result.data.result);
    setPostCommentsBackup(currentData);
  };
  return (
    <div className="Posts">
      <span>
        <b>{data.name}</b>
      </span>
      {data.desc && <span>{data.desc}</span>}
      {data.img && <img src={data.img} alt="" />}
      <div className="shareOptions">
        <img
          src={data.liked ? Liked : Like}
          alt=""
          onClick={() => handleLike(idx)}
        />
        {data && (
          <small>
            {data.likes} {data.likes === 1 ? "Like" : "Likes"}
          </small>
        )}
        <img src={Comment} alt="" />
        {data && (
          <small
            onClick={() => {
              //console.log("coments here and data", postComments, data);
              commentPage > 0 ? setCommentPage(0) : setCommentPage(1);
            }}
          >
            {data.comments} {data.comments === 1 ? "Comment" : "Comments"}
          </small>
        )}
        <img src={Share} alt="" />
        <small>
          {data.shares} {data.shares === 1 ? "Share" : "Shares"}
        </small>
      </div>
      {commentPage > 0 && (
        <CommentSection
          currentUser={{
            currentUserId: userContext.user.UserId,
            currentUserImg:
              "https://ui-avatars.com/api/name=Riya&background=random",
            currentUserProfile: "http://localhost:3000/home",
            currentUserFullName: userContext.user.FullName,
          }}
          hrStyle={{ border: "0.5px solid #ff0072" }}
          commentData={postComments}
          logIn={{
            loginLink: "http://localhost:3001/",
            signupLink: "http://localhost:3001/",
          }}
          // customImg="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F13%2F2015%2F04%2F05%2Ffeatured.jpg&q=60"
          inputStyle={{ border: "1px solid rgb(208 208 208)" }}
          formStyle={{ backgroundColor: "white" }}
          submitBtnStyle={{
            border: "1px solid black",
            backgroundColor: "black",
            padding: "7px 15px",
          }}
          customNoComment={() => <></>}
          cancelBtnStyle={{
            border: "1px solid gray",
            backgroundColor: "gray",
            color: "white",
            padding: "7px 15px",
          }}
          titleStyle={{
            display: "none",
          }}
          advancedInput={false}
          onSubmitAction={(data) => handlePostComment(data)}
          onReplyAction={(data) => handlePostComment(data, true)}
          onEditAction={(data) => handleEditComment(data)}
          onDeleteAction={(data) => handleDeleteComment(data)}
          currentData={(data) => setCurrentData(data)}
          replyInputStyle={{
            borderBottom: "1px solid black",
            color: "black",
          }}
        />
      )}
    </div>
  );
};

export default Posts;
