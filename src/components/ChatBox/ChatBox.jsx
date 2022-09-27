import React, { Fragment, useContext, useEffect, useState } from "react";
import { useRef } from "react";
// import { addMessage, getMessages } from "../../api/MessageRequests";
// import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import ChatContext from "../../auth/ChatContext";

const ChatBox = ({
  chat,
  currentUser,
  setSendMessage,
  receivedMessage,
  messagesBackup,
}) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };
  const { setIsMobileChatTyping } = useContext(ChatContext);
  // fetching conversation info

  // //send message
  // const GetConversationId = async (SenderId, ReceiverId) => {
  //   try {
  //     await connection.invoke("GetConversationId", {
  //       SenderId: SenderId,
  //       ReceiverId: ReceiverId,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // fetch messages
  useEffect(() => {
    setMessages([]);
    // console.log("in here original messages", messagesBackup);
    const messagesDeep = JSON.parse(JSON.stringify(messagesBackup));
    if (messagesDeep) {
      var newFilter = [];
      messagesDeep.map((newMessag) => {
        if (
          newMessag !== null &&
          ((newMessag.senderId === chat?.userId &&
            newMessag.receiverId === currentUser) ||
            (newMessag.receiverId === chat?.userId &&
              newMessag.senderId === currentUser))
        ) {
          newFilter = [...newFilter, newMessag];
          // console.log("newFilter here ......", newFilter);
        }
      });
      setMessages(newFilter);
    }
  }, [chat]);

  // Always scroll to last Message

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();

    const receiverId = chat.userId;
    if (!newMessage || !receiverId) return;
    console.log("sending this to server user, msg", receiverId, newMessage);
    // send message to signalR
    setSendMessage({ MessageText: newMessage, ReceiverId: receiverId });
    setNewMessage("");
  };

  // Receive Message from parent component
  useEffect(() => {
    //console.log("Message Arrived: ", receivedMessage);
    if (
      receivedMessage !== null &&
      ((receivedMessage.senderId === chat?.userId &&
        receivedMessage.receiverId === currentUser) ||
        (receivedMessage.receiverId === chat?.userId &&
          receivedMessage.senderId === currentUser))
    ) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  const scroll = useRef();
  const imageRef = useRef();

  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }
  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-header */}
            <div className="chat-header">
              <div className="follower">
                <div>
                  <img
                    src={chat.profilePicUrl}
                    alt="Profile"
                    className="followerImage"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="name fw-bold" style={{ fontSize: "0.9rem" }}>
                    <span>
                      {chat?.firstName} {chat?.lastName}
                    </span>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #ececec",
                  marginTop: "20px",
                }}
              />
            </div>
            {/* chat-body */}
            <div className="chat-body">
              {messages?.map((message, idx) => (
                <Fragment key={idx}>
                  <div
                    ref={scroll}
                    className={
                      message.senderId === currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.message}</span>{" "}
                    <span>
                      {format(
                        convertUTCDateToLocalDate(new Date(message.createdAt))
                      )}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
            {/* chat-sender */}
            <div className="chat-sender">
              <div
                onClick={() => imageRef.current.click()}
                style={{ display: "none" }}
              >
                +
              </div>
              <div
                className="w-100"
                onFocus={() => setIsMobileChatTyping(true)}
                onBlur={() => setIsMobileChatTyping(false)}
              >
                <InputEmoji value={newMessage} onChange={handleChange} />
              </div>

              <div className="send-button button" onClick={handleSend}>
                Send
              </div>
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
              />
            </div>{" "}
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
