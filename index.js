import fetch from 'node-fetch';
import express from 'express';
import cluster from 'cluster';
import cors from 'cors';
import os from 'os';

const port = process.env.PORT || 5000;
const debug = process.env.DEBUG || 0;

function corsOptions (req, res, next) {
    if (req.method === 'OPTIONS') {
        var headers = {};
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = true;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With,X-HTTP-Method-Override";
        res.writeHead(204, headers);
        res.end();
    } else {
        next();
    }
}

const app = express();
app.use(corsOptions);
app.use(cors());


if (cluster.isMaster) {
    var cpuCount = os.cpus().length;
    var threadCount = cpuCount * 1;
    if (threadCount > 3) threadCount = 3;

    console.log('CPU count:', cpuCount);
    console.log('Thread count:', threadCount);

    for (var i = 0; i < threadCount; i++) { cluster.fork() }

    cluster.on('exit', function (worker) {
        console.log('Worker %d died', worker.id);
        cluster.fork();
    });

} else {
    app.get('/search', async (req, res) => {
        let { baseURL, term } = req.query;

        let response = await fetch(`https://${ baseURL }/includes/search/?query=${ term }`);

        if (response.ok) {
            res.send(await response.text());
        } else {
            res.status(500).send('Error');
        }
    });

    app.use(express.static('dist'));
    app.listen(port, function () { console.log('App listening on port', port) });
}


