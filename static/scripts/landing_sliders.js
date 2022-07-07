const mySlide = document.querySelectorAll('.myslider');
    dot = document.querySelectorAll('.dot');
let counter = 1;
slidefun(counter);

let timer = setInterval(autoslide, 8000);
    function autoslide() {
    counter += 1;
    slidefun(counter);
}
function plusSlide(n) {
counter +=n;
slidefun(counter);
resetTimer();
}
function currentSlide(n) {
    counter = n;
    slidefun(counter);
    resetTimer();
}
function resetTimer() {
    clearInterval(timer);
    timer = setInterval(autoslide, 8000);
}
function slidefun(n){
    let i;
    for(i=0; i<mySlide.length; i++){
        mySlide[i].style.display ="none";
    }
    for(i=0; i<dot.length; i++){
        dot[i].classList.remove('active');
    }
    if(n > mySlide.length){
        counter = 1;
    }
    if(n < 1){
        counter = mySlide.length;
    }
    mySlide[counter -1].style.display = "block";
    dot[counter -1].classList.add('active');
}