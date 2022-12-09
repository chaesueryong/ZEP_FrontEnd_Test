const floorBox = document.querySelector('.floor-box');
const elevatorBox = document.querySelector('.elevator-box');
const floorInput = document.querySelector('.input-floor');
const CountInput = document.querySelector('.input-count');
const generateBtnEl = document.querySelector('.generate-btn');

let elevatorObj = {};

let floor;
let count;

// 엘레베이터 렌더링
const renderElevator = () => {
    floorBox.innerHTML = '';
    elevatorBox.innerHTML = '';

    elevatorStatus = {};

    floor = Number(floorInput.value);
    count = Number(CountInput.value);

    for(let i = floor; i > 0; i--){
        floorBox.insertAdjacentHTML('beforeend', 
            `<div class="floor-${i}">${i}층</div>`
        );

        elevatorBox.insertAdjacentHTML('beforeend', 
            `<div class="floor-row-${i} floor-row"></div>`
        );

        const floorEl = document.querySelector(`.floor-row-${i}`); 
        for(let j = 1; j <= count; j++){
            floorEl.insertAdjacentHTML('beforeend', 
                `<div class="elevator_${i + '_' + j} elevator" onclick="setElevator(${i}, ${j})"></div>`
            );

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
    for(let i = 1; i <= floor; i++){
        for(let j = 1; j <= count; j++){
            if(elevatorObj[`${i + '_' + j}`] === 'stop'){
                // console.log(row, i, j, nearRow)
                nearRow = distance > Math.abs(row - i) ? i : nearRow;
                distance = Math.abs(row - i);
            }
        }
    }

    // console.log('nearRow', nearRow);
    // console.log(row, col);
    // 누른 엘레베이터에서 가장 가까운게 있는지, 있으면 이동
    if(elevatorObj[`${nearRow + '_' + col}`] === 'stop'){
        moveElevator(nearRow, col, row);
        return;
    }

    // 가장 가까운 층에 있는 엘레베이터 이동
    for(let i = 1; i <= count; i++){
        let elevatorStatus = elevatorObj[`${nearRow + '_' + i}`];

        if(elevatorStatus === 'stop'){
            moveElevator(nearRow, i, row);
            return;
        }
    }
}

const openElevator = (row, col) => {
    document.querySelector(`.elevator_${row + '_' + col}`).style.pointerEvents  = 'none';
    elevatorObj[`${row + '_' + col}`] = 'wait';
    updateElevator();
    setTimeout(() => {
        document.querySelector(`.elevator_${row + '_' + col}`).style.pointerEvents  = 'auto';
        elevatorObj[`${row + '_' + col}`] = 'stop';
        updateElevator();
    }, 2000);
}

const moveElevator = (currentRow, currentCol, destinationRow) => {
    if(currentRow === destinationRow){
        openElevator(currentRow, currentCol);
        return;
    }

    elevatorObj[`${currentRow + '_' + currentCol}`] = 'move';
    updateElevator();

    setTimeout(() => {
        elevatorObj[`${currentRow + '_' + currentCol}`] = 'empty';

        if(currentRow < destinationRow){
            moveElevator(currentRow + 1, currentCol, destinationRow);
        }else{
            moveElevator(currentRow - 1, currentCol, destinationRow);
        }
    }, 1000);
}

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
    renderElevator();
    generateBtnEl.addEventListener('click', renderElevator);
}

// 초기화
(() =>{
    setEvent();
})();