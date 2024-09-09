import dotenv from "dotenv";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config({ path: "./.env" });

//latitude and longitude, in cartography, a coordinate system used to determine and describe the position of any place
//on Earth’s surface. Latitude is a measurement of a
//location north or south of the Equator. In contrast,
//longitude is a measurement of location east or west of the prime meridian

//Leaflet is the leading open-source JavaScript library for mobile-friendly interactive maps. Weighing just about 42 KB of JS,
//it has all the mapping features most developers ever need.

const app = express();

const server = http.createServer(app);

const io = new Server(server);

// __dirname is a special variable that gives the absolute path of the directory where the current script or module is running.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log("__direname : ", __dirname);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
let dest = path.join(__dirname, "public");
console.log(dest);

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("send-location", (data) => {
    console.log(data.latitude, data.longitude);
    io.emit("receive-location", { id: socket.id, ...data });
  });
  ///////////////////////////////////////////////////////////
  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(process.env.PORT||3000, () => {
  console.log("App is running");
});
