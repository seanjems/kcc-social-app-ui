import React, { useContext, useEffect, useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import LogoSearch from "../../components/logoSearch/LogoSearch";
import NavIcons from "../../components/NavIcons/NavIcons";
import RightSide from "../../components/RightSide/RightSide";
import AuthContext from "../../auth/context";

import "./Chat.css";
// import { useEffect } from "react";
// import { userChats } from "../../api/ChatRequests";
// import { useDispatch, useSelector } from "react-redux";
// import { io } from "socket.io-client";

import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import profile from "../../api/profile";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";

const Chat = () => {
  // const dispatch = useDispatch();
  // const socket = useRef();
  // const { user } = useSelector((state) => state.authReducer.authData);

  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const userContext = useContext(AuthContext);
  const userId = userContext.user.UserId;
  // Get the chat in chat section
  useEffect(() => {
    if (connection?.connection?.connectionId) {
      RequestForChatHeadsRefresh();
    }
  }, [connection]);

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
    setReceivedMessage(result.data);
    setMessages(result.data);
  };
  // consoSle.log("plain line chats", chats);
  // Connect to SignalR
  useEffect(() => {
    console.log("reinvoiking connection from use effect");
    InitiateConnection();
  }, [userContext.user.UserId]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage) {
      sendMessageToServer(sendMessage);
    }
  }, [sendMessage, connection]);

  const checkOnlineStatus = (chat) => {
    // const chatMember = chat.members.find((member) => member !== user._id);
    // const online = onlineUsers.find((user) => user.userId === chatMember);
    // return online ? true : false;
  };
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

  ///SIGNALR
  const InitiateConnection = async () => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7204/chat", {
          accessTokenFactory: () => `${localStorage.getItem("token")}`,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connection.on(
        "ReceiveMessage",
        (senderId, receiverId, message, createdAt) => {
          console.log("received message .... ", {
            senderId,
            receiverId,
            message,
            createdAt,
          });
          //update chats if new incoming chat

          var newArray = chats.filter(function (el) {
            return el.userId === senderId || el.userId === userId;
          });
          if (newArray.length === 0) {
            RequestForChatHeadsRefresh();
          }

          setReceivedMessage({ senderId, receiverId, message, createdAt });

          setMessages((messages) => [
            ...messages,
            { senderId, receiverId, message, createdAt },
          ]);
          // console.log(chats, "this is the chat object");
        }
      );
      connection.on("ReceiveUsers", (listOfUsers) => {
        console.log("users list refreshed", listOfUsers);
        setOnlineUsers(listOfUsers);
      });
      connection.on("ReceiveChatHeads", (chatHeads) => {
        console.log("chatheadsRefreshed", chatHeads);
        setChats(chatHeads);
      });

      connection.onclose((e) => {
        setConnection(null);
      });
      await connection.start();
      await connection.invoke("StartConnection");

      //save connection
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

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

  //send requestChats fromServer
  const RequestForChatHeadsRefresh = async () => {
    //console.log("before reconnecting", connection?.connection?.connectionId);
    try {
      if (!connection) {
        // console.log("reInvoiking connection");
        // await InitiateConnection();
        return;
      }

      await connection.invoke("RefreshChatHeads");
    } catch (e) {
      console.log(e);
    }
  };
  // console.log("received message .... in the state", receivedMessage);
  // console.log(messages);
  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
                <Conversation
                  data={chat}
                  currentUser={userId}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons />
        </div>
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
