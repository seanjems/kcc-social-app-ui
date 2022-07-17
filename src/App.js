import "./App.css";
import Auth from "./pages/Auth/Auth";
import { Home } from "./pages/home/Home";
import Profile from "./pages/Profile/Profile";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  return (
    <div className="App">
      <div className="blurs">
        <div className="blur" style={{ top: "-18%", right: "0" }}></div>
        <div className="blur" style={{ top: "45%", left: "-8rem " }}></div>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="home" /> : <Navigate to="/auth" />
          }
        />

        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="../auth" />
            )
          }
        />

        <Route
          path="/auth"
          element={
            isLoggedIn ? (
              <Navigate to="../home" />
            ) : (
              <Auth setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              <Profile setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="../auth" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
