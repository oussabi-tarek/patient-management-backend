const axios=require('axios');

exports.chatAuthenticator = async function(req, res, next) {
    const { username } = req.body;
    // Get or create user on Chat Engine!
    try {
      const r = await axios.put(
        "https://api.chatengine.io/users/",
        { username: username, secret: username, first_name: username },
        { headers: { "Private-Key": "7c0a7951-3d59-49d8-b1a8-eb0467e0ec84" } }
      );
      return res.status(r.status).json(r.data);
    } catch (e) {
        console.log("error: " + e);
      return res.json(e);
    }
}