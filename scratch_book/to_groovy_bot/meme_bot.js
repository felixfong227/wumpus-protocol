const crypto = require('crypto');

function getRequestAndResponseIDs(cb) {
    if (typeof cb !== 'function') throw new Error('Callback function must not be empty');
    crypto.randomBytes(10, function (reqErr, buffer) {
        if (reqErr) {
            cb(reqErr);
        }
        const reqID = buffer.toString('base64');
        crypto.randomBytes(10, function (resErr, buffer) {
            if (resErr) {
                cb(resErr);
            }
            const resID = buffer.toString('base64');
            cb(null, reqID, resID);
        });

    });
}

getRequestAndResponseIDs((err, reqID, resID) => {
    if (err) {
        throw new Error(err);
    }

    const toGrovvyBot = {
        version: "1",
        issuer_id: "443032696491343872",
        worker_id: "234395307759108106",
        // request_id: reqID,
        response_id: resID,
        action: "music.play",
        encryption: {
            enabled: false,
            algo: false,
        },
        data: {
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            loop: true,
        }
    }

    // Send this JSON payload to the "#wumpus-protocol" text channel
    discord.channel('wumpus-protocol').send(
        JSON.stringify(toGrovyBot),
    )

});