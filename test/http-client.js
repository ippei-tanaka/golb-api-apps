import request from 'request';
import url from 'url';
import path from 'path';

export default class HttpClient
{
    constructor ({
        protocol = 'http',
        port = 80,
        hostname = "localhost",
        pathbase = "/"
    } = {})
    {
        this._protocol = protocol;
        this._port = port;
        this._hostname = hostname;
        this._pathbase = pathbase;
        this._jar = request.jar();
    }

    get (path)
    {
        return this.request('get', path);
    }

    post (path, data)
    {
        return this.request('post', path, data);
    }

    put (path, data)
    {
        return this.request('put', path, data);
    }

    del (path)
    {
        return this.request('delete', path);
    }

    request (method, pathname = "", data = null)
    {
        const uri = url.format({
            protocol: this._protocol,
            port: this._port,
            hostname: this._hostname,
            pathname: path.join(this._pathbase, pathname)
        });

        const options = {
            method,
            uri,
            jar: this._jar,
            headers: {
                "content-type": "application/json"
            }
        };

        if (data)
        {
            options.body = JSON.stringify(data);
        }

        return new Promise((resolve, reject) => request(options, (error, response, body) =>
        {
            if (response.statusCode === 200)
            {
                return resolve(JSON.parse(body));
            }

            reject({
                statusCode: response.statusCode,
                body: JSON.parse(body)
            });
        }));
    }
}