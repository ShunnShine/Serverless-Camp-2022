const multipart = require('parse-multipart')
const {BlobServiceClient} = require('@azure/storage-blob')

module.exports = async function (context, req) {
    const boundary = multipart.getBoundary(req.headers['content-type']);
    const body = req.body;
    const parsedBody = multipart.Parse(body, boundary);
    let ext = '';
    switch (parsedBody[0].type){
        case "image/png":
            ext = "png";
            break;
        case 'image/jpeg':
            ext = 'jpeg';
            break;
        case 'image/jpg':
            ext = 'jpg'
            break;
    }
    await uploadFile(parsedBody[0].data, ext)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "Success...Probably"
    };
}

async function uploadFile(binaryFile, ext){
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient("images");

    const blobName = 'test.' + ext;    // Create the container
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Get a block blob client
    await blockBlobClient.upload(binaryFile[0].data, binaryFile[0].data.length);
}