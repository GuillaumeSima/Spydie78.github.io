const resultElement = document.getElementById('result');
const explicationElement = document.getElementById('explication')

//if we click on the button restart, page index.html is call 
document.getElementById('btnRestart').onclick = function () {
    location.href = "index.html";
};
//recover the data of the page main.html
var result = sessionStorage.getItem('gameResult');
var explication = sessionStorage.getItem('explication');

//change the color of the text according to the result and add result in the header 
if (result == "GAME OVER") {
    resultElement.innerText = result;
    resultElement.style.color = "red";
}
else if (result == "YOU WIN") {
    resultElement.innerText = result;
    resultElement.style.color = "green";
}

//add explication in the block 
explicationElement.innerText = explication;