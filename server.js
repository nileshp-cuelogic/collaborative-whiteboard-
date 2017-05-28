var app = require('./app');
var path = require('path');
var uuid = require('uuid/v1');
var _ = require('lodash');
var config = require('./config/config');
var init = require('./init');

var server = require('http').Server(app);
var io = require('socket.io')(server);

var username = "", joinUrl = "";
var connectedUsers = [];

app.get('/', function (req, res) {
    res.render('login', {
        title: '',
        invalid: false
    });
});

app.get('/:key', function (req, res) {
    if (_.some(connectedUsers, { "key": req.params.key })) {
        res.render('join', {
            title: '',
            invalid: false
        });
    } else {
        res.status(400).send("<h1>400 Oop's Page Not Found<h1/>");
    }
});

app.get('*', function (req, res) {
    res.status(400).send("<h1>400 Oop's Page Not Found<h1/>");
});

app.post('/board', function (req, res) {
    username = req.body.username
    res.render('board', {
        title: ' To collaborative white board',
        username: req.body.username
    });
});

io.on('connection', function (socket) {
    var key = uuid();
    joinUrl = 'http://' + socket.handshake.headers.host + "/" + key;
    connectedUsers.push({
        username: username,
        id: socket.id,
        joinURL: socket.handshake.headers.host + "/" + key,
        key: key
    });
    console.log(connectedUsers);

    socket.on('disconnect', function () {
        connectedUsers = _.filter(connectedUsers, function (item) {
            return item.id !== socket.id;
        })

        io.emit("user-disconnected", connectedUsers);
    });

    io.emit("new-user-connected", connectedUsers);

    socket.emit("join-url", {
        joinURL: joinUrl
    });

    socket.on('draw-from-client', function (data) {
        io.emit('draw-from-server', data);
    });
});


server.listen(config.port, function () {
    console.log('Application is running on http://localhost:' + config.port);
});