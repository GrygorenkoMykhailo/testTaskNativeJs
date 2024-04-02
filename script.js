
const input = document.querySelector("input");
const button = document.querySelector("button");
const content = document.querySelector(".content");
let [ isMousePressed, startCoords ] = [false, [0,0]];
const div = document.querySelector(".selection");

button.addEventListener('click',() => {
    content.innerHTML = "";
    let string = input.value.split('');
    string.forEach(c => {
        content.innerHTML += '<span>' + c + '</span>';
    })
    selectSpans();
})

document.addEventListener('mousedown', (e) => {
    if(e.target.tagName === "HTML"){        
        isMousePressed = true;
        startCoords = [e.screenX, e.screenY];
    }
    const spans = document.querySelectorAll("span");
    spans.forEach(s => s.style.color = "black");
})

document.addEventListener('mousemove', (e) => {
    if(isMousePressed){
        moveSelection(e);
        div.style.display = 'block';
        console.log(startCoords, e.screenX, e.screenY);
    }
    colorizeSelectedSpans();
})

document.addEventListener('mouseup', () => {
    div.style.display = 'none';
    isMousePressed = false;
})

function moveSelection(e){
    const deltaX = e.pageX - startCoords[0];
    const deltaY = e.pageY - startCoords[1];
    const width = Math.abs(deltaX); 
    const height = Math.abs(deltaY);
    const left = deltaX < 0 ? e.pageX : startCoords[0]; 
    const top = deltaY < 0 ? e.pageY : startCoords[1]; 
    div.style.width = width + 'px';
    div.style.height = height + 'px';
    div.style.left = left + 'px'; 
    div.style.top = top + 'px'; 
}

function selectSpans() {
    const spans = document.querySelectorAll("span");

    spans.forEach((s) => {
        s.addEventListener('mousedown', (e) => {
            s.style.position = "absolute";
            s.selected = true;
            s.startCoords = [e.clientX, e.clientY];
            console.log(s.startCoords)
        });

        s.addEventListener('mousemove', (e) => {
            console.log('move')
            if (s.selected) {
                s.style.top = e.clientY - 3 + 'px';
                s.style.left = e.clientX - 3 + 'px';
            }
        });

        s.addEventListener('mouseup', (e) => {
            console.log(s.startCoords)
            s.selected = false;
            handleSwap(s);
        });
    });
}

function handleSwap(startSpan){
    const spans = document.querySelectorAll("span");
    spans.forEach((s) => {
        if (s !== startSpan && isOverlapping(startSpan, s)) {
            const tempTop = s.style.top;
            const tempLeft = s.style.left;
            s.style.top = startSpan.startCoords[1] + 'px';
            s.style.left = startSpan.startCoords[0] + 'px';
            startSpan.style.top = tempTop;
            startSpan.style.left = tempLeft;
            s.selected = false;
        }
    });
}

function isOverlapping(span1, span2) {
    const rect1 = span1.getBoundingClientRect();
    const rect2 = span2.getBoundingClientRect();
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

function colorizeSelectedSpans() {
    const spans = document.querySelectorAll("span");

    spans.forEach((s) => {
        const rectSpan = s.getBoundingClientRect();
        const rectDiv = div.getBoundingClientRect();

        if (rectSpan.left < rectDiv.right && rectSpan.right > rectDiv.left &&
            rectSpan.top < rectDiv.bottom && rectSpan.bottom > rectDiv.top) {
            s.style.color = "red"; 
        } 
    });
}