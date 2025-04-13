import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        backgroundColor: "#8B0000",
        boxShadow: "0px -4px 8px rgba(0, 0, 0, 0.4)",
        py: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="white">
        © {currentYear}{" "}
        {t("KYRGYZ-TURKISH MANAS UNIVERSITY") || <CircularProgress />}
      </Typography>
    </Box>
  );
};

export default Footer;
