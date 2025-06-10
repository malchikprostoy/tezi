import React from "react";
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";

const AdminLayout = ({ children }) => {
  return (
    <>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#8B0000" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          {/* Можно добавить кнопку Logout, имя пользователя и т.д. */}
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container
        sx={{
          mt: 4,
          mb: 4,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: "auto",
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #ddd",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Kyrgyz Turkish Manas University — Admin
          Panel
        </Typography>
      </Box>
    </>
  );
};

export default AdminLayout;
