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
    getFollowing();
  }, []);

  //get deafult conversations
  const getFollowing = async () => {
    var result = await profile.tryGetFollowing();
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

    setChats(result.data);
  };

  // Connect to SignalR
  useEffect(() => {
    InitiateConnection();
  }, [userContext.user.UserId]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage) {
      sendMessageToServer(sendMessage);
    }
  }, [sendMessage, connection]);

  // Get the message from socket server
  useEffect(() => {
    // socket.current.on("recieve-message", (data) => {
    //   console.log(data);
    //   setReceivedMessage(data);
    // });
  }, []);

  const checkOnlineStatus = (chat) => {
    // const chatMember = chat.members.find((member) => member !== user._id);
    // const online = onlineUsers.find((user) => user.userId === chatMember);
    // return online ? true : false;
  };
  const fetchSingleUser = async (userId) => {
    var result = await profile.tryGetSpecificUser(userId);
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

    setChats([...chats, result.data]);
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
          setReceivedMessage({ senderId, receiverId, message, createdAt });
          console.log("received message .... in the state", receivedMessage);

          setMessages((messages) => [
            ...messages,
            { senderId, receiverId, message, createdAt },
          ]);
          console.log(messages, "this is the original backup");
        }
      );
      connection.on("ReceiveUsers", (listOfUsers) => {
        console.log("users list refreshed", listOfUsers);
        setOnlineUsers(listOfUsers);
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
    //console.log("before reconnecting", connection?.connection?.connectionId);
    try {
      if (!connection.connection.connectionId) {
        console.log("reInvoiking connection");
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
