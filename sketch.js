// 게임 오프닝 및 스토리 인트로
let bgImg, char1, char2;

let introImgs = []; 
const totalIntroImgs = 5; //꼭!!!나중에 일러나오면6으로수정

let gameState = "START_MENU"; 
let howToStep = 0;
const totalHowToSteps = 4;

let btnImgW = 180;
let btnImgH = 70;

let scripts = [
  { imgIdx: 0, name: "돌쇠", text: "' 마님, 마님! '" },
  { imgIdx: 0, name: "돌쇠", text: "' 어째서 늘 빈 수레같은 공허한 눈망울로 하늘만 치켜보십니까? '" },
  { imgIdx: 0, name: "돌쇠", text: "' 장지처럼 광활하지만 그저 헛헛하기만 한 하늘엔 볼 것이라고는 아무것도 없습니다. '" },
  { imgIdx: 0, name: "돌쇠", text: "' 전 아는 것이라고는 잡곡밥보다야 흰쌀밥이 맛있다는 사실 뿐인, 멍청하기로는 견줄 바 없는 놈팡이라지만, 마님께서 이루말하기 어려운 사연을 갖고 계신 줄은 알겠습니다. '" },
  { imgIdx: 1, name: "돌쇠", text: "도읍엔 이미 나으리가 다른 이와 정을 나누셨다는 소문이 자자합니다." },
  { imgIdx: 1, name: "돌쇠", text: "그들은 부끄러운 줄도 모르고 마님을 우롱하는 말을 너무 쉽게 입에 담습니다." },
  { imgIdx: 1, name: "돌쇠", text: "하늘은 마님께 어찌 이런 고역을 내리시는지요…" },
  { imgIdx: 2, name: "돌쇠", text: "마님... 앙큼한 고양이처럼 혼자서 눈물 흘리지 않으셔도 됩니다" },
  { imgIdx: 2, name: "돌쇠", text: "나. 돌쇠가 마님을 품어드릴 수 있습니다....." },
  { imgIdx: 2, name: "돌쇠", text: "저를 봐주세요!!!!!!!!!!" },
  { imgIdx: 3, name: "돌쇠", text: "'마님... 내가 나으리라면 마님이 슬프도록 두고 보지 않을 텐데.'" },
  { imgIdx: 3, name: "돌쇠", text: "'열심히 운동하자. 내가 더 강해져야 해.'" },
  { imgIdx: 3, name: "돌쇠", text: "'몸이 좋아지면... 마님을 데리고 도망가는 거야... 마님이 행복하실 수 있는 곳으로...!'" },
  { imgIdx: 3, name: "돌쇠", text: "나도 마님을 위해 몸을 키워야지..." },
  { imgIdx: 4, name: "나으리", text: "씨발 뭐?" },
  /*{ imgIdx: 5, name: "나으리", text: "네 이 놈!! 저 천한 것이 거둬준 은혜는 모조리 잊고 감히 이 몸의 안사람에게 욕정해!!!" },
  { imgIdx: 5, name: "돌쇠", text: "어블성성이십니다!! 오해하신 겁니다!!" }
  { imgIdx: 5, name: "나으리", text: "어불성설이다 천한것아! 그리고 아니긴 뭐가 아니느냐! 여봐라! 당장 이 천박한 금수를 잡물고에 가두고 절대로 열어주지 말거라!!" }
  { imgIdx: 5, name: "돌쇠", text: "으아악!!!!!" }*/
];

let currentScriptIdx = 0; 
let revealedLength = 0;   
let lastTypeTime = 0;     
let typeSpeed = 50;       

// --- 페이드 효과 제어 변수 ---
let transitionAlpha = 0;     // 화면을 덮을 검은 사각형의 투명도 (0: 투명, 255: 불투명)
let isTransitioning = false; // 현재 화면 전환(페이드) 중인지 여부
let nextAction = "";         // 페이드 아웃이 끝난 후 실행할 행동 ("NEXT_SCRIPT" 또는 "GO_TO_GAME")

function preload() {
  bgImg = loadImage('게임 오프닝 화면.png'); 
  char1 = loadImage('놀이방법.png');   
  char2 = loadImage('놀이시작.png');   
  for (let i = 0; i < totalIntroImgs; i++) {
    introImgs[i] = loadImage('오프닝일러' + i + '.png');
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  textFont('조선100년체');
  
  if (gameState === "START_MENU") {
    drawStartMenu();
  } else if (gameState === "STORY_INTRO") {
    drawStoryIntro(); 
  } else if (gameState === "HOW_TO_PLAY") {
    drawHowToPlay();
  } else if (gameState === "GAME_PLAY") {
    background(200);
    textAlign(CENTER, CENTER);
    textSize(width * 0.025);
    fill(0);
    text("놀이가 시작되었소!", width / 2, height / 2);
  }
}

// 이미지 출력 시 비율조정해주는 함수
function drawCoverImage(img) {
  imageMode(CORNER);
  let imgRatio = img.width / img.height;
  let canvasRatio = width / height;
  let renderW, renderH;
  let offsetX = 0;
  let offsetY = 0;
  if (canvasRatio > imgRatio) {
    renderW = width;
    renderH = width / imgRatio;
    offsetY = (height - renderH) / 2;
  } else {
    renderW = height * imgRatio;
    renderH = height;
    offsetX = (width - renderW) / 2;
  }
  image(img, offsetX, offsetY, renderW, renderH);
}

function drawStartMenu() {
  drawCoverImage(bgImg);

  imageMode(CENTER);
  image(char1, width / 2 - 150, height / 2 + 200, btnImgW, btnImgH);
  image(char2, width / 2 + 150, height / 2 + 200, btnImgW, btnImgH);
  imageMode(CORNER); 
}

// --- 페이드 효과가 포함된 스토리 인트로 화면 ---
function drawStoryIntro() {
  let currentScript = scripts[currentScriptIdx];
  let targetImg = introImgs[currentScript.imgIdx];
  if (!targetImg) targetImg = bgImg;

  // 1. 배경 이미지 출력
  drawCoverImage(targetImg);

  // 2. 대사창 및 UI 출력 (단, 완전히 암전된 순간에는 대사창을 그리지 않음)
  if (transitionAlpha < 240) {
    let boxW = width * 0.8;          
    let boxH = height * 0.22;        
    let boxX = (width - boxW) / 2;   
    let boxY = height * 0.7;         

    rectMode(CORNER);
    noStroke();
    fill(0, 180); 
    rect(boxX, boxY, boxW, boxH, 10);

    let nameW = boxW * 0.2;          
    let nameH = boxH * 0.25;         
    let nameX = boxX + 10;
    let nameY = boxY - nameH + 2;    

    fill(0, 200); 
    rect(nameX, nameY, nameW, nameH, 5);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(nameH * 0.5); 
    text(currentScript.name, nameX + nameW / 2, nameY + nameH / 2);

    // 타이핑 효과 (페이드 진행 중이 아닐 때만 글자가 자라남)
    if (!isTransitioning && revealedLength < currentScript.text.length) {
      if (millis() - lastTypeTime > typeSpeed) {
        revealedLength++;
        lastTypeTime = millis();
      }
    }

    let displayText = currentScript.text.substring(0, revealedLength);

    textAlign(LEFT, TOP);
    textSize(boxH * 0.14); 
    fill(255);
    
    let paddingX = boxW * 0.04;
    let paddingY = boxH * 0.2;
    text(displayText, boxX + paddingX, boxY + paddingY, boxW - (paddingX * 2), boxH - (paddingY * 2));

    if (revealedLength === currentScript.text.length && !isTransitioning) {
      textAlign(RIGHT, BOTTOM);
      textSize(boxH * 0.1);
      fill(255, 150 + sin(frameCount * 0.1) * 105); 
      text("▶ 클릭 또는 Enter", boxX + boxW - paddingX, boxY + boxH - paddingY / 2);
    }
  }

  // 3. [핵심] 페이드 인/아웃 애니메이션 처리 시스템
  // --- 수정된 drawStoryIntro 내부의 페이드 시스템 제어부 ---

  // 3. [핵심] 페이드 인/아웃 애니메이션 처리 시스템
  if (isTransitioning) {
    if (nextAction === "FADE_IN") {
      // 페이드 인
      transitionAlpha -= 15; 
      if (transitionAlpha <= 0) {
        transitionAlpha = 0;
        isTransitioning = false; // 모든 페이드 과정 종료
        nextAction = "";
      }
    } else if (nextAction === "NEXT_SCRIPT" || nextAction === "GO_TO_GAME") {
      // 페이드 아웃
      transitionAlpha += 15; 
      if (transitionAlpha >= 255) {
        transitionAlpha = 255;
        
        // 완전히 어두워진 순간 실제 데이터 변경 처리
        if (nextAction === "NEXT_SCRIPT") {
          currentScriptIdx++;
          revealedLength = 0;
          nextAction = "FADE_IN"; // 데이터를 바꿨으니 이제 페이드 인으로 전환
        } else if (nextAction === "GO_TO_GAME") {
          gameState = "GAME_PLAY";
          isTransitioning = false;
          nextAction = "";
        }
      }
    }
  }

  // 4. 화면 전체를 덮는 투명 사각형 (페이드 효과의 실체)
  if (transitionAlpha > 0) {
    rectMode(CORNER);
    fill(0, transitionAlpha); // transitionAlpha 값에 따라 검은 막의 불투명도 결정
    noStroke();
    rect(0, 0, width, height);
  }
}

function drawHowToPlay() {
  background(50);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(50);
  text("놀이 방법 (" + (howToStep + 1) + " / " + totalHowToSteps + ")", width/2, 100);
  
  textSize(30);
  if (howToStep === 0) {
    fill('red');
    triangle(50, height/2, 90, height/2 - 30, 90, height/2 + 30);
    triangle(width - 50, height/2, width - 90, height/2 - 30, width - 90, height/2 + 30);
    fill('white');
    text("화면 양옆의 화살표를 눌러 공간을 이동하시오.", width/2, height/2);
  }
  if (howToStep === 1) text("의심되는 물건을 눌러 물품을 수집하시오.", width/2, height/2);
  if (howToStep === 2) {
    rectMode(CENTER);
    rect(width/2, height-50, width, 100); 
    fill('black');
    for(let i = 0; i<16; i++){ 
      rect(200 + 90*i , height-50, 70, 80);
    }
    text("주머니", 60, height - 50);
    fill('white');
    text("수집한 물품은 하단 저장공간에서 확인 가능하오.", width/2, height/2);
  }
  if (howToStep === 3) {
    text("마지막 방에서 자물쇠 번호를 입력해 탈출하시오!", width/2, height/2);
    fill('yellow');
    text("글자판을 이용해 4자리를 입력하면 되오", width/2, height/2 + 100);
  }

  drawButton(width - 300, 60, 80, 40, "다음");
}

function drawButton(x, y, w, h, label) {
  push();
  rectMode(CENTER);
  fill(255);
  stroke(0);
  rect(x, y, w, h, 5);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  text(label, x, y);
  pop();
}

// --- 대사 넘기기 및 페이드 트리거 작동 함수 ---
function handleNextScript() {
  // 페이드 애니메이션 중에는 연속 클릭 무시
  if (isTransitioning) return;

  let currentScript = scripts[currentScriptIdx];
  
  // 1. 글자가 아직 다 안 나왔다면 즉시 다 보여주기
  if (revealedLength < currentScript.text.length) {
    revealedLength = currentScript.text.length;
    return;
  } 
  
  // 2. 글자가 다 나온 상태에서 클릭/엔터 시 다음 단계 처리
  if (currentScriptIdx + 1 < scripts.length) {
    let nextScript = scripts[currentScriptIdx + 1];
    
    // 다음 대사와 현재 대사의 이미지(imgIdx)가 다른 경우에만 페이드 효과 적용
    if (currentScript.imgIdx !== nextScript.imgIdx) {
      isTransitioning = true;
      nextAction = "NEXT_SCRIPT";
    } else {
      // 이미지가 같다면 페이드 없이 즉시 대사만 넘김
      currentScriptIdx++;
      revealedLength = 0;
    }
  } else {
    // 마지막 대사였다면 게임 플레이 화면으로 (페이드 아웃 후 이동)
    isTransitioning = true;
    nextAction = "GO_TO_GAME";
  }
}

function keyPressed() {
  if (gameState === "STORY_INTRO" && keyCode === ENTER) {
    handleNextScript();
  }
}

function mousePressed() {
  if (gameState === "START_MENU") {
    let bHalfW = btnImgW / 2;
    let bHalfH = btnImgH / 2;

    if (mouseX > (width / 2 - 150) - bHalfW && mouseX < (width / 2 - 150) + bHalfW &&
        mouseY > (height / 2 + 200) - bHalfH && mouseY < (height / 2 + 200) + bHalfH) {
      gameState = "HOW_TO_PLAY";
      howToStep = 0;
    }
    
    if (mouseX > (width / 2 + 150) - bHalfW && mouseX < (width / 2 + 150) + bHalfW &&
        mouseY > (height / 2 + 200) - bHalfH && mouseY < (height / 2 + 200) + bHalfH) {
      gameState = "STORY_INTRO";
      currentScriptIdx = 0;
      revealedLength = 0;
      isTransitioning = true;
      nextAction = "FADE_IN";
      transitionAlpha = 255;
    }
  } 
  else if (gameState === "STORY_INTRO") {
    handleNextScript();
  }
  else if (gameState === "HOW_TO_PLAY") {
    if (mouseX > width - 340 && mouseX < width - 260 && 
        mouseY > 40 && mouseY < 80) {
      howToStep++;
      if (howToStep >= totalHowToSteps) {
        gameState = "START_MENU"; 
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}