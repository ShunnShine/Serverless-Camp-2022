const multipart = require("parse-multipart")

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const type = req.headers["content-type"];
    let boundary = multipart.getBoundary(type);

    const body = req.body;

    const parts = multipart.Parse(body, boundary);

    const convertedResult = Buffer.from(parts[0].data).toString("base64");

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: convertedResult
    };
}