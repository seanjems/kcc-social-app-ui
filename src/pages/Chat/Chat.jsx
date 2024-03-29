import React, { useContext, useEffect, useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import LogoSearch from "../../components/logoSearch/LogoSearch";
import NavIcons from "../../components/NavIcons/NavIcons";
import RightSide from "../../components/RightSide/RightSide";
import AuthContext from "../../auth/context";

import "./Chat.css";

import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import profile from "../../api/profile";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { IconMessagePlus } from "@tabler/icons";
import ChatContext from "../../auth/ChatContext";
const mobile = window.innerWidth <= 768 ? true : false;

const Chat = () => {
  const {
    connection,
    messages,
    setMessages,
    receivedMessage,
    setReceivedMessage,
    InitiateConnection,
    setChats,
    chats,
    onlineUsers,
    setMessageBadge,
  } = useContext(ChatContext);

  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [toggleToMobileRight, setToggleToMobileRight] = useState(true);
  const [browserHistoryBackup, setBrowserHistoryBackup] = useState(null);
  const [countDownTimer, setCountDownTimer] = useState(null);
  // console.log(
  // "🚀 ~ file: Chat.jsx ~ line 24 ~ Chat ~ toggleToMobileRight",
  // toggleToMobileRight
  // );
  const [toggleNow, setToggleNow] = useState();

  const userContext = useContext(AuthContext);
  const userId = userContext.user.UserId;
  const { setIsMobileChatTyping } = useContext(ChatContext);
  const searchInputRef = useRef();

  //configure back button for mobile
  function closeQuickView() {
    // console.log("we have been called to close");
    mobile && setToggleToMobileRight(false); // do whatever you need to close this component
  }

  useEffect(() => {
    setMessageBadge(0);
    if (mobile) {
      // Add a fake history event so that the back button does nothing if pressed once
      window.history.pushState(
        "fake-route",
        document.title,
        window.location.href
      );
      setBrowserHistoryBackup(1);

      window.addEventListener("popstate", closeQuickView);
    }

    // Here is the cleanup when this component unmounts
    return () => {
      if (mobile) {
        window.removeEventListener("popstate", closeQuickView);
        // If we left without using the back button, aka by using a button on the page, we need to clear out that fake history event
        if (window.history.state === "fake-route") {
          window.history.back();
        }
        setBrowserHistoryBackup(null);
      }
    };
  }, [toggleNow]);

  //get deafult conversations
  useEffect(() => {
    if (chats.length > 0) {
      getUserChats(1);
    }
  }, [chats]);
  const getUserChats = async (page) => {
    var result = await profile.tryGetExistingChats(page);
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
    //setReceivedMessage(result.data);
    setMessages(result.data);
  };
  // consoSle.log("plain line chats", chats);
  // Connect to SignalR
  useEffect(() => {
    console.log(
      "🚀 ~ file: Chat.jsx ~ line 107 ~ useEffect ~ connection",
      connection
    );
    //re invoke connection from chats
    startTimer();
  }, [userContext.user.UserId]);

  useEffect(() => {
    // console.log(
    //   "🚀 ~ file: Chat.jsx ~ line 117 ~ useEffect ~ countDownTimer",
    //   countDownTimer
    // );

    if (countDownTimer === 0) {
      waitAndRetryConnection();
    }
  }, [countDownTimer]);
  //wait timer to re initaite connection if not started by app.js
  const startTimer = async () => {
    // Set the date we're counting down to
    var countDownDate = new Date().getTime() + 10000;

    // Update the count down every 1 second
    var x = setInterval(function () {
      // Get today's date and time
      var now = new Date().getTime();

      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds

      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      setCountDownTimer(seconds);

      //cleanup
      if (distance < 0) {
        clearInterval(x);
        setCountDownTimer(0);
      }
    }, 1000);
  };

  const waitAndRetryConnection = async () => {
    if (!connection) {
      console.log("reinvoiking connection from use effect");
      InitiateConnection();
    }
  };

  //check if screen is mobile

  useEffect(() => {
    if (mobile) {
      setToggleToMobileRight(!toggleToMobileRight);
    }
  }, [toggleNow]);

  //hide launcher while in detail message view
  useEffect(() => {
    if (toggleToMobileRight) {
      setIsMobileChatTyping(true);
    } else {
      setIsMobileChatTyping(false);
    }

    return () => {
      setIsMobileChatTyping(false);
    };
  }, [toggleToMobileRight]);
  // Send Message to socket server
  useEffect(() => {
    if (sendMessage) {
      sendMessageToServer(sendMessage);
    }
  }, [sendMessage, connection]);

  const fetchSingleUser = async (followerId) => {
    var result = await profile.tryGetSpecificUser(followerId);
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
    console.log(chats);
    //setChats([result.data, ...chats]);
  };
  const handleSearchResult = async (selectedSearchResult) => {
    if (selectedSearchResult && selectedSearchResult.userId) {
      const oldChats = [...chats];

      setChats([selectedSearchResult, ...oldChats]);
    }
  };
  const handleStartNewChat = () => {
    searchInputRef?.current?.scrollIntoView({ behavior: "smooth" });
    searchInputRef?.current?.focus();
    console.log(
      "🚀 ~ file: Chat.jsx ~ line 166 ~ handleStartNewChat ~ searchInputRef?.current",
      searchInputRef
    );
  };
  ///SIGNALR
  ///  MOVED TO APP.JS FILE/////
  // const InitiateConnection = async () => {
  //   try {
  //     const connection = new HubConnectionBuilder()
  //       .withUrl("https://localhost:7204/chat", {
  //         accessTokenFactory: () => `${localStorage.getItem("token")}`,
  //       })
  //       .withAutomaticReconnect()
  //       .configureLogging(LogLevel.Information)
  //       .build();

  //     connection.on(
  //       "ReceiveMessage",
  //       (senderId, receiverId, message, createdAt) => {
  //         console.log(
  //           "🚀 ~ file: Chat.jsx ~ line 162 ~ InitiateConnection ~ senderId, receiverId, message, createdAt",
  //           senderId,
  //           receiverId,
  //           message,
  //           createdAt
  //         );
  //         // console.log("received message .... ", {
  //         //   senderId,
  //         //   receiverId,
  //         //   message,
  //         //   createdAt,
  //         // });
  //         //update chats if new incoming chat

  //         var newArray = chats.filter(function (el) {
  //           return el.userId === senderId || el.userId === userId;
  //         });
  //         if (newArray.length === 0) {
  //           RequestForChatHeadsRefresh();
  //         }

  //         setReceivedMessage({ senderId, receiverId, message, createdAt });

  //         setMessages((messages) => [
  //           ...messages,
  //           { senderId, receiverId, message, createdAt },
  //         ]);
  // //         console.log(
  // //           "🚀 ~ file: Chat.jsx ~ line 187 ~ InitiateConnection ~ messages",
  // //           messages
  // //         );
  //       }
  //     );
  //     connection.on("ReceiveUsers", (listOfUsers) => {
  //       console.log("users list refreshed", listOfUsers);
  //       setOnlineUsers(listOfUsers);
  //     });
  //     connection.on("ReceiveChatHeads", (chatHeads) => {
  //       console.log("chatheadsRefreshed", chatHeads);
  //       setChats(chatHeads);
  //     });

  //     connection.onclose((e) => {
  //       setConnection(null);
  //     });
  //     await connection.start();
  //     await connection.invoke("StartConnection");

  //     //save connection
  //     setConnection(connection);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  //send message
  const sendMessageToServer = async (sendMessageObj) => {
    console.log(
      "before reconnecting this is the connection",
      connection?.connection?.connectionId,
      connection
    );
    try {
      if (!connection) {
        console.log("reInvoiking connection from send message");
        showNotification({
          id: "save-data2",
          icon: <IconX size={16} />,
          title: "Network Error",
          message: "Trying to reconnect",
          loading: true,
          autoClose: true,
          disallowClose: false,
          style: { zIndex: "999999" },
        });
        await InitiateConnection();
        return;
      }
      if (!sendMessageObj) {
        return;
      }
      await connection.invoke("SendMessage", sendMessageObj);
      setSendMessage(null);
    } catch (e) {
      console.log(e);
    }
  };

  const checkOnlineStatus = (userId) => {
    // console.log(
    //   "🚀 ~ file: Chat.jsx ~ line 252 ~ checkOnlineStatus ~ userId",
    //   userId
    // );

    const online = onlineUsers.find((user) => {
      console.log(
        "🚀 ~ file: Chat.jsx ~ line 255 ~ checkOnlineStatus ~ onlineUsers",
        onlineUsers
      );
      return user === userId;
    });
    return online ? true : false;
  };
  //send requestChats fromServer

  // console.log("received message .... in the state", receivedMessage);
  // console.log(messages);
  return (
    <div className="Chat">
      {/* Left Side */}
      <div
        className={toggleToMobileRight ? "Left-side-chat2" : "Left-side-chat"}
      >
        <LogoSearch
          setSelectedItemCallBack={handleSearchResult}
          ref={searchInputRef}
        />

        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentChat(chat);
                  setToggleNow(!toggleNow);
                  !browserHistoryBackup && setBrowserHistoryBackup(1);
                }}
              >
                <Conversation
                  data={chat}
                  currentUser={userId}
                  online={checkOnlineStatus(chat.userId)}
                />
              </div>
            ))}

            {/* Floating start chat button */}
            <div
              className="floatingChatbtn showOnMobileOnly"
              onClick={() => {
                searchInputRef?.current?.focusOnSearch();

                // searchInputRef?.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <IconMessagePlus size={30} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div
        className={toggleToMobileRight ? "Right-side-chat2" : "Right-side-chat"}
      >
        {!mobile && (
          <div style={{ width: "20rem", marginLeft: "auto" }}>
            <NavIcons />
          </div>
        )}
        <ChatBox
          chat={currentChat}
          currentUser={userId}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
          messagesBackup={messages}
        />
      </div>
    </div>
  );
};

export default Chat;
