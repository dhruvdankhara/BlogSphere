import { Outlet } from "react-router-dom";
import { Header } from "./components";
import { useEffect, useState } from "react";
import { getLogedInUser } from "./api";
import { useDispatch } from "react-redux";
import { login, logout } from "./features/auth/authSlice";
import { Loader } from "./components";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    getLogedInUser()
      .then((response) => {
        if (response.success) {
          dispatch(login(response.data));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => {
        dispatch(logout());
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return !loading ? (
    <>
      <div className="flex min-h-screen flex-col bg-slate-100 pt-5">
        <Header />
        <Outlet />
      </div>
    </>
  ) : (
    <Loader />
  );
}

export default App;
