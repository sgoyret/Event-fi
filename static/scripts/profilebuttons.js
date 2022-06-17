// Profile buttons for deleting, editing and adding events and groups(if admin), or leaving an event if normal user.
window.addEventListener("load", function() {
    console.log("Profile buttons loaded");
    const minipopup = 
        '<div class="minipopup" id="minipopup">' +
                    '<p>¿Quieres abandonar el grupo?</p>' +
                    '<div class="minipopupbtn">' +
                        '<button class="minipopup-button">Si</button>' +
                        '<button class="minipopup-button">No</button>' +
                    '</div>' +
        '</div>';
    for (let element of document.getElementsByClassName('manage-button')) {
        console.log("lol")
        element.addEventListener("click", function() {
            const popup = document.createElement('div');
            popup.innerHTML = minipopup;
            popup.classList.add('minipopup');
            document.getElementById('wraper').insertAdjacentHTML('afterbegin', minipopup);
            const buttons = document.getElementsByClassName('minipopup-button');
            for (let button of buttons) {
                button.addEventListener("click", function() {
                    if (button.innerHTML == "Si") {
                        console.log("Si");
                    };
                    document.getElementById('wraper').removeChild(document.getElementById('minipopup'));
                });
            };
        });
    };
});