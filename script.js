const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const tools = document.querySelectorAll('.tool-btn');
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');

// 캔버스 크기 설정
canvas.width = 800;
canvas.height = 600;

// 초기 설정
let isDrawing = false;
let currentTool = 'pencil';
let currentColor = '#000000';
let currentSize = 5;
let lastX = 0;
let lastY = 0;

// 도구 선택
tools.forEach(tool => {
    tool.addEventListener('click', () => {
        tools.forEach(t => t.classList.remove('active'));
        tool.classList.add('active');
        currentTool = tool.id;
    });
});

// 색상 선택
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// 크기 조절
sizeSlider.addEventListener('input', (e) => {
    currentSize = e.target.value;
});

// 전체 지우기
document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 이미지 저장
document.getElementById('save').addEventListener('click', () => {
    // 새 탭에서 이미지 열기
    const image = canvas.toDataURL('image/png');
    const newWindow = window.open();
    newWindow.document.write(`
        <html>
            <head>
                <title>그림 저장</title>
                <style>
                    body { 
                        display: flex; 
                        flex-direction: column; 
                        align-items: center; 
                        justify-content: center; 
                        height: 100vh; 
                        margin: 0; 
                        background: #f0f0f0; 
                        font-family: Arial, sans-serif;
                    }
                    img { 
                        max-width: 100%; 
                        max-height: 80vh; 
                        margin-bottom: 20px;
                    }
                    .instructions {
                        text-align: center;
                        margin-bottom: 20px;
                        padding: 10px;
                        background: white;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                </style>
            </head>
            <body>
                <div class="instructions">
                    <h2>이미지를 저장하는 방법</h2>
                    <p>1. 이미지 위에서 마우스 오른쪽 버튼을 클릭하세요</p>
                    <p>2. "이미지를 다른 이름으로 저장" 또는 "Save image as"를 선택하세요</p>
                    <p>3. 원하는 위치와 파일명을 선택하고 저장하세요</p>
                </div>
                <img src="${image}" alt="그림">
            </body>
        </html>
    `);
});

// 마우스 이벤트
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// 터치 이벤트
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
}

function draw(e) {
    if (!isDrawing) return;
    
    const [currentX, currentY] = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    
    ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
    ctx.lineWidth = currentSize;
    
    // 브러시와 연필의 스타일 차이 설정
    if (currentTool === 'brush') {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.3; // 수채화 효과를 위해 투명도 증가
        ctx.lineWidth = currentSize * 1.5; // 브러시는 약간 더 두껍게
    } else if (currentTool === 'pencil') {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 1.0; // 연필은 불투명하게
    } else if (currentTool === 'eraser') {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 1.0;
    }
    
    ctx.stroke();
    
    [lastX, lastY] = [currentX, currentY];
}

function stopDrawing() {
    isDrawing = false;
}

function getCoordinates(e) {
    if (e.type.includes('touch')) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        return [
            touch.clientX - rect.left,
            touch.clientY - rect.top
        ];
    }
    const rect = canvas.getBoundingClientRect();
    return [
        e.clientX - rect.left,
        e.clientY - rect.top
    ];
}

function handleTouch(e) {
    e.preventDefault();
    if (e.type === 'touchstart') {
        startDrawing(e);
    } else if (e.type === 'touchmove') {
        draw(e);
    }
} 