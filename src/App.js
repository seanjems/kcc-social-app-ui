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

  return (
    <AuthContext.Provider value={{ user, setUser, existingLogin }}>
      <MantineProvider
        withNormalizeCSS
        withGlobalStyles
        position="top-right"
        zIndex={2077}
      >
        <>
          <NotificationsProvider position="top-right" zIndex={2077}>
            <div className="App">
              <div className="blurs">
                <div className="blur" style={{ top: "-18%", right: "0" }}></div>
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
                  element={user ? <Chat /> : <Navigate to="../auth" replace />}
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
                  path="*"
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>There's nothing here!</p>
                    </main>
                  }
                />
                {/* <Route
                path={`/profile/${userName}`}
                element={
                  user ? (
                    <Profile setUser={setUser} />
                  ) : (
                    <Navigate to="../auth" />
                  )
                }
              /> */}
              </Routes>
            </div>
          </NotificationsProvider>
        </>
      </MantineProvider>
    </AuthContext.Provider>
  );
}

export default App;
