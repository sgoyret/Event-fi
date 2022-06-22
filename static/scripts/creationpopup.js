    document.getElementById('create').addEventListener("click", function () {creationPopup()}, false);
    
    async function creationPopup() { 
        const creationpopup = 
        '<div class="popup" id="eventcreate">' +
            '<div class="selection" id="selection">'+
                '<div class="event picked" id="eventmake"> Crear evento </div>'+
                '<div class="group" id="groupmake"> Crear grupo </div>'+
            '</div>'+
            '<div id="form">' +
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
            '</form>' +
            '</div>' + 
            '<div id="closepopup class="closepopup">'+"<i id=closepopup class='closepopup bx bx-arrow-back'></i>" + '</div>' +
        '</div>';
    document.getElementById('sidebar').style.display = "none";
    document.getElementById('wraper').insertAdjacentHTML("afterbegin", creationpopup);
    document.getElementById('closepopup').addEventListener("click", function() {
        document.getElementById('wraper').removeChild(document.getElementById('eventcreate'));
        document.getElementById('sidebar').style.display = "unset";
    });
    document.getElementById('creationevent').addEventListener("click", function() {eventForm()}, false);
    // Add a click listener for create a group button
    document.getElementById('groupmake').addEventListener("click", function () {groupMake()}, false);
    // Add a click listener for create an event button
    document.getElementById('eventmake').addEventListener("click", function() {eventMake()}, false);
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
        for (let item of formelements) {
            if (item.value == '') {
                showResponse('Debes rellenar todos los campos');
                return;
            } else {
                formdata[item.name] = item.value;
            }
        }
        console.log(formdata)
        document.getElementById('eventcreate').removeChild(document.getElementById('form'));
        document.getElementById('eventcreate').removeChild(document.getElementById('selection'));
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
            if (data) {
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
                        } else {
                            formdata.groups.push(group_id)
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
                creationPopup()
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
                        creationPopup()
                        }, false);
                    if (data) {
                        for (let item of data) {
                            document.getElementById('add').innerHTML +=
                            '<div class="addgroup">' +
                                '<div class="addgroupname">' + item.username + '</div>' +
                                '<div class="addgroupbutton" id="' + item.user_id + '"> Añadir </div>' +
                            '</div>';
                        }
                        formdata['members'] = [];
                        for (let element of document.getElementsByClassName('addgroupbutton')) {
                            element.addEventListener("click", function() {
                                const contact_id = element.id;
                                console.log(contact_id);
                                if (formdata.members.some( element => element.user_id == contact_id )){
                                } else {
                                    formdata['members'].push({'user_id':contact_id});
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
                const data = JSON.parse(request.responseText);
                console.log(data);
            }
            document.getElementById('wraper').removeChild(document.getElementById('eventcreate'));
        document.getElementById('sidebar').style.display = 'unset';
        }, false);
    }
    async function groupMake() {
        const groupform = 
        '<form id="groupdata" method="POST">' +
            '<input name="name" class="creation" placeholder="Nombre"></input>' +
            '<div class="creationbutton" id="creationgroup"> Crear</div>' +
        '</form>';
        document.getElementById('form').innerHTML = groupform;
        document.getElementById('eventmake').classList.remove('picked');
        document.getElementById('groupmake').classList.add('picked');
        document.getElementById('groupmake').addEventListener("click", function () {groupMake()}, false);
        // Add a click listener for create an event button
        document.getElementById('eventmake').addEventListener("click", function() {eventMake()}, false);
        // Add a click listener for Crear button(group only) 
        document.getElementById('creationgroup').addEventListener("click", function() {
            const form = document.getElementById('groupdata');
            var formdata = {};
            for (let item of form) {
                if (item.value == '') {
                    showResponse('Debes rellenar todos los campos');
                    return;
                } else {
                    formdata[item.name] = item.value;
                }
            }
            console.log(formdata);
            const request = new XMLHttpRequest();
            request.open('POST', '/api/groups');
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.setRequestHeader('Access-Control-Allow-Headers', '*');
            request.send(JSON.stringify(formdata));
            request.onload = function() {
                const data = request.responseText;
                console.log(data);
                };
                showResponse();
                document.getElementById('wraper').removeChild(document.getElementById('eventcreate'));
            document.getElementById('sidebar').style.display = 'unset';
        });

    };

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