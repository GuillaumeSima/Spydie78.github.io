
//if we click on the button play, page main.html is call 
document.getElementById('btnPlay').onclick = function () {
    location.href = "main.html";
};

//if we click on the button read, the block instruction is visible and the button read disappears 
document.getElementById('btn-read').onclick = function () {
    document.getElementById('instruction').style.display = "block";
    document.getElementById('btn-read').style.visibility = "hidden";
}