let canvas;
let ctx;
let score = 0;

//canvas 생성
canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

//키퍼장갑 좌표
let goalkeeperX = canvas.width/2-32;
let goalkeeperY = canvas.height-64;

//슈퍼세이브 스킬 위치
let defenseList = [];
function keeperDefense() {
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x=goalkeeperX +20;
        this.y=goalkeeperY;
        this.alive=true;

        defenseList.push(this);
    };
    // 슈퍼세이브는 세트피스 라인선까지만 가능하다.
    this.update = function(){
        this.y -= 5;

    };

    this.skill = function(){
        
        if(this.y <= 500) {
            defenseList.pop()
        }
    };

    this.checkHit = function(){             //세이브가 공에 맞았을때 (공의 픽셀)
        for(let i=0; i<ballList.length; i++) {
            if(
                this.y <= ballList[i].y && 
                this.x >= ballList[i].x &&
                this.x <= ballList[i].x + 60
            ) {
                score++;
                this.alive = false;
                ballList.splice(i,1);
            }
    };

    for(let i=0; i<speedList.length; i++) {
        if(
            this.y <= speedList[i].y && 
            this.x >= speedList[i].x &&
            this.x <= speedList[i].x + 60
        ) {
            score++;
            this.alive = false;
            speedList.splice(i,1);
        }
    };
}

}

function generateRandomValue(min, max) {    //최소값 최대값 설정해서 x 좌표 랜덤 생성
    let randomNum = Math.floor(Math.random()*(max-min+1)) + min;
    return randomNum;
}

//느린공 위치 (canvas x 좌표 랜덤으로 생성)
let ballList = [];
function slowBall () {
    this.x=0;
    this.y=0;
    this.init=function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width-48)
        ballList.push(this) 
    };
    this.update = function(){
        this.y += 3;

        if(this.y >= canvas.height) {
            gameOver = true;
        }
    }

}
//빠른 공 위치 
let speedList = [];
function speedBall () {
    this.x = 0;
    this.y = 0;
    this.init=function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width-48)
        speedList.push(this) 
    };
    this.update = function(){
        this.y += 5;

        if(this.y >= canvas.height) {
            gameOver = true;
        }
    }
}

//이미지 불러오기
let background, ball, speed_ball, defense, gameover, goalkeeper; 
let gameOver = false; // true 이면 게임 끝남, false 이면 게임이 안끝남.

function loadImg() {
    background = new Image();
    background.src = './img/backgroundimg.png';
    
    ball = new Image();
    ball.src = './img/ball.png';

    speed_ball = new Image();
    speed_ball.src = './img/speed_ball.png';

    defense = new Image();
    defense.src = './img/defense.png';

    gameover = new Image();
    gameover.src = './img/gameover.png';

    goalkeeper = new Image();
    goalkeeper.src = './img/goalkeeper.png';


}

// 이미지 그리기
function render() {
    ctx.drawImage(background, 0, 0 , canvas.width, canvas.height);
    ctx.drawImage(goalkeeper, goalkeeperX, goalkeeperY);
    ctx.fillText(`Score : ${score}`, 30, 40 );
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";

    //슈퍼세이브 배열에 스킬이 살아있을때 실행
    for(let i = 0; i < defenseList.length; i++) {
        if(defenseList[i].alive) {
            ctx.drawImage(defense, defenseList[i].x ,defenseList[i].y ,30 ,30)
        }
    }

    //느린 공 그리기
    for(let i = 0; i < ballList.length; i++) {
        ctx.drawImage(ball, ballList[i].x ,ballList[i].y)

    }

    //빠른 공 그리기
    for(let i = 0; i < speedList.length; i++) {
        ctx.drawImage(speed_ball, speedList[i].x ,speedList[i].y)

    }


}

//키보드 코드 입력
let keyboard = [];
function keyboardListener() {
    document.addEventListener('keydown', function(e) {
        keyboard[e.keyCode] = true; 
    })

    document.addEventListener('keyup', function(e) {
        delete keyboard[e.keyCode];

        if(e.keyCode == 32) {
            createDefense()     //슈퍼세이브 광클 방지
        }
    })
}

//슈퍼세이브 생성
function createDefense() {
    let b = new keeperDefense();
    b.init();
}

//느린 공 생성  느린공은 1.5초에 한번씩 랜덤 생성
function createSlowBall() {        
    const interval = setInterval(function() {
        let s = new slowBall();
        s.init();
    }, 1500)
}

//빠른 공 생성   빠른공은 3초에 한번씩 랜덤 생성
function createSpeedBall() {       
    const interval = setInterval(function() {
        let f = new speedBall();
        f.init();
    }, 3000)

}

//방향키로 장갑 조정
function update() {
    if (37 in keyboard) {               //왼쪽 화살표 
        goalkeeperX -= 4;

    }

    if (39 in keyboard) {               //오른쪽 화살표
        goalkeeperX += 4;
    }

    if (38 in keyboard) {              //위쪽 화살표
        goalkeeperY -= 4;
     }

     if (40 in keyboard) {               //밑 화살표
        goalkeeperY += 4;
     }

    if (goalkeeperX <=0) {              //골키퍼 화면 밖으로 못 나가게
        goalkeeperX = 0;
    }

    if (goalkeeperX >= canvas.width-64) {
        goalkeeperX = canvas.width-64;
    }

    if (goalkeeperY >=canvas.height-64) {
        goalkeeperY = canvas.height-64;
    }

    if (goalkeeperY <= 550) {
        goalkeeperY = 550;
    }

    // 슈퍼세이브 y좌표 업데이트
    for(let i = 0; i <defenseList.length; i++) {
        if(defenseList[i].alive) {
            defenseList[i].update()
            defenseList[i].checkHit()
            defenseList[i].skill()
        }


    }

    // 느린공 x 좌표 업데이트
    for(let i = 0; i < ballList.length; i++) {
        ballList[i].update()

    }

    // 빠른공 x 좌표 업데이트
    for(let i = 0; i < speedList.length; i++) {
            speedList[i].update()
        }
    


}

//이미지 무한루프
function main () {
    if(!gameOver) {
    render()
    update()
    requestAnimationFrame(main)
    }
    else {
        ctx.drawImage(gameover, 80, 250);
    }    
}


loadImg();
keyboardListener();
createSlowBall();
createSpeedBall();
main();



