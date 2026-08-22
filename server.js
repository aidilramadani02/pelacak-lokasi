const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Melayani file statis dari folder 'public'
app.use(express.static(path.join(__dirname, "public")));

// Menangani permintaan rute utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  console.log("Pengguna terhubung:", socket.id);

  // Menerima update lokasi dari index.html
  socket.on("send-location", (data) => {
    // Meneruskan koordinat ke index2.html
    io.emit("receive-location", {
      id: socket.id,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date().toLocaleTimeString("id-ID"),
    });
  });

  socket.on("disconnect", () => {
    console.log("Pengguna terputus:", socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

// Menggunakan PORT dari lingkungan server cloud (Render) atau port 3000 untuk lokal
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
