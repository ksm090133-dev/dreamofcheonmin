// ==========================================
// 1. 게임 전역 상태 및 에셋 관리 변수
// ==========================================
let bgImg, char1, char2, endingImg; // 💡 endingImg 추가
let introImgs = []; 
const totalIntroImgs = 5; 

let gameState = "START_MENU"; 
let howToStep = 0;
const totalHowToSteps = 4;

let btnImgW = 180;
let btnImgH = 70;

// 스토리 인트로 데이터
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
  { imgIdx: 4, name: "나으리", text: "X발 뭐?" }
];

let currentScriptIdx = 0; 
let revealedLength = 0;   
let lastTypeTime = 0;     
let typeSpeed = 50;       

// 페이드 효과 제어 변수
let transitionAlpha = 0;     
let isTransitioning = false; 
let nextAction = "";         

// ==========================================
// 2. 인게임(방3 및 기믹) 시스템 변수
// ==========================================
let currentRoom = 3; 
const totalRooms = 4; 

let dia; 
let bg3; 
let r3_char1, r3_char2, r3_char3, r3_char4, r3_char5, r3_char6, r3_char7;
let breakSound, mouseSound, manSound; 

let items = [];
let inventory = []; 

let dialogueLines = [];
let currentDialogueIndex = -1;

// 선택지 및 서생원 제어 변수
let showPotOptions = false; 
let ratDialogueLines = [];
let currentRatIndex = -1;

// ==========================================
// 3. 데이터 로딩 및 초기화 (preload & setup)
// ==========================================
function preload() {
  // 오프닝용 에셋
  bgImg = loadImage('게임 오프닝 화면.png'); 
  char1 = loadImage('놀이방법.png');   
  char2 = loadImage('놀이시작.png');   
  for (let i = 0; i < totalIntroImgs; i++) {
    introImgs[i] = loadImage('오프닝일러' + i + '.png');
  }

  // 💡 엔딩용 에셋 로드
  endingImg = loadImage('엔딩0.png');

  // 인게임(방3)용 에셋
  dia = loadImage('돌쇠 말풍선.png');
  bg3 = loadImage('배경3.png');
  r3_char1 = loadImage('벽장.png');
  r3_char2 = loadImage('열린벽장.png');
  r3_char3 = loadImage('항아리.png');
  r3_char4 = loadImage('깨진항아리.png');
  r3_char5 = loadImage('쥐구멍.png');
  r3_char6 = loadImage('옷더미.png');
  r3_char7 = loadImage('서생원.png');

  // 사운드 에셋
  breakSound = loadSound('금속 깨지는 소리.mp3'); 
  mouseSound = loadSound('쥐찍찍소리.mp3'); 
  manSound = loadSound('남자 으악 소리.mp3'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('조선100년체');

  // 아이템 구조화 설계
  items = [
    {
      name: "사물함",
      room: 3,
      img: r3_char1,
      x: windowWidth / 2, 
      y: windowHeight / 2 - 40, 
      size: 450,   
      isCollected: false,
      isGizmo: true,
      dialogue: ["문을 열어보자"]
    },
    {
      name: "쥐구멍",
      room: -1, 
      img: r3_char5,
      x: windowWidth - 400, 
      y: windowHeight - 250, 
      size: 100,   
      isCollected: false,
      isGizmo: true,
      ratDialogue: [
        { name: "서생원", text: "(찍찍! 찍!) 나 서생원인데 항아리를 치워 주어서 드디어 나갈 수 있게 됐네. " },
        { name: "서생원", text: "고맙소! 보답으로 치즈를 드리겠소. " },
        { name: "돌쇠", text: "치주..? 치주가 뭐지?.. 으악!!" },
        { name: "돌쇠", text: "쥐가 강제로 입안에 치주를 밀어넣었다... " },
        { name: "돌쇠", text: "..치주는 맛있었다." }
      ]
    },
    {
      name: "옷더미",
      room: 3,
      img: r3_char6,
      x: 500, 
      y: windowHeight - 250, 
      size: 400,
      isCollected: false,
      isGizmo: false,
      dialogue: [
        "여성용 저고리 같은데.. 마님께는 좀 작아보여.",
        "가내에 이런 비단 옷을 입을 사람은 마님 뿐일텐데, 마님은 붙는 옷은 불편하다면서 입지 않으셔.",
        "결정적으로.. 비단의 색이 이전에 보았던 비녀와 같이 마님과는 '톤구로'다!",
        "< 나으리의 외도 증거 - 옷을 발견했다. >"
      ]
    },
    {
      name: "항아리",
      room: 3,
      img: r3_char3,
      x: windowWidth - 400, 
      y: windowHeight - 250, 
      size: 300,
      isCollected: false,
      isGizmo: true,
      dialogue: [
        "도끼를 쥐니 폭력성이 들끓어오르는군",
        "으아아악!!!",
        "허억.. 깨버렸구먼.. 응?",
        "쥐구멍? 숨겨져 있는 줄 몰랐네.",
        "< ..어쩐지 악취가 올라오는 것 같다 >"
      ]
    },
    {
      name: "깨진 항아리",
      room: -1, 
      img: r3_char4,
      x: windowWidth - 400, 
      y: windowHeight - 250, 
      size: 300,   
      isCollected: false,
      isGizmo: true,
      dialogue: ["이미 산산조각이 나버렸구려."]
    }
  ];
}

// ==========================================
// 4. 메인 루프 (draw) 시스템
// ==========================================
function draw() {
  if (gameState === "START_MENU") {
    drawStartMenu();
  } else if (gameState === "STORY_INTRO") {
    drawStoryIntro(); 
  } else if (gameState === "HOW_TO_PLAY") {
    drawHowToPlay();
  } else if (gameState === "GAME_PLAY") {
    if (bg3) {
      image(bg3, 0, 0, windowWidth, windowHeight);
    }
    
    drawRoomItems();
    drawNavigationArrows();
    drawInventoryBar();

    if (currentDialogueIndex >= 0 && currentDialogueIndex < dialogueLines.length) {
      drawDialogueBox(); 
    }

    if (showPotOptions) {
      drawPotOptionsBox();
    }

    if (currentRatIndex >= 0 && currentRatIndex < ratDialogueLines.length) {
      drawRatDialogueBox();
    }
  } else if (gameState === "ENDING_0") {
    // 💡 [신규] 엔딩 상태 스크린 출력 분기 추가
    drawEnding0();
  }
}

// ==========================================
// 5. 화면 렌더링 서브 함수 모음
// ==========================================
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

function drawStoryIntro() {
  let currentScript = scripts[currentScriptIdx];
  let targetImg = introImgs[currentScript.imgIdx];
  if (!targetImg) targetImg = bgImg;

  drawCoverImage(targetImg);

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

  if (isTransitioning) {
    if (nextAction === "FADE_IN") {
      transitionAlpha -= 15; 
      if (transitionAlpha <= 0) {
        transitionAlpha = 0;
        isTransitioning = false; 
        nextAction = "";
      }
    } else if (nextAction === "NEXT_SCRIPT" || nextAction === "GO_TO_GAME") {
      transitionAlpha += 15; 
      if (transitionAlpha >= 255) {
        transitionAlpha = 255;
        
        if (nextAction === "NEXT_SCRIPT") {
          currentScriptIdx++;
          revealedLength = 0;
          nextAction = "FADE_IN"; 
        } else if (nextAction === "GO_TO_GAME") {
          gameState = "GAME_PLAY";
          isTransitioning = false;
          nextAction = "";
        }
      }
    }
  }

  if (transitionAlpha > 0) {
    rectMode(CORNER);
    fill(0, transitionAlpha); 
    noStroke();
    rect(0, 0, width, height);
  }
}

function drawHowToPlay() {
  background(50);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(width * 0.035); // 반응형 텍스트 크기
  text("놀이 방법 (" + (howToStep + 1) + " / " + totalHowToSteps + ")", width/2, height * 0.12);
  
  textSize(width * 0.02);
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

// 💡 [신규] 완전히 반응형 구조로 설계된 엔딩 렌더링 함수
function drawEnding0() {
  if (endingImg) {
    drawCoverImage(endingImg); // 어떤 화면 비율이든 꽉 차도록 채움
  } else {
    background(0); // 이미지 유실 예외 대비
  }
  
  push();
  textAlign(CENTER, CENTER);
  
  // 가독성을 위한 대사 텍스트 뒷배경 반투명 띠 배치 (화면 크기에 비례)
  rectMode(CENTER);
  fill(0, 150);
  noStroke();
  rect(width / 2, height / 2, width, height * 0.15);
  
  // 텍스트 출력 (화면 높이 기준으로 가변 조절되어 절대 안 깨짐)
  fill(255);
  textSize(height * 0.045); 
  text("엔딩1 작성 예정", width / 2, height / 2);
  pop();
}

function drawRoomItems() {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (item.room === currentRoom && !item.isCollected) {
      push();
      if (item.img) {
        imageMode(CENTER);
        let imgH = item.size * (item.img.height / item.img.width); 
        image(item.img, item.x, item.y, item.size, imgH);
      } else {
        fill(item.color || 'white');
        stroke(0);
        strokeWeight(2);
        if (item.shape === "circle") {
          ellipse(item.x, item.y, item.size);
        } else if (item.shape === "rect") {
          rectMode(CENTER);
          rect(item.x, item.y, item.size, item.size);
        }
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(12);
        text(item.name, item.x, item.y);
      }
      pop();
    }
  }
}

function drawNavigationArrows() {
  push();
  fill(255, 180);
  noStroke();
  triangle(40, windowHeight/2, 80, windowHeight/2 - 30, 80, windowHeight/2 + 30);
  triangle(width - 40, windowHeight/2, width - 80, windowHeight/2 - 30, width - 80, windowHeight/2 + 30);
  pop();
}

function drawInventoryBar() {
  push();
  rectMode(CENTER);
  fill(255);
  rect(windowWidth/2, windowHeight-50, windowWidth, 100); 
  
  for(let i = 0; i<16; i++){ 
    fill('black');
    rect(200 + 90*i , windowHeight-50, 70, 80);
    
    if (inventory[i]) {
      push();
      if (inventory[i].img) {
        imageMode(CENTER);
        let invH = 50 * (inventory[i].img.height / inventory[i].img.width);
        image(inventory[i].img, 200 + 90 * i, windowHeight-50, 50, invH);
      } else {
        fill(inventory[i].color || 'white');
        ellipse(200 + 90 * i, windowHeight-50, 40, 40);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(11);
        text(inventory[i].name.substring(0, 2), 200 + 90 * i, windowHeight-50);
      }
      pop();
    }
  }
  fill(0);
  textSize(30);
  textAlign(LEFT, CENTER);
  text("주머니", 40, windowHeight - 50);
  pop();
}

function drawDialogueBox() {
  push();
  let boxX = windowWidth / 2 - 500;
  let boxY = windowHeight - 500;
  let boxW = 1000;
  let boxH = 400;

  rectMode(CORNER);
  image(dia, boxX, boxY, boxW, boxH);

  let currentText = dialogueLines[currentDialogueIndex];
  if (revealedLength < currentText.length) {
    if (millis() - lastTypeTime > typeSpeed) {
      revealedLength++;
      lastTypeTime = millis();
    }
  }

  let displayText = currentText.substring(0, revealedLength);
  fill(0); 
  noStroke();
  textSize(24); 
  textAlign(LEFT, TOP);
  text(displayText, boxX + 80, boxY + 230, boxW - 160, boxH - 160); 

  if (revealedLength === currentText.length && !showPotOptions) {
    textAlign(RIGHT, BOTTOM);
    textSize(18); 
    fill(0, 150 + sin(frameCount * 0.1) * 105); 
    text("▶ 클릭 또는 Enter", boxX + boxW - 80, boxY + boxH - 60);
  }
  pop();
}

function drawPotOptionsBox() {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(22);

  // 버튼 1: 항아리 깨기
  fill(0, 220);
  stroke(255);
  strokeWeight(2);
  rect(windowWidth / 2 - 160, windowHeight / 2, 220, 60, 10);
  fill(255);
  noStroke();
  text("항아리 깨기", windowWidth / 2 - 160, windowHeight / 2);

  // 버튼 2: 그대로 두기
  fill(0, 220);
  stroke(255);
  strokeWeight(2);
  rect(windowWidth / 2 + 160, windowHeight / 2, 220, 60, 10);
  fill(255);
  noStroke();
  text("그대로 두기", windowWidth / 2 + 160, windowHeight / 2);
  pop();
}

function drawRatDialogueBox() {
  push();
  let currentScript = ratDialogueLines[currentRatIndex];

  if (currentScript.name === "서생원" && r3_char7) {
    imageMode(CENTER);
    image(r3_char7, windowWidth - 520, 550, 150, 150 * (r3_char7.height / r3_char7.width));
  }

  let boxW = windowWidth * 0.8;          
  let boxH = windowHeight * 0.22;        
  let boxX = (windowWidth - boxW) / 2;   
  let boxY = windowHeight * 0.7;         

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

  if (revealedLength < currentScript.text.length) {
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

  if (revealedLength === currentScript.text.length) {
    textAlign(RIGHT, BOTTOM);
    textSize(boxH * 0.1);
    fill(255, 150 + sin(frameCount * 0.1) * 105); 
    text("▶ 클릭 또는 Enter", boxX + boxW - paddingX, boxY + boxH - paddingY / 2);
  }
  pop();
}

// ==========================================
// 6. 대사 및 이벤트 조작 시스템
// ==========================================
function handleOpeningNextScript() {
  if (isTransitioning) return;
  let currentScript = scripts[currentScriptIdx];
  
  if (revealedLength < currentScript.text.length) {
    revealedLength = currentScript.text.length;
    return;
  } 
  
  if (currentScriptIdx + 1 < scripts.length) {
    let nextScript = scripts[currentScriptIdx + 1];
    if (currentScript.imgIdx !== nextScript.imgIdx) {
      isTransitioning = true;
      nextAction = "NEXT_SCRIPT";
    } else {
      currentScriptIdx++;
      revealedLength = 0;
    }
  } else {
    isTransitioning = true;
    nextAction = "GO_TO_GAME";
  }
}

function handleRoomDialogue() {
  let currentText = dialogueLines[currentDialogueIndex];
  
  if (revealedLength < currentText.length) {
    revealedLength = currentText.length;
    return;
  } 

  if (dialogueLines && dialogueLines[0] === "도끼를 쥐니 폭력성이 들끓어오르는군" && currentDialogueIndex === 0) {
    showPotOptions = true; 
    return; 
  }
  
  currentDialogueIndex++;
  revealedLength = 0;

  if (currentDialogueIndex >= dialogueLines.length) {
    currentDialogueIndex = -1; 
  }
}

function handleRatDialogue() {
  let currentScript = ratDialogueLines[currentRatIndex];
  
  if (revealedLength < currentScript.text.length) {
    revealedLength = currentScript.text.length;
    return;
  }
  
  currentRatIndex++;
  revealedLength = 0;
  lastTypeTime = millis();
  
  if (currentRatIndex === 1 && mouseSound) {
    mouseSound.play(); 
  }
  
  // 💡 [핵심 구현] 서생원의 대사 목록을 전부 다 읽었을 경우 엔딩0 상태로 전이
  if (currentRatIndex >= ratDialogueLines.length) {
    currentRatIndex = -1; 
    gameState = "ENDING_0"; 
  }
}

function keyPressed() {
  if (showPotOptions) return;

  if (gameState === "STORY_INTRO" && keyCode === ENTER) {
    handleOpeningNextScript();
  } else if (gameState === "GAME_PLAY") {
    if (currentDialogueIndex >= 0 && keyCode === ENTER) {
      handleRoomDialogue();
    }
    if (currentRatIndex >= 0 && keyCode === ENTER) {
      handleRatDialogue();
    }
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
  else if (gameState === "HOW_TO_PLAY") {
    if (mouseX > width - 340 && mouseX < width - 260 && mouseY > 40 && mouseY < 80) {
      howToStep++;
      if (howToStep >= totalHowToSteps) {
        gameState = "START_MENU"; 
      }
    }
  }
  else if (gameState === "STORY_INTRO") {
    handleOpeningNextScript();
  }
  else if (gameState === "GAME_PLAY") {
    if (showPotOptions) {
      if (mouseX > windowWidth/2 - 270 && mouseX < windowWidth/2 - 50 && mouseY > windowHeight/2 - 30 && mouseY < windowHeight/2 + 30) {
        showPotOptions = false;
        
        if (breakSound) breakSound.play();
        if (manSound) manSound.play();

        for (let i = 0; i < items.length; i++) {
          if (items[i].name === "항아리") items[i].isCollected = true;
          if (items[i].name === "깨진 항아리") items[i].room = 3;
          if (items[i].name === "쥐구멍") items[i].room = 3;
        }
        
        currentDialogueIndex = 1;
        revealedLength = 0;
        lastTypeTime = millis();
      }
      
      if (mouseX > windowWidth/2 + 50 && mouseX < windowWidth/2 + 270 && mouseY > windowHeight/2 - 30 && mouseY < windowHeight/2 + 30) {
        showPotOptions = false;
        currentDialogueIndex = -1; 
      }
      return; 
    }

    if (currentDialogueIndex >= 0) {
      handleRoomDialogue();
      return; 
    }
    // 💡 서생원 대사창 상태일 때 클릭 연동
    if (currentRatIndex >= 0) {
      handleRatDialogue();
      return;
    }

    if (mouseY > windowHeight/2 - 40 && mouseY < windowHeight/2 + 40) {
      if (mouseX > 20 && mouseX < 90) { 
        currentRoom = (currentRoom - 1 + totalRooms) % totalRooms;
        return;
      }
      if (mouseX > windowWidth - 90 && mouseX < windowWidth - 20) { 
        currentRoom = (currentRoom + 1) % totalRooms;
        return;
      }
    }

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.room === currentRoom && !item.isCollected) {
        if (dist(mouseX, mouseY, item.x, item.y) < item.size / 2) {
          
          if (item.isGizmo) {
            if (item.name === "쥐구멍") {
              ratDialogueLines = item.ratDialogue;
              currentRatIndex = 0;
              revealedLength = 0;
              lastTypeTime = millis();
            } else {
              dialogueLines = item.dialogue;
              currentDialogueIndex = 0; 
              revealedLength = 0;
              lastTypeTime = millis();
            }
            return; 
          }

          item.isCollected = true;
          inventory.push(item); 
          
          dialogueLines = item.dialogue;
          currentDialogueIndex = 0; 
          revealedLength = 0;
          lastTypeTime = millis();
          return;
        }
      }
    }

    if (mouseY > windowHeight - 90 && mouseY < windowHeight - 10) {
      for (let i = 0; i < inventory.length; i++) {
        let slotX = 200 + 90 * i;
        if (mouseX > slotX - 35 && mouseX < slotX + 35) {
          let releasedItem = inventory.splice(i, 1)[0]; 
          releasedItem.room = currentRoom;
          releasedItem.x = mouseX;
          releasedItem.y = mouseY - 140; 
          releasedItem.isCollected = false; 
          return;
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}