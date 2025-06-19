const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { sequelize } = require("./models");
const { PORT, ALLOWED_ORIGIN } = require("./config/constants");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
app.use(helmet());

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
  })
);
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// Error handler should be last
app.use(errorMiddleware);

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Models synced with the database");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Optional: shut down server on critical failure
  }

  console.log(`🚀 Server running on port ${PORT}`);
});
