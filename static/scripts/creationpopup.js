    document.getElementById('addevent').addEventListener("click", function () {creationPopup()
        console.log(document.getElementById('location').options[document.getElementById('location').selectedIndex].value)}, false);
    
    async function creationPopup(formdata) { 
        var creationpopup = ''
        if (!formdata) {
            creationpopup = 
            '<div class="popup" id="eventcreate">' +
                '<div id="form">' +
                '<form id="eventdata" method="POST" autocomplete="off">' +
                    '<input name="name" class="creation" placeholder="Titulo"></input>' +
                    '<label id="avatarlabel">' +
                        '<i class="bx bx-camera"></i>' +
                        '<input name="avatar" class="creation" placeholder="Fecha" type="file" accept="image/png, image/gif, image/jpeg"></input>'+
                    '</label>' +
                    '<label for="start_date">Fecha de inicio</label>' +
                    '<input type="datetime-local" name="start_date" id="start_date">' +
                    '<label for="end_date">Fecha de finalización</label>' +
                    '<input type="datetime-local" name="end_date" class="creation"></input>' +
                    '<select id="location" class>' +
                        '<option value> Lugar </option>' +
                    '</select>' +
                    '<input name="description" class="creation" placeholder="Descripcion" style="height: 40%;"></input>' +
                    ' <div class="creationbutton" id="creationevent"> Crear</div>' +
                '</form>' +
                '</div>' + 
                '<div id="closepopup class="closepopup">'+"<i id=closepopup class='closepopup bx bx-arrow-back'></i>" + '</div>' +
            '</div>';
        } else {
            console.log(formdata)
            creationpopup =
            '<div class="popup" id="eventcreate">' +
                '<div id="form">' +
                '<form id="eventdata" method="POST">' +
                    '<input name="name" class="creation" placeholder="Titulo" value=' + formdata.name + '></input>' +
                    '<label id="avatarlabel">' +
                        '<i class="bx bx-camera"></i>' +
                        '<input name="avatar" class="creation" placeholder="Fecha" type="file" accept="image/png, image/gif, image/jpeg"></input>'+
                    '</label>' +
                    '<label for="start_date">Fecha de inicio</label>' +
                    '<input type="datetime-local" name="start_date" id="start_date" value=' + formdata.start_date + '></input>' +
                    '<label for="end_date">Fecha de finalización</label>' +
                    '<input type="datetime-local" name="end_date" class="creation" value=' + formdata.end_date + '></input>' +
                    '<select id="location" class>' +
                        '<option value> Lugar </option>' +
                    '</select>' +
                    '<input name="description" class="creation" placeholder="Descripcion" style="height: 40%;" value=' + formdata.description +'></input>' +
                    ' <div class="creationbutton" id="creationevent"> Crear</div>' +
                '</form>' +
                '</div>' +
                '<div id="closepopup class="closepopup">'+"<i id=closepopup class='closepopup bx bx-arrow-back'></i>" + '</div>' +
            '</div>';
            }
    document.getElementById('footer').style.display = "none";
    document.getElementById('header').style.display = "none";
    document.getElementById('wraper').insertAdjacentHTML("afterbegin", creationpopup);
    document.getElementById('closepopup').addEventListener("click", function() {
        document.getElementById('wraper').removeChild(document.getElementById('eventcreate'));
        document.getElementById('footer').style.display = "unset";
        document.getElementById('header').style.display = "unset";
    });
    getLocations();
    document.getElementById('creationevent').addEventListener("click", function() {eventForm()}, false);
    // Add a click listener for create a group button
    // Add a click listener for create an event button
    // Add a click listener for close button
        /*const request = new XMLHttpRequest();
        request.open('POST', '/api/events/');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.setRequestHeader('Access-Control-Allow-Headers', '*');
        request.send(JSON.stringify(formdata));
        request.onload = function() {
            var data = JSON.parse(request.responseText);
            console.log(data);
            document.getElementById('wraper').removeChild(document.getElementById('eventcreate'));
            document.getElementById('sidebar').style.display = "unset";
            };*/
        };

    async function getLocations() {
        const request = new XMLHttpRequest();
        request.open('GET', '/api/locations');
        request.send();
        request.onload = function (){
            const locations = JSON.parse(request.responseText)
            console.log(locations);
            for (let element of locations){
                const location = document.createElement('option')
                location.value = element.location_id
                location.innerHTML = element.name
                document.getElementById('location').appendChild(location)
            }
        }
}

    async function eventMake() {
        const eventform =
        '<form id="eventdata" method="POST">' +
        '<input name="name" class="creation" placeholder="Titulo"></input>' +
        '<label id="avatarlabel">' +
            '<i class="bx bx-camera"></i>' +
            '<input name="avatar" class="creation" placeholder="Fecha" type="file" accept="image/png, image/gif, image/jpeg"></input>'+
        '</label>' +
        '<label for="start_date">Fecha de inicio</label>' +
        '<input type="datetime-local" name="start_date" id="start_date">' +
        '<label for="end_date">Fecha de finalización</label>' +
        '<input type="datetime-local" name="end_date" class="creation"></input>' +
        '<input name="id" class="creation" placeholder="Lugar"></input>' +
        '<input name="description" class="creation" placeholder="Descripcion" style="height: 40%;"></input>' +
        ' <div class="creationbutton" id="creationevent"> Crear</div>' +
    '</form>';
    document.getElementById('form').innerHTML = eventform;
    document.getElementById('eventmake').classList.add('picked');
    document.getElementById('groupmake').classList.remove('picked');
    document.getElementById('groupmake').addEventListener("click", function () {groupMake()}, false);
    // Add a click listener for create an event button
    document.getElementById('eventmake').addEventListener("click", function() {eventMake()}, false);
    document.getElementById('creationevent').addEventListener("click", function() {eventForm()}, false)
    };

    async function eventForm () {
         // Add a click listener for Crear button (event only) and send data to server
        const formelements = document.getElementById('eventdata').getElementsByTagName('input');
        var formdata = {};
        const location = document.getElementById('location').options[document.getElementById('location').selectedIndex].value
        for (let item of formelements) {
            if (item.value == '' || !location) {
                showResponse('Debes rellenar todos los campos');
                return;
            } else {
                formdata[item.name] = item.value;
            }
        }
        formdata['location'] = location
        console.log(formdata)
        document.getElementById('eventcreate').removeChild(document.getElementById('form'));
        // Now ask to the user if he wants to add members or a group in this same popup'
        document.getElementById('eventcreate').classList.replace('popup', 'addpopup');
        var request = new XMLHttpRequest();
        request.open('GET', '/api/groups');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.setRequestHeader('Access-Control-Allow-Headers', '*');
        request.send();
        request.onload = function() {
            const data = JSON.parse(request.responseText);
            document.getElementById('eventcreate').innerHTML =
            '<div id="closepopup" class="closepopup">'+"<i id=closepopup class='closepopup bx bx-arrow-back'></i>" + '</div>' +
            '<div class="popupheader" id=""> Añade grupos </div>' +
            '<div class="next" id="groupsadded"> Siguiente </div>' +
                '<div class="add" id="add">' +
            '</div>';
            console.log(data)
            if (data.length > 0) {
                for (let item of data) {
                    document.getElementById('add').innerHTML +=
                    '<div class="addgroup">' +
                        '<div class="addgroupname">' + item.name + '</div>' +
                        '<div class="addgroupbutton" id="' + item.group_id + '"><i class="bx bx-plus" ></i> Añadir </div>' +
                    '</div>';
                    
                };
                formdata['groups'] = [];
                for (let element of document.getElementsByClassName('addgroupbutton')) {
                    element.addEventListener("click", function() {
                        const group_id = element.id;
                        console.log(group_id);
                        if (formdata.groups.includes(group_id)) {
                            formdata.groups.splice(formdata.groups.indexOf(group_id), 1);
                            element.classList.remove('picked');
                            element.innerHTML = '<i class="bx bx-plus"></i> Añadir';
                        } else {
                            formdata.groups.push(group_id)
                            element.classList.add('picked');
                            element.innerHTML = '<i class="bx bx-minus"></i>' +
                                                'Quitar';
                        }
                        console.log(formdata);
                    });
                }
            }
            else {
                '<div class="addgroup">' +
                        '<div class="addgroupname">No tienes grupos</div>' +
                    '</div>';
            }
            document.getElementById('closepopup').addEventListener("click", function() {
                document.getElementById('wraper').removeChild(document.getElementById('eventcreate'));
                creationPopup(formdata)
                }, false);
            document.getElementById('groupsadded').addEventListener("click", function() {
                const request = new XMLHttpRequest();
                request.open('GET', '/api/users/contacts');
                request.setRequestHeader('Content-Type', 'application/json');
                request.setRequestHeader('Access-Control-Allow-Origin', '*');
                request.setRequestHeader('Access-Control-Allow-Headers', '*');
                request.send();
                request.onload = function() {
                    const data = JSON.parse(request.responseText);
                    console.log(data);
                    document.getElementById('eventcreate').innerHTML = 
                    '<div id="closepopup" class="closepopup">'+"<i id=closepopup class='closepopup bx bx-arrow-back'></i>" + '</div>' +
                    '<div class="popupheader" id=""> Añade contactos </div>' +
                    '<div class="next" id="contactsadded"> Confirmar </div>' +
                    '<div class="add" id="add">' +
                    '</div>';
                    document.getElementById('closepopup').addEventListener("click", function() {
                        document.getElementById('wraper').removeChild(document.getElementById('eventcreate'));
                        creationPopup(formdata)
                        }, false);
                    if (data) {
                        for (let item of data) {
                            document.getElementById('add').innerHTML +=
                            '<div class="addgroup">' +
                                '<div class="addgroupname">' + item.username + '</div>' +
                                '<div class="addgroupbutton" id="' + item.user_id + '"><i class="bx bx-plus"></i>Añadir </div>' +
                            '</div>';
                        }
                        formdata['members'] = [];
                        for (let element of document.getElementsByClassName('addgroupbutton')) {
                            element.addEventListener("click", function() {
                                const contact_id = element.id;
                                console.log(contact_id);
                                if (formdata.members.some( element => element.user_id == contact_id )){
                                    formdata.members.splice(formdata.members.indexOf(contact_id), 1);
                                    element.classList.remove('picked');
                                    element.innerHTML = '<i class="bx bx-plus"></i> Añadir';
                                } else {
                                    formdata.members.push({user_id: contact_id, role: 'member'})
                                    element.classList.add('picked');
                                    element.innerHTML = '<i class="bx bx-minus"></i>' +
                                                        'Quitar';
                                }
                                console.log(formdata);
                            });
                        }
                    }
                    else {
                        '<div class="addgroup">' +
                                '<div class="addgroupname">No tienes contactos</div>' +
                            '</div>';
                    }
                    sendEventForm(formdata);
                };
            }, false);
        };
};

    async function sendEventForm(formdata) {
        document.getElementById('contactsadded').addEventListener("click", function() {
            const request = new XMLHttpRequest();
            request.open('POST', '/api/events');
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.setRequestHeader('Access-Control-Allow-Headers', '*');
            request.send(JSON.stringify(formdata));
            request.onload = function() {
                const data = request.responseText;
                console.log(data);
            }
            document.getElementById('wraper').removeChild(document.getElementById('eventcreate'));
        document.getElementById('footer').style.display = 'unset';
        document.getElementById('header').style.display = "unset";
        const listevent = document.createElement('div');
        console.log(JSON.parse(request.responseText))
        listevent.id = request.responseText.id ;
        listevent.className = 'listevent';
        listevent.innerHTML =
        "<div class='image'>" +
            "<img src='/images/event.png'>" +
        "</div>" +
        "<div class='info'>" +
            "<p>" + formdata.name + "</p>" +
            "<p>" + formdata.start_date + "</p>" +
        "</div>" +
        "<div class='manage'>" +
            "<div class='manage-button'>" +
                "<i class='bx bx-right-arrow-alt'></i>" +
            "</div>" +
        "</div>";
        if (document.getElementById('noevents')) {
        document.getElementById('noevents').remove();
    }
        document.getElementById('userevents').appendChild(listevent);
        }, false);
    }

    async function showResponse(message, ok) {
        const responsePopup = 
        '<div class="responsepopup" id="response">' +
            '<p>' + message + '<p>' +
            '<div class="status" id="status"> </div>'
        '</div>';
        document.getElementById('wraper').insertAdjacentHTML("afterbegin", responsePopup);
        if (ok) {
            document.getElementById('status').innerHTML =
            "<i class='bx bx-check'></i>"; 
        } else {
            document.getElementById('status').innerHTML =
            "<i class='bx bx-x' ></i>";
        }
        setTimeout(function() {
            document.getElementById('wraper').removeChild(document.getElementById('response'));
        }, 2000);
    }
// Add a click listener for create navbar button