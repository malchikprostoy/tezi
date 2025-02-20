import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import {
  Alert,
  Box,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../features/AuthContext";
import "./Form.scss";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const { login, loginWithToken } = useAuth();
  const navigate = useNavigate(); // Use this to navigate after login
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // Add state to hold error messages

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      loginWithToken(token);
      navigate("/"); // Перенаправляем на главную
    }
  }, [location, loginWithToken, navigate]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      const username = email.split("@")[0];
      const isStudent = /^[\d.]+$/.test(username); // Только цифры и точки
      const role = isStudent ? "student" : "teacher";

      navigate("/"); // Redirect to homepage or protected route after login
    } catch (error) {
      console.error(error.response?.data);
      setError(error.response?.data?.message || "Error logging in");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const inputStyles = {
    "&:before": {
      borderBottomColor: "black", // normal state
      transition: "border-color 0.3s ease",
    },
    "&:after": {
      borderBottomColor: "black", // focused state
      transition: "border-color 0.3s ease",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: "black", // hover state
      transition: "border-color 0.3s ease",
    },
    input: {
      color: "black",
      transition: "color 0.3s ease",

      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 1000px transparent inset",
        WebkitTextFillColor: "black",
        transition: "background-color 5000s ease-in-out 0s",
      },
    },
  };

  const labelStyles = {
    color: "black",
    "&.Mui-focused": {
      color: "black", // focused label color
      transition: "color 0.3s ease",
    },
  };

  return (
    <div className="form-log">
      <div className="wrapper">
        <Box
          component="form"
          autoComplete="off"
          noValidate
          onSubmit={handleLogin}
        >
          <Typography
            style={{ color: "black", fontFamily: "Poppins", fontSize: 30 }}
          >
            Login
          </Typography>
          {error && (
            <Alert
              severity="error"
              color="error"
              style={{ marginBottom: "1rem", background: "transparent" }}
            >
              {error}
            </Alert>
          )}
          <TextField
            required
            id="standard-required"
            variant="standard"
            margin="normal"
            label="Email"
            autoComplete="on"
            InputProps={{ sx: inputStyles }}
            InputLabelProps={{ sx: labelStyles, shrink: true }}
            sx={{ width: "300px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            label="Password"
            id="standard-password"
            variant="standard"
            margin="normal"
            type={showPassword ? "text" : "password"}
            InputProps={{
              sx: inputStyles,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    style={{ background: "transparent" }}
                  >
                    {showPassword ? (
                      <Visibility
                        style={{
                          color: "black",
                        }}
                      />
                    ) : (
                      <VisibilityOff
                        style={{
                          color: "black",
                        }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ sx: labelStyles, shrink: true }}
            sx={{ width: "300px" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  color: "black",
                  "&.Mui-checked": {
                    color: "black",
                  },
                }}
                defaultChecked
              />
            }
            label="Remember me"
            style={{ color: "black", fontFamily: "Poppins" }}
          />
          <Link
            href="#"
            underline="hover"
            style={{ color: "black", fontFamily: "Poppins" }}
          >
            {"Forgot password?"}
          </Link>
          <Button
            variant="outlined"
            fullWidth
            type="submit"
            style={{
              color: "black",
              border: "1px solid #000",
              borderRadius: "5px",
              fontFamily: "Poppins",
              fontSize: 16,
              background: "transparent",
            }}
          >
            Login
          </Button>
          <Typography m={2} style={{ color: "black", fontFamily: "Poppins" }}>
            Don't have an account?
            <Link href="/register" underline="hover" color="inherit">
              {" Register"}
            </Link>
          </Typography>
          <Button variant="outlined" fullWidth onClick={handleGoogleLogin}>
            Войти через Google
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Login;
