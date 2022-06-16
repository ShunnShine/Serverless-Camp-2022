const fetch = require('node-fetch')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    cat1_64 = await FetchCat64();
    cat2_64 = await FetchCat64();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            cat1: cat1_64,
            cat2: cat2_64,
            name : TwoNames()
        }
    };
}

async function FetchCat64(){
    const cat_request = await fetch("https://cataas.com/cat/cute/says/Bitcamp",
    {method:"GET"}
    )
    const cat_buffer = await cat_request.arrayBuffer();

    const cat_base64 = Buffer.from(cat_buffer).toString("base64");
    return cat_base64;
}

function TwoNames() {
    const names = ['Shreya', 'Emily', 'Fifi', 'Beau', 'Evelyn', 'Julia', 'Daniel', 'Fardeen'];

    return [names[Math.floor(Math.random()*names.length)], names[Math.floor(Math.random()*names.length)]]
}