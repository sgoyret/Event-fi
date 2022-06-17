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
            let event_id = element.parentElement.parentElement.id
            const popup = document.createElement('div');
            popup.innerHTML = minipopup;
            popup.classList.add('minipopup');
            document.getElementById('wraper').insertAdjacentHTML('afterbegin', minipopup);
            const buttons = document.getElementsByClassName('minipopup-button');
            for (let button of buttons) {
                button.addEventListener("click", function() {
                    if (button.innerHTML == "Si") {
                        let request = new XMLHttpRequest();
                        let user_id = document.getElementsByClassName('avatar')[0].id
                        console.log('user and event id ', user_id, ' ', event_id)
                        request.open("DELETE", "api/events/"+event_id+"/members")
                        request.setRequestHeader('Content-Type', 'application/json');
                        request.setRequestHeader('Access-Control-Allow-Origin', '*');
                        request.setRequestHeader('Access-Control-Allow-Headers', '*');
                        request.send(JSON.stringify({'user_id': user_id}));
                        /* check request response */
                        request.onload = () => {
                            if (request.status == 200) {
                                console.log("you have been removed from the event");
                                document.location.href = '/user'
                            }
                            console.log(request.text);
                        }
                        
                            

                    };
                    document.getElementById('wraper').removeChild(document.getElementById('minipopup'));
                });
            };
        });
    };
});