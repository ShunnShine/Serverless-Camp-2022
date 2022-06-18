const multipart = require("parse-multipart");
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const type = req.headers["content-type"];
    let boundary = multipart.getBoundary(type);

    const body = req.body;

    const parts = multipart.Parse(body, boundary);
    
    const emotion_result = await analyzeImage(parts[0].data);

    context.res = {
        body: {emotion_result}
    }
}

async function analyzeImage(img){
    const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';

    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'
    })

    const emotion_result = await fetch(uriBase +"?"+ params.toString(), {
        method: "POST",
        body: img,
        headers: { "Content-Type": "application/octet-stream",
                "Ocp-Apim-Subscription-Key":subscriptionKey}
    })
    const data = await emotion_result.json();
    return data;
}