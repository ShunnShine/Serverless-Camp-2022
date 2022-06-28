const { CosmosClient } = require('@azure/cosmos');
const querystring = require('qs');

const config = {
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
    databaseId: 'SecretStorer',
    containerId: 'secrets',
    partitionKey: { kind: 'Hash', paths: ['/secrets'] },
};
async function create(client, databaseId, containerId) {
    const { partitionKey } = config;
    await client.databases.createIfNotExists({
        id: databaseId,
    });

    await client.database(databaseId).containers
        .createIfNotExists({ id: containerId, partitionKey }, {
            offerThroughput: 400,
        });
}

async function createDocument(newItem) {
    const {
        endpoint, key, databaseId, containerId,
    } = config;

    const client = new CosmosClient({ endpoint, key });

    const database = client.database(databaseId);
    const container = database.container(containerId);

    // Make sure Tasks database is already setup. If not, create it.
    await create(client, databaseId, containerId);

    try {
        // query to return all items
        const querySpec = {
            query: 'SELECT top 1 * FROM c order by c._ts desc',
        };

        // read all items in the Items container
        const { resources: items } = await container.items
            .query(querySpec)
            .fetchAll();
        await container.items.create(newItem);
        return items[0];
    } catch (err) {
        console.log(err.message);
        return { message: 'No Secrets' };
    }
}

module.exports = async function (context, req) {
    const queryObject = querystring.parse(req.body);
    const lastSecret = createDocument({ message: queryObject.Body });
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: `Thanks 😊! Stored your secret "${queryObject.Body}". 😯 Someone confessed that: ${lastSecret.message}`,
    };
};
