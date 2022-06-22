// Profile buttons for deleting, editing and adding events and groups( if admin), or leaving an event if normal user.
function groups_redirect () {
    // Displays the group page when redirected from dashboard
    const selected = document.getElementsByClassName('selected');
    console.log(selected);
    for (let element of selected) {
        element.classList.remove('selected');
    };
    document.getElementById('usergroups').classList.remove('none');
    document.getElementById('userevents').classList.add('none');
    document.getElementById('usercontacts').classList.add('none');
    document.getElementById('groups').classList.add('selected');
};

window.addEventListener("load", function() {
    console.log("Profile buttons loaded");
    const eventminipopup = 
        '<div class="minipopup" id="minipopup">' +
                    '<p>¿Abandonas el evento?</p>' +
                    '<div class="minipopupbtn">' +
                        '<button class="minipopup-button">Si</button>' +
                        '<button class="minipopup-button">No</button>' +
                    '</div>' +
        '</div>';
        const groupminipopup = 
        '<div class="minipopup" id="minipopup">' +
                    '<p>¿Quieres abandonar el grupo?</p>' +
                    '<div class="minipopupbtn">' +
                        '<button class="minipopup-button">Si</button>' +
                        '<button class="minipopup-button">No</button>' +
                    '</div>' +
        '</div>';
        const contactminipopup =
        '<div class="minipopup" id="minipopup">' +
                    '<p>¿Quieres eliminar este contacto?</p>' +
                    '<div class="minipopupbtn">' +
                        '<button class="minipopup-button">Si</button>' +
                        '<button class="minipopup-button">No</button>' +
                    '</div>' +
        '</div>';
    for (let element of document.getElementsByClassName('manage-button')) {
        console.log("lol")
        element.addEventListener("click", function() {
            let event_id = element.parentElement.parentElement.id
            document.getElementById('wraper').insertAdjacentHTML('afterbegin', eventminipopup);
            const buttons = document.getElementsByClassName('minipopup-button');
            for (let button of buttons) {
                button.addEventListener("click", function() {
                    if (button.innerHTML == "Si") {
                        let request = new XMLHttpRequest();
                        let user_id = document.getElementsByClassName('avatar')[0].id
                        console.log('user and event id ', user_id, ' ', event_id)
                        request.open("DELETE", "api/events/"+ event_id +"/members")
                        request.setRequestHeader('Content-Type', 'application/json');
                        request.setRequestHeader('Access-Control-Allow-Origin', '*');
                        request.setRequestHeader('Access-Control-Allow-Headers', '*');
                        request.send(JSON.stringify({'user_id': user_id}));
                        /* check request response */
                        request.onload = () => {
                            if (request.status == 200) {
                                console.log("you have been removed from the event");
                                document.location.href = '/user';
                            }
                            console.log(request.text);
                        }
                        
                            

                    };
                    document.getElementById('wraper').removeChild(document.getElementById('minipopup'));
                });
            };
        });
    };
    for (let element of document.getElementsByClassName('manage-button-group')) {
        element.addEventListener("click", function() {
            let group_id = element.parentElement.parentElement.id
            document.getElementById('wraper').insertAdjacentHTML('afterbegin', groupminipopup);
            const buttons = document.getElementsByClassName('minipopup-button');
            for (let button of buttons) {
                button.addEventListener("click", function() {
                    if (button.innerHTML == "Si") {
                        let request = new XMLHttpRequest();
                        let user_id = document.getElementsByClassName('avatar')[0].id
                        console.log('user and event id ', user_id, ' ', group_id)
                        request.open("DELETE", "api/groups/" + group_id)
                        request.setRequestHeader('Content-Type', 'application/json');
                        request.setRequestHeader('Access-Control-Allow-Origin', '*');
                        request.setRequestHeader('Access-Control-Allow-Headers', '*');
                        request.send(JSON.stringify({'user_id': user_id}));
                        /* check request response */
                        request.onload = () => {
                            if (request.status == 200) {
                                console.log("you have been removed from the event");
                            }
                            console.log(request.responseText);
                        };
                    } else {
                        console.log('entre?')
                        document.getElementById('wraper').removeChild(document.getElementById('minipopup'))
                    }
                });
            };
        })};
        for (let element of document.getElementsByClassName('manage-button-contact')) {
            console.log('entre al for');
            element.addEventListener("click", function() {
                let contact_id = element.parentElement.parentElement.id
                document.getElementById('wraper').insertAdjacentHTML('afterbegin', contactminipopup);
                const buttons = document.getElementsByClassName('minipopup-button');
                for (let button of buttons) {
                    button.addEventListener("click", function() {
                        if (button.innerHTML == "Si") {
                            let request = new XMLHttpRequest();
                            request.open("DELETE", "api/users/contacts")
                            console.log(contact_id)
                            request.setRequestHeader('Content-Type', 'application/json');
                            request.setRequestHeader('Access-Control-Allow-Origin', '*');
                            request.setRequestHeader('Access-Control-Allow-Headers', '*');
                            request.send(JSON.stringify({'user_id': contact_id}));
                            /* check request response */
                            request.onload = () => {
                                if (request.status == 200) {
                                }
                                console.log(request.responseText);
                            };
                        } else {
                            console.log('entre?')
                            document.getElementById('wraper').removeChild(document.getElementById('minipopup'))
                        }
                    });
                }
            });
        };
});