import {mongoDriver} from 'simple-odm'

export default ({dbHost, dbPort, dbName}) =>
{
    const obj = {};

    if (dbHost)
    {
        obj.host = dbHost;
    }

    if (dbPort)
    {
        obj.port = dbPort;
    }

    if (dbName)
    {
        obj.database = dbName;
    }

    mongoDriver.setUp(obj);
}