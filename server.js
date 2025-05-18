require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const sequelize = require("./src/config/db.config");
const userRoutes = require("./src/routes/user.routes.js");
const rolesRoutes = require("./src/routes/roles.routes.js");
const parishRoutes = require("./src/routes/parish.routes.js");
const deaneryRoutes = require("./src/routes/deanery.routes.js");
const eventRoutes = require("./src/routes/event.route.js");
const executiveRoutes = require("./src/routes/executive.route.js");
const delegateRoutes = require("./src/routes/delegate.route.js");
const aydRoutes = require("./src/routes/ayd.routes.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/role", rolesRoutes);
app.use("/api/v1/deanery", deaneryRoutes);
app.use("/api/v1/parish", parishRoutes);
app.use("/api/v1/event", eventRoutes);
app.use("/api/v1/executive", executiveRoutes);
app.use("/api/v1/delegate", delegateRoutes);
app.use("/api/v1/ayd", aydRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Sequelize sync error:", err);
  });
