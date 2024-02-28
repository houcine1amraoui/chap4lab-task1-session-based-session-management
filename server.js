import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const sessions = {};

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== "admin" || password !== "admin") {
    return res.status(401).send("Invalid username or password");
  }
  const sessionId = uuidv4();
  sessions[sessionId] = { username, userId: 1 };
  console.log(sessions);
  res.set("Set-Cookie", `session=${sessionId}`);
  res.send("success");
});

app.get("/course", (req, res) => {
  const sessionId = req.headers.cookie.split("=")[1];
  const userSession = sessions[sessionId];
  if (!userSession) {
    return res.status(401).send("Invalid session");
  }
  const userId = userSession.userId;
  return res.send([
    {
      id: 1,
      title: "title",
      userId,
    },
  ]);
});

const PORT = 1000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
