var socket = io();
var host = "";
socket.on('draw-from-server', function (data) {


    ServerDraw(
        data.clickX,
        data.clickY,
        data.clickDrag,
        data.strokeStyle
    )

    // document.getElementById('chatMessage').value = data.message;

    // socket.emit('message-from-client', {
    //     message: "Hello from client"
    // });
});

socket.on("join-url", function (data) {
    host = data.joinURL;
})

function Share() {
    alert(host)
}

function Send() {
    socket.emit('draw-from-client', {
        message: document.getElementById('chatMessage').value
    });
};


socket.on("new-user-connected", function (data) {
    $("#connectedUsers").html("");
    data.forEach(function(element) {
        $("#connectedUsers").append("<li>"+element.username+"</li>")    
    }, this);
})

socket.on("user-disconnected", function (data) {
    $("#connectedUsers").html("");
    data.forEach(function(element) {
        $("#connectedUsers").append("<li>"+element.username+"</li>")    
    }, this);
})

//prepare canvas
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
context.fillStyle = "#FF0000";

var offsetLeft = 0
var offsetTop = 0

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

var strokeStyle = "red";


function SetStrokeStyle(color) {
    this.strokeStyle = color;
}
//ctx.fillRect(0, 0, 150, 75);

$('#myCanvas').mousedown(function (e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
});

$('#myCanvas').mousemove(function (e) {
    if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
});

$('#myCanvas').mouseup(function (e) {

    paint = false;
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
});

$('#myCanvas').mouseleave(function (e) {

    paint = false;
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
});


function redraw() {
    //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.strokeStyle = this.strokeStyle; // "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }



    socket.emit('draw-from-client', {
        clickX: clickX,
        clickY: clickY,
        clickDrag: clickDrag,
        strokeStyle: this.strokeStyle
    });
}


function ServerDraw(recClickX, recClickY, recClickDrag, recStrokeStyle) {
    //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.strokeStyle = recStrokeStyle; // "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (var i = 0; i < recClickX.length; i++) {
        context.beginPath();
        if (recClickDrag[i] && i) {
            context.moveTo(recClickX[i - 1], recClickY[i - 1]);
        } else {
            context.moveTo(recClickX[i] - 1, recClickY[i]);
        }
        context.lineTo(recClickX[i], recClickY[i]);
        context.closePath();
        context.stroke();
    }
}

function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}


