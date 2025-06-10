const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const lessonRoutes = require("./routes/lessonRoutes");
const taskRoutes = require("./routes/taskRoutes");
const resultRoutes = require("./routes/resultRoutes");
const path = require("path");

dotenv.config({ path: "../.env.local" });

connectDB();

const app = express();

// Настройка сессий
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Инициализация Passport
app.use(passport.initialize());

// Passport-стратегия для Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.REACT_APP_API_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        const email = profile.emails[0].value;
        let role = "student"; // значение по умолчанию

        if (email.endsWith("@manas.edu.kg")) {
          const prefix = email.split("@")[0];
          if (/^\d+\.\d+$/.test(prefix)) {
            role = "student";
          } else if (/^[a-zA-Z]+$/.test(prefix)) {
            role = "teacher";
          }
        }

        if (user) {
          user.photo = profile._json.picture || "";
          await user.save();
        } else {
          user = new User({
            googleId: profile.id,
            email,
            name: profile.displayName,
            photo: profile._json.picture || "",
            isVerified: profile._json.email_verified,
            role,
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Сериализация и десериализация пользователя для сессии
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Роут для авторизации через Google
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Роут для обработки коллбэка от Google после авторизации
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  }
);

// Статическая папка для загрузок
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://tezi-frontend.onrender.com"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение маршрутов
app.use("/api", require("./routes/auth"));
app.use("/api/lessons", lessonRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Tezi Backend is running ✅");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
