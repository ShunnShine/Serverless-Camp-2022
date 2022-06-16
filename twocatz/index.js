const fetch = require('node-fetch')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const cat_request = await fetch("https://bit-cat.azurewebsites.net/cat/says/serverless",
     {method:"GET"}
     )

    const cat_buffer = await cat_request.arrayBuffer();

    const cat_base64 = Buffer.from(cat_buffer).toString("base64");

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {cat_base64}
    };
}