const multipart = require("parse-multipart");
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const type = req.headers["content-type"];
    let boundary = multipart.getBoundary(type);

    const body = req.body;

    const parts = multipart.Parse(body, boundary);
    
    const result = await analyzeImage(parts[0].data);

    let emotions = result[0].faceAttributes.emotion;
    let main_emo_return;
    let max = 0;
    for(let key in emotions){
        if (emotions[key] > max){
            max = emotions[key]
            main_emo_return = key
        }   
    }
    
    const gif_promise = await fetch(process.env.GIPHY_ENDPOINT + "?" +
    `api_key=${process.env.GIPHY_KEY}&` +
    `s=${main_emo_return}&`+
    "weirdness=5", {method:"GET"})

    const gif = await gif_promise.json();

    context.res = {
        body: gif.data.url
    }
}

async function analyzeImage(img){
    const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';

    const result = await fetch(uriBase +"?returnFaceAttributes=emotion", {
        method: "POST",
        body: img,
        headers: { "Content-Type": "application/octet-stream",
                "Ocp-Apim-Subscription-Key":subscriptionKey}
    })
    

    return await result.json();
}