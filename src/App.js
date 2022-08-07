import "./App.css";
import Auth from "./pages/Auth/Auth";
import { Home } from "./pages/home/Home";
import Profile from "./pages/Profile/Profile";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthContext from "./auth/context";
import jwtDecode from "jwt-decode";

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
      <div className="App">
        <div className="blurs">
          <div className="blur" style={{ top: "-18%", right: "0" }}></div>
          <div className="blur" style={{ top: "45%", left: "-8rem " }}></div>
        </div>

        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="home" /> : <Navigate to="/auth" />}
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
              user ? <Profile setUser={setUser} /> : <Navigate to="../auth" />
            }
          />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
