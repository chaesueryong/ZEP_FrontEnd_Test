const floorBox = document.querySelector('.floor-box');
const elevatorBox = document.querySelector('.elevator-box');
const floorInput = document.querySelector('.input-floor');
const CountInput = document.querySelector('.input-count');
const generateBtnEl = document.querySelector('.generate-btn');

// 엘레베이터 렌더링
const renderElevator = () => {
    floorBox.innerHTML = '';
    elevatorBox.innerHTML = '';

    const floor = floorInput.value;
    const count = CountInput.value;

    for(let i = floor; i > 0; i--){
        floorBox.insertAdjacentHTML('beforeend', 
            `<div>${i}층</div>`
        );

        elevatorBox.insertAdjacentHTML('beforeend', 
            `<div class="floor-${i} floor"></div>`
        );

        const floorEl = document.querySelector(`.floor-${i}`); 
        for(let j = 1; j <= count; j++){
            floorEl.insertAdjacentHTML('beforeend', 
                `<div class="floor_${i + '_' + j} elevator" onclick="setElevator(${i}, ${j})"></div>`
            );

            if(i === 1){
                document.querySelector(`.floor_${i + '_' + j}`).style.backgroundColor = 'gray';
            }
        }
    }
}

// 엘레베이터 이벤트
const setElevator = (col, row) => {
    console.log(col, row);
}

// 이벤트
const setEvent = () => {
    generateBtnEl.addEventListener('click', renderElevator);
}

// 초기화
(() =>{
    setEvent();
})();