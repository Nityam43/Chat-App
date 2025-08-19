const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/dbConnect");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
const chatRoute = require("./routes/chatRoute");
const statusRoute = require("./routes/statusRoute");
const http = require("http");
const initializeSocket = require("./services/socketService");

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Normalize FRONTEND_URL (strip trailing slash if present)
const frontendUrl = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.replace(/\/$/, "")
  : undefined;

const corsOption = {
  origin: frontendUrl,
  credentials: true,
};

console.log("CORS origin set to:", corsOption.origin);
app.use(cors(corsOption));

// Middleware
app.use(express.json()); // parse body data
app.use(cookieParser()); // parse token on every request
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
connectDb();

// Create server
const server = http.createServer(app);

const io = initializeSocket(server);

// Apply socket middleware before routes
app.use((req, res, next) => {
  req.io = io;
  req.socketUserMap = io.socketUserMap;
  next();
});

// Routes

app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.use("/api/status", statusRoute);

server.listen(PORT, () => {
  console.log("server running on port", PORT);
});
