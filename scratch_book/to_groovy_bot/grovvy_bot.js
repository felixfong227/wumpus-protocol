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

discord.channel('wumpus-protocol').listen(msg => {
    const parsedMsg = JSON.parse(msg);
    const respondID = parsedMsg.response_id;
    if (parsedMsg.worker_id === '234395307759108106') {
        const issuerID = parsedMsg.issuer_id;

        if (parsedMsg.action === 'music.play') {
            const data = parsedMsg.data;
            const isAudioLigit = checkSauce(data.url);

            if (!isAudioLigit) {
                getRequestAndResponseIDs((erro, reqID, resID) => {
                    if (erro) {
                        cb(reqErr);
                    }
                    const toIssuerBot = {
                        version: "1",
                        issuer_id: "234395307759108106",
                        worker_id: "443032696491343872",
                        // request_id: reqID,
                        response_id: respondID,
                        action: "respond",
                        encryption: {
                            enabled: false,
                            algo: false,
                        },
                        errors: [
                            {
                                message: "Can not find the music you are looking for :(",
                                code: "resource_not_found.audio_stream"
                            }
                        ]
                    }
                    discord.channel('wumpus-protocol').send(
                        JSON.stringify(toIssuerBot),
                    )
                });
                return;
            }

            if (isAudioLigit) {
                if (data.url) {
                    const isLoop = data.loop;
                    const musicStream = getAudioStream(data.url, isLoop);
                    discord.channel('music').playAudio(musicStream);
                    getRequestAndResponseIDs((erro, reqID, resID) => {
                        if (erro) {
                            cb(reqErr);
                        }
                        const toIssuerBot = {
                            version: "1",
                            issuer_id: "234395307759108106",
                            worker_id: "443032696491343872",
                            // request_id: reqID,
                            response_id: respondID,
                            action: "respond",
                            encryption: {
                                enabled: false,
                                algo: false,
                            },
                            data: {
                                ok: true,
                                video: {
                                    format: 'mp4',
                                    length: 212000
                                },
                                isLoop: true,
                            },
                            errors: null,
                        }
                        discord.channel('wumpus-protocol').send(
                            JSON.stringify(toIssuerBot),
                        )
                    });
                }
            }
        }

    }
})