```javascript
const express = require("express");
const { AccessToken } = require("livekit-server-sdk");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// Home
app.get("/", (req, res) => {
    res.send("K.K Live Server is RUNNING!");
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// LiveKit token
app.post("/getToken", async (req, res) => {
    try {
        const roomName =
            req.body.room_name || "kk-live-room";

        const participantName =
            req.body.participant_name || "KK_User";

        if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
            return res.status(500).json({
                error: "LiveKit API key or secret is missing"
            });
        }

        if (!LIVEKIT_URL) {
            return res.status(500).json({
                error: "LIVEKIT_URL is missing"
            });
        }

        const token = new AccessToken(
            LIVEKIT_API_KEY,
            LIVEKIT_API_SECRET,
            {
                identity: participantName,
                name: participantName
            }
        );

        token.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true
        });

        const jwt = await token.toJwt();

        res.json({
            server_url: LIVEKIT_URL,
            participant_token: jwt
        });

    } catch (error) {

        console.error("Token error:", error);

        res.status(500).json({
            error: error.message || "Failed to create token"
        });
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `K.K Live Server running on port ${PORT}`
    );
});
```
