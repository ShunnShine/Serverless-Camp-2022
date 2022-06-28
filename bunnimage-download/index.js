const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
    const { username } = req.headers;
    const regexUsername = new RegExp(`^${username}\\.(png|jpeg)$`);

    const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
    const blobContainerClient = blobServiceClient.getContainerClient('images');
    let found = false;
    let imgName = '';
    for await (const blob of blobContainerClient.listBlobsFlat()) {
        found = regexUsername.test(blob.name);
        if (found) {
            imgName = blob.name;
            break;
        }
    }
    if (found) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                downloadUri: `https://serverlesscamp.blob.core.windows.net/images/${imgName}`,
                success: true,
            },
        };
    } else {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                downloadUri: '',
                success: false,
            },
        };
    }
};
