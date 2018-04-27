const express = require('express');
const app = express();
let zookeeper = require('node-zookeeper-client');
let client = zookeeper.createClient('localhost:2181');
let kids = [];
var cors = require('cors')
app.use(cors())

app.get('/sections', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(kids);
});

let getNodeChildren = function(path) {
    return new Promise((resolve, reject) => {
        client.getChildren(
            path,
            null,
            function(error, children, stats) {
                if (error) {
                    console.log(
                        'Failed to list children of %s due to: %s.',
                        path,
                        error
                    );
                }
                let arr = [];
                children.map(c => {
                   arr.push(c);
                });
                resolve(arr);
            }
        );
    });
};

async function getAllChildren(path) {
    let arr = {};
    let kids = await getNodeChildren(path);

    for (let kid of kids) {
        let nextPath = path === '/' ? kid : "/" + kid ;
        arr[kid] = await getAllChildren(path + nextPath);
    }
    return arr;
}

const server = app.listen(8081, function () {
    client.once("connected", function() {
        getAllChildren("/").then(resp => {
            kids = resp;
        });
        setInterval(() => {
            getAllChildren("/").then(resp => {
                kids = resp;
            });
        }, 1000)
    });
    client.connect();
    console.log("ZooKeeper API running at http://127.0.0.1:8081")
});