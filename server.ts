import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import express from "express";
import fs from "fs";
import path from "path";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Simple JSON-based database for persistence
const DB_FILE = path.join(process.cwd(), "db.json");

function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [
        {
          id: "1",
          fullName: "Admin User",
          email: "admin@lifesaver.com",
          phone: "01700000000",
          whatsapp: "01700000000",
          password: "admin",
          bloodGroup: "O+",
          hemoglobin: 15,
          gender: "Male",
          dob: "1990-01-01",
          district: "Dhaka",
          thana: "Gulshan",
          location: "Gulshan 2",
          isAvailable: true,
          role: "admin",
          isVerified: true,
          totalDonations: 10,
          photo: "https://picsum.photos/seed/admin/200/200"
        },
        {
          id: "2",
          fullName: "Rahim Ahmed",
          email: "rahim@example.com",
          phone: "01800000000",
          whatsapp: "01800000000",
          password: "password",
          bloodGroup: "A+",
          hemoglobin: 14.5,
          gender: "Male",
          dob: "1995-05-15",
          district: "Dhaka",
          thana: "Banani",
          location: "Banani Road 11",
          isAvailable: true,
          role: "donor",
          isVerified: true,
          totalDonations: 26,
          photo: "https://picsum.photos/seed/rahim/200/200"
        },
        {
          id: "3",
          fullName: "Karim Ullah",
          email: "karim@example.com",
          phone: "01900000000",
          whatsapp: "01900000000",
          password: "password",
          bloodGroup: "B+",
          hemoglobin: 13.8,
          gender: "Male",
          dob: "1992-10-20",
          district: "Dhaka",
          thana: "Uttara",
          location: "Sector 4",
          isAvailable: true,
          role: "donor",
          isVerified: true,
          totalDonations: 12,
          photo: "https://picsum.photos/seed/karim/200/200"
        }
      ],
      bloodRequests: [
        {
          id: "req1",
          patientName: "Sumi Akter",
          bloodGroup: "A+",
          hospitalName: "Dhaka Medical College",
          hospitalLocation: "Bakshibazar",
          district: "Dhaka",
          thana: "Shahbagh",
          phone: "01500000000",
          urgency: "Critical",
          notes: "Urgent need for A+ blood for surgery.",
          requesterId: "1",
          createdAt: new Date().toISOString(),
          status: "Open"
        }
      ],
      donations: [],
      messages: [],
      notifications: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.prepare().then(() => {
  initDB();
  const expressApp = express();
  const httpServer = createServer(expressApp);
  const io = new Server(httpServer);

  expressApp.use(express.json());

  // API Routes
  expressApp.get("/api/db", (req, res) => {
    res.json(readDB());
  });

  expressApp.post("/api/db/:table", (req, res) => {
    const { table } = req.params;
    const db = readDB();
    if (db[table]) {
      const newItem = { ...req.body, id: Date.now().toString() };
      db[table].push(newItem);
      writeDB(db);
      res.json(newItem);
    } else {
      res.status(404).json({ error: "Table not found" });
    }
  });

  // Socket.io for real-time chat
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on("send-message", (data) => {
      const db = readDB();
      const newMessage = {
        ...data,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      db.messages.push(newMessage);
      writeDB(db);
      io.to(data.room).emit("receive-message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // Next.js handler
  expressApp.all(/.*/, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
