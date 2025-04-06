import React, { useState } from "react";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import {
  Alert,
  Box,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./Form.scss";

const Verific = () => {
  const location = useLocation();
  const email = location.state?.email || "No email provided"; // Pre-filled email from registration (if available)
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/verify-email",
        {
          email,
          verificationCode,
        }
      );

      // Предположим, что сервер возвращает токен
      if (response.data.token) {
        // Сохраните токен в localStorage
        localStorage.setItem("token", response.data.token);
        toast.success("Verification successful!");
        navigate("/"); // Перенаправление на страницу профиля или другую часть приложения
      } else {
        toast.error("Verification failed: No token received");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/resend-code",
        { email }
      );
      toast.success(response.data.message); // Replace with a success message component
    } catch (error) {
      toast.error("Error resending the code"); // Replace with an error message component
    }
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
          onSubmit={handleVerification}
        >
          <Typography
            style={{ color: "black", fontFamily: "Poppins", fontSize: 20 }}
          >
            A verification code has been sent to your email
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
            label="Verification Code"
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
                    style={{ background: "transparent", color: "black" }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ sx: labelStyles, shrink: true }}
            sx={{ width: "300px" }}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
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
            {loading ? <CircularProgress size={24} /> : "Verify"}
          </Button>

          <Typography m={2} style={{ color: "black", fontFamily: "Poppins" }}>
            Did you not receive the code?
            <Link
              href="#"
              underline="hover"
              color="inherit"
              onClick={handleResendCode}
            >
              {" Get it again"}
            </Link>
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default Verific;
