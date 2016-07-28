var canvas,
    ctx,
    width,
    height,
    mx,
    my,
    mouseIdle,
    mouseIdleTick,
    mouseIdleMax,
    eyes,
    PI;

function Eye(opt) {
    this.x = opt.x;  //眼睛中心X坐标
    this.y = opt.y;  //眼睛中心Y坐标
    this.radius = opt.radius;  //眼睛半径
    this.pupilX = this.x;  //瞳孔中心X坐标
    this.pupilY = this.y;  //瞳孔中心Y坐标
    this.pupilRadius = this.radius / 2;  //瞳孔半径
    this.angle = 0;  //角度初始值为0
    this.magnitude = 0;  //瞳孔的移动距离
    this.magnitudeMax = this.radius - this.pupilRadius;  //瞳孔可移动的最大距离
}

Eye.prototype.step = function () {
    var dx = mx - this.x,
        dy = my - this.y,
        dist = Math.sqrt(dx * dx + dy * dy);  //计算“鼠标所在点位置”与“眼睛中心点”两点的距离
    this.angle = Math.atan2(dy, dx);  //偏移角度
    if (mouseIdle) {
        this.magnitude = 0;
    } else {
        this.magnitude = Math.min(Math.abs(dist), this.magnitudeMax); // 0=<移动距离<=magnitudeMax
    }
    this.pupilX += ((this.x + Math.cos(this.angle) * this.magnitude) - this.pupilX) * 0.1;  //X轴瞳孔中心偏移量的弹动  0.1为弹性系数
    this.pupilY += ((this.y + Math.sin(this.angle) * this.magnitude) - this.pupilY) * 0.1;  //Y轴瞳孔中心偏移量的弹动
};

Eye.prototype.draw = function () {
    //画眼睛及眼眶
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#424031';
    ctx.stroke();
    //画瞳孔
    ctx.beginPath();
    ctx.arc(this.pupilX, this.pupilY, this.pupilRadius, 0, 2 * PI);
    ctx.fillStyle = '#424031';
    ctx.fill();
};

function init() {
    canvas = document.querySelector('canvas'); //获取文档页面中的画布
    ctx = canvas.getContext('2d');//获取2d画布上下文（画笔）
    mouseIdleMax = 100;  //初始化鼠标空闲值
    PI = Math.PI;
    eyes = [];
    reset();
    loop();
}

function reset() {
    width = innerWidth;
    height = innerHeight;
    canvas.width = width;   //将窗口的文档显示区的宽度设置为画布的宽度
    canvas.height = height; //将窗口的文档显示区的高度设置为画布的高度
    mx = width / 2;         //初始化鼠标位置X坐标为窗口文档宽度一半
    my = height / 2;        //初始化鼠标位置Y坐标为窗口文档高度一半
    mouseIdle = true;       //瞳孔归位控制,true为归原位
    eyes.length = 0;
    eyes.push(new Eye({
        x: width * 0.3,
        y: height * 0.4,
        radius: 70
    }));
    eyes.push(new Eye({
        x: width * 0.7,
        y: height * 0.4,
        radius: 70
    }));
}

function mousemove(e) {
    mx = e.pageX;
    my = e.pageY;
    mouseIdleTick = mouseIdleMax;
}

function step() {
    var i = eyes.length;
    while (i--) {
        eyes[i].step();
    }

    if (mouseIdleTick > 0) {
        mouseIdleTick--;
        mouseIdle = false;
    } else {
        mouseIdle = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    var i = eyes.length;
    while (i--) {
        eyes[i].draw();
    }
    //画嘴巴
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.65, 100, 0, PI);
    ctx.fillStyle = '#424031';
    ctx.fill();

}

function loop() {
    step();
    draw();
    requestAnimationFrame(loop); //递归调用loop

}

addEventListener('mousemove', mousemove);
addEventListener('resize', reset);

init(); //main worker
