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
            console.log(this.strokeStyle);
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
        }

        function addClick(x, y, dragging) {
            clickX.push(x);
            clickY.push(y);
            clickDrag.push(dragging);
        }