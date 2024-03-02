import express from "express";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());

let users = [
  {
    username: "mohamed-msila",
    password: "mohamed2024",
  },
  {
    username: "amina-msila",
    password: "amina2024",
  },
];

let posts = [
  {
    title: "Post 1",
    author: "mohamed-msila",
  },
  {
    title: "Post 2",
    author: "amina-msila",
  },
];

const sessions = {};

// get post of a specific user
// user should authenticate
// then authorization is performed based on username
app.get("/posts", cookieAuth, async (req, res) => {
  const username = req.body.username;
  res.json(posts.filter((post) => post.author === username));
});

// create a post by a specific user
// user should authenticate
app.post("/posts", cookieAuth, async (req, res) => {
  const { title, username } = req.body;
  if (title && username) {
    const newPost = { title, author: username };
    posts.push(newPost);
    res.json(newPost);
  } else {
    res.send("Both username and title are required");
  }
});

app.get("/cookie", async (req, res) => {
  res.cookie("test session", "test session", {
    // secure: true,
    // httpOnly: true,
  });
  res.send("cookie");
});

// user logs in only one time
// then authentication is done using cookies
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const result = users.filter((user) => {
      return user.username === username;
    });
    if (result.length > 0) {
      if (result[0].password === password) {
        const sessionId = uuidv4();
        sessions[sessionId] = { username, userId: 1 };
        console.log(sessions);
        // res.set(
        //   "Set-Cookie",
        //   `session=${sessionId}; domain=example.com; expire : new Date() + 99; httponly=true; secure=true`
        // );
        res.cookie("session", sessionId, {
          secure: true,
        });
        res.send("success");
      } else {
        return res.send("Invalid username or password");
      }
    }
  } else {
    return res.send("Both username and password are required");
  }
});

function cookieAuth(req, res, next) {
  // const cookies = req.headers.cookie;
  const cookies = req.cookies;
  if (!cookies) {
    return res.send("Unauthorized");
  }
  // const sessionId = req.headers.cookie.split("=")[1];
  const sessionId = cookies.session;
  // console.log("session:::", sessionId);
  const userSession = sessions[sessionId];
  if (!userSession) {
    return res.status(401).send("Invalid session");
  }
  next();
}

const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
