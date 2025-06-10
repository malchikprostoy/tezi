import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isFetching = useRef(false);

  const fetchUserProfile = useCallback(async (token) => {
    if (!token || isFetching.current) return;
    isFetching.current = true;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { email, photo } = response.data.user;
      const role = determineRole(email);

      if (photo) {
        localStorage.setItem("userPhoto", photo);
      }

      if (role) {
        localStorage.setItem("userRole", role);
      }

      setUser(response.data.user);
    } catch (error) {
      console.error("❌ Ошибка при получении профиля:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(location.search).get("token");
    let token = localStorage.getItem("token");

    if (tokenFromUrl && !token) {
      localStorage.setItem("token", tokenFromUrl);
      token = tokenFromUrl;
      navigate("/", { replace: true });
    }

    if (token && !user) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, [location.search]);

  const determineRole = (email) => {
    const prefix = email.split("@")[0];
    const digitCount = (prefix.match(/\d/g) || []).length;

    // Если цифр больше 4 — студент, иначе — преподаватель
    return digitCount > 4 ? "student" : "teacher";
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        {
          email,
          password,
        }
      );

      const { token } = response.data;
      localStorage.setItem("token", token);
      loginWithToken(token);
    } catch (error) {
      console.error("❌ Ошибка входа:", error);
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, {
        name,
        email,
        password,
      });
      await login(email, password);
    } catch (error) {
      console.error("❌ Ошибка регистрации:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userPhoto");
    setUser(null);
  };

  const loginWithToken = (token) => {
    if (isFetching.current) return;
    localStorage.setItem("token", token);
    fetchUserProfile(token);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, loginWithToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
