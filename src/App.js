import "./App.css";
import Auth from "./pages/Auth/Auth";
import { Home } from "./pages/home/Home";
import Profile from "./pages/Profile/Profile";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthContext from "./auth/context";

import jwtDecode from "jwt-decode";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

function App() {
  const [user, setUser] = useState(null);

  const existingLogin = () => {
    var token = localStorage.getItem("token");
    const user = token ? jwtDecode(token) : null;

    const cleanItem = user ? JSON.parse(user.user) : null;
    setUser(cleanItem);
  };
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
                path="/"
                element={
                  user ? <Navigate to="home" /> : <Navigate to="/auth" />
                }
              />

              <Route
                path="/home"
                element={
                  user ? <Home setUser={setUser} /> : <Navigate to="../auth" />
                }
              />

              <Route
                path="/auth"
                element={
                  user ? <Navigate to="../home" /> : <Auth setUser={setUser} />
                }
              />

              <Route
                path="/profile"
                element={
                  user ? (
                    <Profile setUser={setUser} />
                  ) : (
                    <Navigate to="../auth" />
                  )
                }
              />
            </Routes>
          </div>
        </NotificationsProvider>
      </MantineProvider>
    </AuthContext.Provider>
  );
}

export default App;
