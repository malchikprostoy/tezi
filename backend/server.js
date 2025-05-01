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
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // ✅ Обновляем фото каждый раз при входе
          user.photo = profile._json.picture || "";
          await user.save();
        } else {
          // ✅ Создаем нового пользователя
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
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
    // Генерируем JWT токен после успешной авторизации через Google
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Успешная авторизация, перенаправляем на главную страницу
    res.redirect(`http://localhost:3000/login?token=${token}`);
  }
);

// Статическая папка для загрузок
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
