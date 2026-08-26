const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();

const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
    res.send("K.K Live Server is RUNNING!");
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        server: "K.K Live Server"
    });
});

/*
|--------------------------------------------------------------------------
| LiveKit Token
|--------------------------------------------------------------------------
*/

app.post("/getToken", async (req, res) => {

    try {

        const roomName =
            req.body.room_name || "kk-live-room";

        const participantName =
            req.body.participant_name || "KK_User";

        const apiKey =
            process.env.LIVEKIT_API_KEY;

        const apiSecret =
            process.env.LIVEKIT_API_SECRET;

        const livekitUrl =
            process.env.LIVEKIT_URL;

        if (!apiKey) {
            return res.status(500).json({
                error: "LIVEKIT_API_KEY is missing"
            });
        }

        if (!apiSecret) {
            return res.status(500).json({
                error: "LIVEKIT_API_SECRET is missing"
            });
        }

        if (!livekitUrl) {
            return res.status(500).json({
                error: "LIVEKIT_URL is missing"
            });
        }

        const token = new AccessToken(
            apiKey,
            apiSecret,
            {
                identity: participantName,
                name: participantName,
                ttl: "1h"
            }
        );

        token.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true
        });

        const participantToken =
            await token.toJwt();

        res.json({
            server_url: livekitUrl,
            participant_token: participantToken
        });

    } catch (error) {

        console.error(
            "Token generation error:",
            error
        );

        res.status(500).json({
            error:
                error.message ||
                "Failed to generate LiveKit token"
        });
    }
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log(
            `K.K Live Server running on port ${PORT}`
        );
    }
);
