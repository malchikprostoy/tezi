import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import {
  Alert,
  Box,
  IconButton,
  InputAdornment,
  styled,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/AuthContext";

const Register = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (photo) formData.append("photo", photo);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Сохранение токена в localStorage
      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        const profileResponse = await axios.get(
          "http://localhost:5000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Обновление состояния пользователя
        setUser(profileResponse.data);
      }

      // Перенаправление на домашнюю страницу
      navigate("/");
    } catch (error) {
      console.error(
        "Error registering:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const inputStyles = {
    "&:before": {
      borderBottomColor: "black",
      transition: "border-color 0.3s ease",
    },
    "&:after": {
      borderBottomColor: "black",
      transition: "border-color 0.3s ease",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: "black",
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
    transition: "color 0.3s ease",
    "&.Mui-focused": {
      color: "black",
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
          onSubmit={handleRegister}
        >
          <Typography
            style={{ color: "black", fontFamily: "Poppins", fontSize: 30 }}
          >
            Register
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
            label="Name"
            margin="normal"
            InputProps={{ sx: inputStyles }}
            InputLabelProps={{ sx: labelStyles, shrink: true }}
            sx={{ width: "300px" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            required
            id="standard-required"
            variant="standard"
            label="Email"
            margin="normal"
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
            autoComplete="off"
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
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            style={{
              fontFamily: "Poppins",
              display: "flex",
              marginTop: 20,
              color: "black",
              borderColor: "black",
            }}
          >
            Upload photo
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </Button>
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
              marginTop: 20,
              background: "transparent",
            }}
          >
            Register
          </Button>
          <Typography
            m={2}
            style={{
              color: "black",
              fontFamily: "Poppins",
            }}
          >
            Already have an account?
            <Link
              href="/login"
              underline="hover"
              style={{
                color: "black",
                fontFamily: "Poppins",
              }}
            >
              {" Login"}
            </Link>
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default Register;
