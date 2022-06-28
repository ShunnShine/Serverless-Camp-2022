const multipart = require('parse-multipart');
const { BlobServiceClient } = require('@azure/storage-blob');

async function uploadFile(binaryFile, ext, fileName) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobServiceClient.getContainerClient('images');

    const blobName = `${fileName}.${ext}`; // Create the container
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Get a block blob client
    return blockBlobClient.upload(binaryFile, binaryFile.length);
}

module.exports = async function (context, req) {
    const fileName = req.headers.codename;
    let result = '';
    if (!fileName) {
        context.res = { body: 'Sorry! No image attached.' };
        return;
    }

    const boundary = multipart.getBoundary(req.headers['content-type']);
    const { body } = req;
    const parsedBody = multipart.Parse(body, boundary);
    let ext = '';
    switch (parsedBody[0].type) {
    case 'image/png':
        ext = 'png';
        break;
    case 'image/jpeg':
        ext = 'jpeg';
        break;
    case 'image/jpg':
        ext = 'jpg';
        break;
    default:
        // do nothing
    }
    result = await uploadFile(parsedBody[0].data, ext, fileName);
    context.res = {
    // status: 200, /* Defaults to 200 */
        body: result,
    };
};
