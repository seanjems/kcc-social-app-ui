import "./App.css";
import Auth from "./pages/Auth/Auth";
import Chat from "./pages/Chat/Chat";
import { Home } from "./pages/home/Home";
import Profile from "./pages/Profile/Profile";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthContext from "./auth/context";

import jwtDecode from "jwt-decode";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import "bootstrap/dist/css/bootstrap.min.css";
import NavIcons from "./components/NavIcons/NavIcons";
import { MobileSearch } from "./pages/MobileSearch/MobileSearch";
import { Detector } from "react-detect-offline";
import ChatContext from "./auth/ChatContext";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import { HarshTagTimeline } from "./pages/HarshTags/HarshTagTimeline";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { requestForToken } from "./firebase";
import PrivacyPolicy from "./pages/StaticPages/PrivacyPolicy";
import TermsOfService from "./pages/StaticPages/TermsOfService";
import BlogPostPage from "./pages/BlogPostEditor/BlogPostPage";
import BlogTable from "./components/BlogEditor/BlogsTable";
import BlogArticlesTablePage from "./pages/BlogPostEditor/BlogArticlesTablePage";
import BlogPostForm from "./components/BlogEditor/BlogEditoUpdate";
function App() {
  //redirect after login to intended page
  let location = useLocation();

  const [from, setFrom] = useState(
    location?.key === "default" ? location.pathname : "../home"
  );

  //console.log("locationa and from value", location, from);
  const existingLogin = () => {
    var token = localStorage.getItem("token");
    if (!token) return;
    // console.log(token);

    const user = token ? jwtDecode(token) : null;

    var tokenExp = user?.exp;
    // console.log(
    //   "times today",
    //   parseInt(Date.now().toString().substring(0, 10)),
    //   tokenExp
    // );
    if (parseInt(Date.now().toString().substring(0, 10)) >= tokenExp) {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }
    const cleanItem = user ? JSON.parse(user.user) : null;
    setUser(cleanItem);
  };
  const [user, setUser] = useState(null);
  useEffect(() => {
    existingLogin();
  }, []);
  useEffect(() => {
    requestForToken();
  }, []);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!connection && user) {
        InitiateConnection();
      }
    }, 3000);
  }, [user]);
  const mobile = window.innerWidth <= 768 ? true : false;

  // SIGNAL R CONNECTION
  // SIGNAL R CONNECTION
  // SIGNAL R CONNECTION
  // SIGNAL R CONNECTION
  // SIGNAL R CONNECTION
  // SIGNAL R CONNECTION
  // SIGNAL R CONNECTION
  // SIGNAL R CONNECTION
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [messageBadge, setMessageBadge] = useState(0);
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [internetOff, setInternetOff] = useState(false);
  const userId = user?.UserId;
  const [isMobileChatTyping, setIsMobileChatTyping] = useState(false);
  ///SIGNALR

  //detect network reconnections

  // const handleInternetReconnection = async (online) => {
  //   console.log(
  //     "🚀 ~ file: App.js ~ line 85 ~ handleInternetReconnection ~ online",
  //     online
  //   );
  //   console.log(
  //     "🚀 ~ file: App.js ~ line 92 ~ delayDebounceFn ~ internetOff",
  //     internetOff
  //   );

  //   const delayDebounceFn = setTimeout(() => {
  //     if (online && user && !connection && internetOff) {
  //       !connection && console.log("re Invoiking connection to  chat");
  //       console.log(
  //         "🚀 ~ file: App.js ~ line 87 ~ delayDebounceFn ~ connection",
  //         connection
  //       );
  //       //!connection && InitiateConnection();
  //     }
  //   }, 15000);
  // };

  //

  // useEffect(
  //   (receivedMessage) => {
  //     if (receivedMessage) {
  //       //update chatsortorder
  //       const originalValues = JSON.parse(JSON.stringify(receivedMessage));
  //       console.log("chat heads BEFORE mods", chats);
  //       chats.map((user) => {
  //         if (
  //           user.userId === originalValues.senderId ||
  //           user.userId === originalValues.receiverId
  //         ) {
  //           console.log("we have got one");
  //           return (user["createdAt"] = originalValues.createdAt);
  //         }
  //       });
  //       console.log("chat heads after mods", chats);
  //     }
  //   },
  //   [receivedMessage]
  // );
  // Get the chat in chat section
  useEffect(() => {
    if (connection?.connection?.connectionId) {
      RequestForChatHeadsRefresh();
    }
  }, [connection]);
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
  const InitiateConnection = async () => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(`${process.env.REACT_APP_PUBLIC_API_URL}/chat`, {
          accessTokenFactory: () => `${localStorage.getItem("token")}`,
        })
        //.withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connection.on(
        "ReceiveMessage",
        (senderId, receiverId, message, createdAt) => {
          console.log(
            "🚀 ~ file: Chat.jsx ~ line 162 ~ InitiateConnection ~ senderId, receiverId, message, createdAt",
            senderId,
            receiverId,
            message,
            createdAt
          );
          // console.log("received message .... ", {
          //   senderId,
          //   receiverId,
          //   message,
          //   createdAt,
          // });
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
          if (senderId !== user?.UserId) {
            setMessageBadge((value) => value + 1);
          }

          // "🚀 ~ file: Chat.jsx ~ line 187 ~ InitiateConnection ~ messages",
          // messages
          // );
        }
      );
      connection.on("ReceiveUsers", (listOfUsers) => {
        console.log("users online list refreshed", listOfUsers);
        setOnlineUsers(listOfUsers);
      });
      connection.on("ReceiveChatHeads", (chatHeads) => {
        console.log("chatheadsRefreshed", chatHeads);
        setChats(chatHeads);
      });

      connection.onclose((e) => {
        setConnection(null);
        setInternetOff(true);
      });
      await connection.start();
      await connection.invoke("StartConnection");

      //save connection
      setConnection(connection);
      setInternetOff(false);
    } catch (e) {
      console.log(e);
    }
  };

  /////////////////////////////////////////////
  /////////////////////////////////////////////
  /////////////////////////////////////////////
  /////////////////////////////////////////////
  //////THEME THEME
  //////THEME THEME
  //////THEME THEME
  //////THEME THEME
  // Get the root element
  var rootCssVariables = document.querySelector(":root");

  // // Create a function for getting a variable value
  // function myFunction_get() {
  //   // Get the styles (properties and values) for the root
  //   var rs = getComputedStyle(r);
  //   // Alert the value of the --blue variable
  //   alert("The value of --blue is: " + rs.getPropertyValue('--blue'));
  // }

  // Create a function for setting a variable value
  function myFunction_set() {
    // Set the value of variable --blue to another value (in this case "lightblue")
    rootCssVariables.style.setProperty("--blue", "lightblue");
  }

  return (
    <AuthContext.Provider value={{ user, setUser, existingLogin }}>
      <ChatContext.Provider
        value={{
          connection,
          messages,
          setMessages,
          onlineUsers,
          receivedMessage,
          InitiateConnection,
          RequestForChatHeadsRefresh,
          setChats,
          chats,
          messageBadge,
          setMessageBadge,
          setIsMobileChatTyping,
        }}
      >
        <MantineProvider
          withNormalizeCSS
          withGlobalStyles
          position="top-right"
          zIndex={2077}
        >
          <>
            {/* <Detector
              render={({ online }) => {
                handleInternetReconnection(online);
                return "";
              }}
            /> */}
            <GoogleOAuthProvider clientId="308096063661-b24pphi7teq8b1kg5u6kpsbc9kfn5kfh.apps.googleusercontent.com">
              <NotificationsProvider position="top-right" zIndex={2077}>
                <div className={mobile ? "mainAppSections" : ""}>
                  {/* <div>Main App Section</div>
                <div>Mobile Launcher Section</div> */}
                  {/* main appsection */}
                  <div
                    className="App container 
                  container container-fluid container-lg container-md container-sm container-xl container-xxl"
                    style={isMobileChatTyping ? {} : { marginBottom: "64px" }}
                  >
                    <div className="blurs">
                      <div
                        className="blur"
                        style={{ top: "-18%", right: "0" }}
                      ></div>
                      <div
                        className="blur"
                        style={{ top: "45%", left: "-8rem " }}
                      ></div>
                    </div>

                    <Routes>
                      <Route
                        path="/auth"
                        element={
                          user ? (
                            <Navigate to={from} replace />
                          ) : (
                            <Auth setUser={setUser} />
                          )
                        }
                      />
                      <Route
                        path="/trending/:tag"
                        element={
                          user ? (
                            <HarshTagTimeline setUser={setUser} replace />
                          ) : (
                            <Navigate to="../auth" />
                          )
                        }
                      />
                      <Route
                        path="/profile/:editProfile"
                        element={
                          user ? (
                            <Profile setUser={setUser} user={user} />
                          ) : (
                            <Navigate to="../auth" replace />
                          )
                        }
                      />
                      <Route
                        exact
                        path="/termsofservice"
                        element={<TermsOfService />}
                      />
                      <Route
                        exact
                        path="/privacypolicy"
                        element={<PrivacyPolicy />}
                      />
                      <Route
                        path="/profile"
                        element={
                          user ? (
                            <Profile setUser={setUser} user={user} />
                          ) : (
                            <Navigate to="../auth" replace />
                          )
                        }
                      />
                      <Route
                        path="/chat"
                        element={
                          user ? <Chat /> : <Navigate to="../auth" replace />
                        }
                      />
                      <Route
                        path="/"
                        element={
                          user ? (
                            <Navigate to="home" replace />
                          ) : (
                            <Navigate to="/auth" />
                          )
                        }
                      />

                      <Route
                        path="/home"
                        element={
                          user ? (
                            <Home setUser={setUser} />
                          ) : (
                            <Navigate to="../auth" replace />
                          )
                        }
                      />
                      <Route
                        path="/article"
                        exact
                        element={
                          user ? (
                            <BlogArticlesTablePage
                              setUser={setUser}
                              user={user}
                            />
                          ) : (
                            <Navigate to="../auth" replace />
                          )
                        }
                      />
                      <Route
                        path="/article/create"
                        element={
                          user ? (
                            <BlogPostPage setUser={setUser} user={user} />
                          ) : (
                            <Navigate to="../auth" replace />
                          )
                        }
                      />
                      <Route
                        path="/article/edit"
                        element={
                          user ? (
                            <BlogPostForm setUser={setUser} user={user} />
                          ) : (
                            <Navigate to="../auth" replace />
                          )
                        }
                      />
                      <Route
                        path="/search"
                        element={
                          user ? (
                            <MobileSearch />
                          ) : (
                            <Navigate to="../auth" replace />
                          )
                        }
                      />

                      <Route
                        path="/post/:postId"
                        element={
                          user ? (
                            <Home setUser={setUser} />
                          ) : (
                            <Navigate to="../auth" />
                          )
                        }
                      />

                      <Route
                        path="/resetpassword/:resettoken"
                        element={<ResetPassword />}
                      />
                      <Route
                        path="/:userName"
                        element={user ? <Profile /> : <Navigate to="../auth" />}
                      />
                      <Route
                        path="*"
                        element={
                          <main style={{ padding: "1rem" }}>
                            <p>There's nothing here!</p>
                          </main>
                        }
                      />
                    </Routes>

                    {/* <Routes>
                    <Route
                      path="/auth"
                      element={
                        user ? (
                          <Navigate to={from} replace />
                        ) : (
                          <Auth setUser={setUser} />
                        )
                      }
                    />

                    <Route
                      path="/profile/:userName"
                      element={
                        user ? (
                          <Profile setUser={setUser} user={user} />
                        ) : (
                          <Navigate to="../auth" replace />
                        )
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        user ? <Chat /> : <Navigate to="../auth" replace />
                      }
                    />
                    <Route
                      path="/home"
                      element={
                        user ? (
                          <Home setUser={setUser} />
                        ) : (
                          <Navigate to="../auth" replace />
                        )
                      }
                    />

                    <Route
                      path="/search"
                      element={
                        user ? (
                          <MobileSearch />
                        ) : (
                          <Navigate to="../auth" replace />
                        )
                      }
                    />

                    <Route
                      path="/trending/:tag"
                      element={
                        user ? (
                          <HarshTagTimeline setUser={setUser} replace />
                        ) : (
                          <Navigate to="../auth" />
                        )
                      }
                    />

                    <Route
                      path="/post/:postId"
                      element={
                        user ? (
                          <Home setUser={setUser} />
                        ) : (
                          <Navigate to="../auth" />
                        )
                      }
                    />

                    <Route
                      path="/resetpassword/:resettoken"
                      element={<ResetPassword />}
                    />

                    <Route
                      path="*"
                      element={
                        <main style={{ padding: "1rem" }}>
                          <p>There's nothing here!</p>
                        </main>
                      }
                    />
                  </Routes> */}
                  </div>

                  {/* Mobile Launcher */}
                  {mobile && user && !isMobileChatTyping && (
                    <div>
                      <NavIcons
                        className="mobileLauncher"
                        isLauncherBar={true}
                      />
                    </div>
                  )}
                </div>
              </NotificationsProvider>
            </GoogleOAuthProvider>
          </>
        </MantineProvider>
      </ChatContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
