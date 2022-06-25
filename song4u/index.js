const querystring = require('qs');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
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
        body: result
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