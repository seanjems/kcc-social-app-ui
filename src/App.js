import "./App.css";
import Auth from "./pages/Auth/Auth";
import { Home } from "./pages/home/Home";
import Profile from "./pages/Profile/Profile";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthContext from "./auth/context";

function App() {
  const [user, setUser] = useState(
    false
    //localStorage.getItem("isLoggedIn")
  );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
