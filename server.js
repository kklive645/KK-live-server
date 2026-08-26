const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("K.K Live Server is RUNNING!");
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "K.K Live Server is healthy"
    });
});

app.post("/getToken", async (req, res) => {
    try {
        const {
            room_name,
            participant_name
        } = req.body;

        if (!room_name || !participant_name) {
            return res.status(400).json({
                error: "room_name and participant_name are required"
            });
        }

        const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
        const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
        const LIVEKIT_URL = process.env.LIVEKIT_URL;

        if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
            return res.status(500).json({
                error: "LiveKit environment variables are missing"
            });
        }

        const { AccessToken } = require("livekit-server-sdk");

        const token = new AccessToken(
            LIVEKIT_API_KEY,
            LIVEKIT_API_SECRET,
            {
                identity: participant_name,
                name: participant_name
            }
        );

        token.addGrant({
            roomJoin: true,
            room: room_name,
            canPublish: true,
            canSubscribe: true
        });

        const jwt = await token.toJwt();

        res.json({
            server_url: LIVEKIT_URL,
            participant_token: jwt
        });

    } catch (error) {
        console.error("TOKEN ERROR:", error);

        res.status(500).json({
            error: error.message || "Failed to create token"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`K.K Live Server running on port ${PORT}`);
});
