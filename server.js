const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { AccessToken } = require("livekit-server-sdk");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "K.K Live Token Server is running"
    });
});

app.post("/getToken", async (req, res) => {
    try {
        const roomName =
            req.body.room_name || "kk-live-room";

        const participantName =
            req.body.participant_name ||
            ("KK_User_" + Date.now());

        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        const livekitUrl = process.env.LIVEKIT_URL;

        if (!apiKey) {
            return res.status(500).json({
                error: "LIVEKIT_API_KEY missing"
            });
        }

        if (!apiSecret) {
            return res.status(500).json({
                error: "LIVEKIT_API_SECRET missing"
            });
        }

        if (!livekitUrl) {
            return res.status(500).json({
                error: "LIVEKIT_URL missing"
            });
        }

        const token = new AccessToken(
            apiKey,
            apiSecret,
            {
                identity: participantName,
                name: participantName,
                ttl: "6h"
            }
        );

        token.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true
        });

        const participantToken = await token.toJwt();

        console.log(
            "Token created for " +
            participantName +
            " in " +
            roomName
        );

        res.json({
            server_url: livekitUrl,
            participant_token: participantToken,
            room_name: roomName,
            participant_name: participantName
        });

    } catch (error) {
        console.error("Token error:", error);

        res.status(500).json({
            error: "Could not create LiveKit token"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("====================================");
    console.log("      K.K LIVE TOKEN SERVER");
    console.log("====================================");
    console.log("Server listening on port " + PORT);
    console.log("Host: 0.0.0.0");
    console.log("Status: RUNNING");
    console.log("====================================");
    console.log("");
});
