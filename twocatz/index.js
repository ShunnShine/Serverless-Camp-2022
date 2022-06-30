const fetch = require('node-fetch')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let cat1_64 = await FetchCat64(req.query.name1);
    let cat2_64 = await FetchCat64(req.query.name2);
    let cat3_64 = await FetchCat64(req.query.name3);
    let cat4_64 = await FetchCat64(req.query.name4);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            name1: cat1_64,
            name2: cat2_64,
            name3: cat3_64,
            name4: cat4_64,
        }
    };
}

async function FetchCat64(text){
    const cat_request = await fetch(`https://cataas.com/cat/cute/says/${text}`,{method:"GET"});
    const cat_buffer = await cat_request.arrayBuffer();

    const cat_base64 = Buffer.from(cat_buffer).toString("base64");
    return cat_base64;
}