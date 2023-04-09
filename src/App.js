import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
import {
  Home,
  Posts,
  Auth,
  Category,
  Comments,
  Dashboard,
  Tags,
  PostDetail,
} from "./pages";
import Navbar from "./components/navbar/Navbar";

function App() {
  const user = JSON.parse(localStorage.getItem("profile"));
  return (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/" replace />}
            />
            <Route
              path="/all_posts/:id"
              element={user ? <PostDetail /> : <Navigate to="/" replace />}
            />
            <Route
              path="/all_posts"
              element={user ? <Posts /> : <Navigate to="/" replace />}
            />
            <Route
              path="/auth"
              element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
            />
            <Route
              path="/category"
              element={user ? <Category /> : <Navigate to="/" replace />}
            />
            <Route
              path="/comments"
              element={user ? <Comments /> : <Navigate to="/" replace />}
            />
            <Route
              path="/tags"
              element={user ? <Tags /> : <Navigate to="/" replace />}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
