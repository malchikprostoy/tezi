import React, { useState, useEffect } from "react";
import { IconButton, Tooltip, Fade } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTranslation } from "react-i18next";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const handleScroll = () => {
    setVisible(window.scrollY > 100); // Показывать кнопку, если прокрутка больше 100px
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Fade in={visible}>
      <Tooltip title={t("Up")}>
        <IconButton
          onClick={handleScrollTop}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            bgcolor: "#8B0000",
            color: "#fff",
            "&:hover": { bgcolor: "#a30000" },
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
      </Tooltip>
    </Fade>
  );
};

export default ScrollToTopButton;
