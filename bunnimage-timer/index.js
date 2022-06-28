const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, myTimer) {
    const timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);

    const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
    const blobContainerClient = blobServiceClient.getContainerClient('images');

    for await (const blob of blobContainerClient.listBlobsFlat()) {
        context.log(`Deleting blob name ${blob.name}`);

        await blobContainerClient.deleteBlob(blob.name);
    }

    context.log('Just deleted your blobs!');
};
