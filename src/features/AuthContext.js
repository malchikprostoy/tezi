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
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { email, photo } = response.data.user;
      const role = determineRole(email);

      if (photo) {
        localStorage.setItem("userPhoto", photo);
      }

      localStorage.setItem("userRole", role);
      setUser({ ...response.data.user, role });
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
      navigate("/", { replace: true }); // ✅ Избегаем лишнего вызова
    }

    if (token && !user) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, [location.search]); // ✅ Убрали user из зависимостей

  const determineRole = (email) => {
    const username = email.split("@")[0];
    const isOnlyNumbers = /^[\d.]+$/.test(username);
    const hasLetters = /[a-zA-Z]/.test(username);
    const hasNumbers = /\d/.test(username);

    if (isOnlyNumbers) return "student";
    if (hasLetters && hasNumbers) return "teacher";
    return "unknown";
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      loginWithToken(token);
    } catch (error) {
      console.error("❌ Ошибка входа:", error);
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post("http://localhost:5000/api/register", {
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
    if (isFetching.current) return; // ⚠️ Предотвращает повторные вызовы
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
