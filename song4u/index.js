const querystring = require('qs');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    const songs = {"GenZ":"https://open.spotify.com/track/0SIAFU49FFHwR3QnT5Jx0k?si=1c12067c9f2b4fbf", 
    "GenY":"https://open.spotify.com/track/1Je1IMUlBXcx1Fz0WE7oPT?si=a04bbdf6ec4948b9", 
    "GenX":"https://open.spotify.com/track/4Zau4QvgyxWiWQ5KQrwL43?si=790d9e3ef2ed408d", 
    "BabyBoomers":"https://open.spotify.com/track/4gphxUgq0JSFv2BCLhNDiE?si=1abb329f2dc24f50", 
    "Unknown":"https://open.spotify.com/track/5ygDXis42ncn6kYG14lEVG?si=84b49b41d09d4d11"}

    const queryObject = querystring.parse(req.body);
    const imageUrl = queryObject.MediaUrl0;
    
    let resp = await fetch(imageUrl, {method:'GET'});
    let image = await resp.arrayBuffer()

    let faceResponse = await analyzeImage(image);
    let faceAge = faceResponse[0].faceAttributes.age;
    
    let result = 'Unknown';

    if (faceAge > 5 && faceAge < 25)
        result = 'GenZ';
    else if (faceAge > 24 && faceAge < 41)
        result = 'GenY'
    else if (faceAge > 40 && faceAge < 57)
        result = 'GenX'
    else if (faceAge > 56 && faceAge < 76)
        result = 'BabyBoomers'
        
    context.res = {
        body: `We guessed you're part of this generation: ${result}! Happy listening! ${songs[result]}`
    };
}

async function analyzeImage(img){
    const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';

    const result = await fetch(uriBase +"?returnFaceAttributes=age", {
        method: "POST",
        body: img,
        headers: { "Content-Type": "application/octet-stream",
                "Ocp-Apim-Subscription-Key":subscriptionKey}
    })
    

    return await result.json();
}