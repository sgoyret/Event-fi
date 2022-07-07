const cards = document.getElementsByClassName('card__content'); 
//click
for (let card of cards) {
    card.addEventListener('click', () =>{
        card.classList.toggle('flipcard')
    });
}


function social_media_ln_fp(){
    const social_ln_fp= document.getElementsByClassName('ln_btn_fp');
    social_ln_fp.onclick = function(social_media_ln_fp){
        this.window.location.href = "https://www.linkedin.com/in/felipe-p%C3%A9rez-86a77b165/"
    }
}

