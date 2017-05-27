var app = require('./app');
var path = require('path');
var config = require('./config/config');
var init = require('./init');

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function (req, res) {
    res.render('join', {
        title: '',
    });
});

app.post('/board', function (req, res) {
    res.render('board', {
        title: ' To collaborative white board',
        username:req.body.username,
    });
    //res.sendFile(__dirname + '/public/board.html');
});

app.get('/:id', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
    //console.log(socket.handshake.headers.host);

    socket.emit('message-from-server', {
        message: "Welcome " + socket.id
    });

    socket.emit("host-name", {
        hostName: socket.handshake.headers.host
    });

    socket.on('message-from-client', function (data) {

        io.emit('message-from-server', {
            message: data.message
        });
    });
});


server.listen(config.port, function () {
    //console.log('Application is running on http://localhost:' + config.port);
});