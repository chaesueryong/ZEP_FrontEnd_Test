const floorBox = document.querySelector('.floor-box');
const elevatorBox = document.querySelector('.elevator-box');
const floorInput = document.querySelector('.input-floor');
const CountInput = document.querySelector('.input-count');
const generateBtnEl = document.querySelector('.generate-btn');

let elevatorObj = {};       // 엘레베이터 상태
let setTimeOutList = [];    // settimeout 초기화

let floor; // 층수
let count; // 엘레베이터 수

// 엘레베이터 렌더링
const renderElevator = () => {
    // html 초기화
    floorBox.innerHTML = '';
    elevatorBox.innerHTML = '';

    // settimeout 초기화
    for(let i = 0; i < setTimeOutList.length; i++){
        clearTimeout(setTimeOutList[i]);
    }

    elevatorObj = {}; // 엘레베이터 상태 초기화
    setTimeOutList = []; // settimeout 초기화

    if(floorInput.value === '' || CountInput.value === ''){
        alert('층수와 엘레베이터 수를 입력해주세요!');
        return;
    }

    floor = Number(floorInput.value); // 층수
    count = Number(CountInput.value); // 엘레베이터 수


    // 렌더링
    for(let i = floor; i > 0; i--){
        floorBox.insertAdjacentHTML('beforeend', 
            `<div class="floor-${i} floor">${i}층</div>`
        );

        elevatorBox.insertAdjacentHTML('beforeend', 
            `<div class="floor-row-${i} floor-row"></div>`
        );

        const floorEl = document.querySelector(`.floor-row-${i}`); 
        for(let j = 1; j <= count; j++){
            floorEl.insertAdjacentHTML('beforeend', 
                `<div class="elevator_${i + '_' + j} elevator" onclick="setElevator(${i}, ${j})"></div>`
            );

            // 모든 엘레베이터 1층에 배치
            if(i === 1){
                document.querySelector(`.elevator_${i + '_' + j}`).style.backgroundColor = 'gray';
                elevatorObj[`${i + '_' + j}`] = 'stop';
            }else{
                elevatorObj[`${i + '_' + j}`] = 'empty';
            }

        }
    }

}

// 엘레베이터 이벤트
const setElevator = (row, col) => {
    // 누른 층 점등
    document.querySelector(`.floor-${row}`).style.backgroundColor = 'orange';

    // 같은 층의 엘레베이터 버튼 비활성화
    for(let i = 1; i <= count; i++){
        document.querySelector(`.elevator_${row + '_' + i}`).style.pointerEvents  = 'none';
    }

    // 같은 층에 열려있는지 체크
    for(let i = 1; i <= count; i++){
        if(elevatorObj[`${row + '_' + i}`] === 'wait'){
            return;
        }
    }

    // 같은 층에 멈춰있는 것 중 내가 누른 엘레베이터가 있는지 체크, 있다면 열기
    if(elevatorObj[`${row + '_' + col}`] === 'stop'){
        openElevator(row, col);
        return;
    }

    // 같은 층에 멈춰있는 것 중 엘레베이터 열기
    for(let i = 1; i <= count; i++){
        if(elevatorObj[`${row + '_' + i}`] === 'stop'){
            openElevator(row, i);
            return;
        }
    }

    // 가장 가까운 층에 있는 엘레베이터 계산
    let nearRow = floor;
    let distance = floor;
    let isElavator = false;
    for(let i = 1; i <= floor; i++){
        for(let j = 1; j <= count; j++){
            if(elevatorObj[`${i + '_' + j}`] === 'stop'){
                isElavator = true;
                nearRow = distance > Math.abs(row - i) ? i : nearRow;
                distance = Math.abs(row - i);
            }
        }
    }

    // 멈춰있는 엘레베이터가 없으면 점등 해제
    if(isElavator === false) {
        // 누른 층 점등 해제
        document.querySelector(`.floor-${row}`).style.backgroundColor = 'white';
        // 같은 층의 엘레베이터 버튼 활성화
        for(let i = 1; i <= count; i++){
            document.querySelector(`.elevator_${row + '_' + i}`).style.pointerEvents  = 'auto';
        }  
    }

    // 누른 엘레베이터에서 가장 가까운게 있는지, 있으면 이동
    if(elevatorObj[`${nearRow + '_' + col}`] === 'stop'){
        moveElevator(nearRow, col, row);
        return;
    }

    // 가장 가까운 층에 있는 엘레베이터 이동
    for(let i = 1; i <= count; i++){
        if(elevatorObj[`${nearRow + '_' + i}`] === 'stop'){
            moveElevator(nearRow, i, row);
            return;
        }
    }
}

// 엘레베이터 열기
const openElevator = (row, col) => {
    // 문열기
    elevatorObj[`${row + '_' + col}`] = 'wait';
    updateElevator();
    const openSetTimeOut = setTimeout(() => {
        // 같은 층의 엘레베이터 버튼 활성화
        for(let i = 1; i <= count; i++){
            document.querySelector(`.elevator_${row + '_' + i}`).style.pointerEvents  = 'auto';
        }  
        // 문닫기
        document.querySelector(`.floor-${row}`).style.backgroundColor = 'white';
        elevatorObj[`${row + '_' + col}`] = 'stop';
        updateElevator();
    }, 2000);
    setTimeOutList.push(openSetTimeOut);
}

// 엘레베이터 이동
const moveElevator = (currentRow, currentCol, destinationRow) => {
    // 목적 층까지 이동 완료하면 문열기
    if(currentRow === destinationRow){
        openElevator(currentRow, currentCol);
        return;
    }

    // 이동
    elevatorObj[`${currentRow + '_' + currentCol}`] = 'move';
    updateElevator();

    const moveSetTimeOut = setTimeout(() => {
        // 지나온 층 비활성화
        elevatorObj[`${currentRow + '_' + currentCol}`] = 'empty';

        // 목적층과의 거리에 따른 상승, 하강
        if(currentRow < destinationRow){
            moveElevator(currentRow + 1, currentCol, destinationRow);
        }else{
            moveElevator(currentRow - 1, currentCol, destinationRow);
        }
    }, 1000);
    setTimeOutList.push(moveSetTimeOut);
}

// 모든 엘레베이터 상태 업데이트
const updateElevator = () => {
    const elevatorArr = Object.entries(elevatorObj);
    
    for(let i = 0; i < elevatorArr.length; i++){
        const elevatorStatus = elevatorArr[i][1];
        const elevatorEl = document.querySelector(`.elevator_${elevatorArr[i][0]}`);
        switch(elevatorStatus){
            case 'stop':
                elevatorEl.style.backgroundColor = 'gray';
                break;
            case 'empty':
                elevatorEl.style.backgroundColor = 'white';
                break;
            case 'move':
                elevatorEl.style.backgroundColor = 'blue';
                break;        
            case 'wait':
                elevatorEl.style.backgroundColor = 'red';
                break;        
            default:
                throw '잘못된 엘레베이터 상태'    
        }
    }
}

// 이벤트
const setEvent = () => {
    // 생성 버튼 이벤트
    generateBtnEl.addEventListener('click', renderElevator);
}

// 초기화
(() =>{
    setEvent();
})();