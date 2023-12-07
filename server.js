const express=require('express');
const cors=require('cors');
const axios=require('axios');

const app = express();
var corsOptions = {
    origin: "http://localhost:3000"
    };
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/authenticate", async (req, res) => {
    const { username } = req.body;
    console.log(username);
    // Get or create user on Chat Engine!
    try {
      const r = await axios.put(
        "https://api.chatengine.io/users/",
        { username: username, secret: username, first_name: username },
        { headers: { "Private-Key": "a0c23d88-ea10-4733-80f3-7aa7a9ab7006" } }
      );
      return res.status(r.status).json(r.data);
    } catch (e) {
      return res.status(e.response.status).json(e.response.data);
    }
  });



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
