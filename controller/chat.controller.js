const axios=require('axios');

exports.chatAuthenticator = async function(req, res, next) {
    const { username } = req.body;
    // Get or create user on Chat Engine!
    try {
        console.log("username: " + username);
      const r = await axios.put(
        "https://api.chatengine.io/users/",
        { username: username, secret: username, first_name: username },
        { headers: { "Private-Key": "a0c23d88-ea10-4733-80f3-7aa7a9ab7006" } }
      );
      return res.status(r.status).json(r.data);
    } catch (e) {
        console.log("error: " + e);
      return res.json(e);
    }
}