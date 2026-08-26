const express = require("express");

const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());

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

// Token endpoint
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

        const LIVEKIT_API_KEY =
            process.env.LIVEKIT_API_KEY;

        const LIVEKIT_API_SECRET =
            process.env.LIVEKIT_API_SECRET;

        const LIVEKIT_URL =
            process.env.LIVEKIT_URL;

        if (!LIVEKIT_API_KEY ||
            !LIVEKIT_API_SECRET ||
            !LIVEKIT_URL) {

            return res.status(500).json({
                error: "LiveKit environment variables are missing"
            });
        }

        const { AccessToken } =
            require("livekit-server-sdk");

        const token =
            new AccessToken(
                LIVEKIT_API_KEY,
                LIVEKIT_API_SECRET,
                {
                    identity: participant_name
                }
            );

        token.addGrant({
            roomJoin: true,
            room: room_name,
            canPublish: true,
            canSubscribe: true
        });

        const jwt =
            await token.toJwt();

        res.json({
            server_url: LIVEKIT_URL,
            participant_token: jwt
        });

    } catch (error) {

        console.error(
            "TOKEN ERROR:",
            error
        );

        res.status(500).json({
            error: error.message
        });
    }
});

// Start server
app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `K.K Live Server running on port ${PORT}`
        );

    }
);
