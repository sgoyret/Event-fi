window.addEventListener("load", function() {
    groupMake();
    grouppopup();
    mainNavbar();
});
    async function popupnav(members, groups, events) {
        // Function that adds aesthetic to the navbar
        if (groups == true) {
            try {
                document.getElementById('groupsnav').addEventListener("click", function() {
                    if (document.getElementById('groupsnav').classList === 'navselected') { 
                    } else {
                        const addmemberbar = document.getElementById('addmember');
                        const membersinfo = document.getElementById('popupmembers');
                        const eventsinfo = document.getElementById('popupevents');
                        const groupsinfo = document.getElementById('popupgroups');
                        if (membersinfo){
                            membersinfo.style.display = "none";
                        }
                        if (eventsinfo) {
                            eventsinfo.style.display = "none";
                        }
                        if (groupsinfo) {
                            groupsinfo.style.display = "unset";
                        }
                        if(addmemberbar) {
                            addmemberbar.style.display = "none";
                        }
                        document.getElementsByClassName('navselected')[0].classList.remove('navselected');
                        document.getElementById('groupsnav').classList.add('navselected');
                        popupnav(members, groups, events);
                    }
            });
        } catch (error) {
            console.log(error)
        }
    }
        if (members === true) {
            try {
                document.getElementById('membersnav').addEventListener("click", function() {
                    if (document.getElementById('membersnav').classList === 'navselected') { 
                    } else {
                        const membersinfo = document.getElementById('popupmembers');
                        const eventsinfo = document.getElementById('popupevents');
                        const groupsinfo = document.getElementById('popupgroups');
                        if (membersinfo){
                            membersinfo.style.display = "unset";
                        }
                        if (eventsinfo) {
                            eventsinfo.style.display = "none";
                        }
                        if (groupsinfo) {
                            groupsinfo.style.display = "none";
                        }
                        document.getElementById('addmember').style.display = "flex";
                        document.getElementsByClassName('navselected')[0].classList.remove('navselected');
                        document.getElementById('membersnav').classList.add('navselected');
                        popupnav(members, groups, events);
                    }
            });
        } catch (error) {
            console.log(error)
        }
}
        if (events === true) {
            try {
                document.getElementById('eventsnav').addEventListener("click", function() {
                    if (document.getElementById('eventsnav').classList === 'navselected') { 
                    } else {
                        const addmemberbar = document.getElementById('addmember');
                        const membersinfo = document.getElementById('popupmembers');
                        const eventsinfo = document.getElementById('popupevents');
                        const groupsinfo = document.getElementById('popupgroups');
                        if (membersinfo){
                            membersinfo.style.display = "none";
                        }
                        if (eventsinfo) {
                            eventsinfo.style.display = "none";
                        }
                        if (groupsinfo) {
                            groupsinfo.style.display = "unset";
                        }
                        if(addmemberbar) {
                            addmemberbar.style.display = "none";
                        }
                        document.getElementsByClassName('navselected')[0].classList.remove('navselected');
                        document.getElementById('eventsnav').classList.add('navselected');
                        popupnav(members, groups, events);
                    }
            });
        } catch (error) {
            console.log(error)
        }
    };
    };

    async function closepopup () {
        const close = document.getElementsByClassName('closepopup')[0];
        close.addEventListener("click", function() {
            document.getElementById('wraper').removeChild(document.getElementById('grouppopup'));
            document.getElementById('wraper').removeChild(document.getElementById('behind'));
            });
    };
    async function addmember(){
        document.getElementById('addsearch').addEventListener('click', function(){
            const group_id = document.getElementsByClassName('popupheaderavatar')[0].id;
            const username = document.getElementById('addtotext').value;
            const request = new XMLHttpRequest();
            request.open('POST', '/api/groups/'+ group_id + '/members')
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify({'username': username}));
            request.onload = function() {
                console.log(request.response);
                const response = JSON.parse(request.response);
                if (response.status == 'success') {
                    const member = document.createElement('div');
                    member.classList.add('listcontact');
                    member.innerHTML = "<div class='image'>"+
                                            "<div class='img'> </div>" +
                                        "</div>" +
                                        "<div class='membername'>" + response.name + "</div>" +
                                        "<div class='memberrole'> </div>" +
                                        "</div>";
                    document.getElementsByClassName('popupcontent')[0].appendChild(member);
                }
            };
        });
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
    async function groupMake() {
        const groupform =
        '<dialog id="groupform">' +
            '<form id="groupdata" method="POST">' +
                    '<label id="groupavatar" for="avatar">' +
                        '<i class="bx bx-camera"></i>' +
                        '<input type="file" id="avatar" name="avatar" accept="image/*" />' +
                    '</label>' +
                '<input name="name" class="creation" placeholder="Nombre"></input>' +
                '<input name="avatar_content" id="avatar_content" style="display: none;"></input>' +
                '<div class="creationbutton" id="creationgroup"> Crear</div>' +
            '</form>' +
            '<div class="closepopup" id="closepopup">' +
                '<i class="bx bx-arrow-back"></i>' +
            '</div>' +
        '</dialog>';
        // When the user clicks on Crear nuevo grupo, next popup shows up...
        if (document.getElementById('addgroup')) {
            document.getElementById('addgroup').addEventListener("click", function() {
                document.getElementById('wraper').insertAdjacentHTML("afterbegin", groupform);
                const filePicker = document.querySelector("#avatar");
                const hiddenAvatarContent = document.querySelector("#avatar_content");
                filePicker.addEventListener("change", function () {
                    const file = filePicker.files[0];
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        hiddenAvatarContent.value = e.target.result;
                        document.getElementById('groupavatar').style.backgroundImage = "url(" + hiddenAvatarContent.value + ")";
                        document.getElementById('groupavatar').style.backgroundSize = "cover";
                    };
                    reader.readAsDataURL(file);
                });
                document.getElementById('groupform').showModal();
                document.getElementById('closepopup').addEventListener("click", function() {
                    document.getElementById('groupform').close();
                    document.getElementById('groupform').remove();
                });
                document.getElementById('creationgroup').addEventListener("click", function() {
                    const form = document.getElementById('groupdata');
                    const formdata = {};
                    const formelements = document.getElementById('groupdata').getElementsByTagName('input');
                    for (let item of formelements) {
                        console.log(item.value)
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
                    request.send(JSON.stringify({'name': formdata.name, 
                                'avatar_content': formdata.avatar_content}));
                    request.onload = function() {
                        const data = request.responseText;
                        console.log(data);
                        };
                        showResponse('Grupo creado', 'ok');
                });
            });
        };
    };
async function grouppopup () {
        // Function that checks if the user clicked on a group from the list and if so, displays the group popup
        for (let element of document.getElementsByClassName('listgroup')) {
            
            element.addEventListener("click", function(evt) {
                if (evt.target !== this) return;
                var request = new XMLHttpRequest();
                request.open('GET', '/api/groups/' + element.id, true);
                request.send();
                request.onload = function() {
                    const groupdata = JSON.parse(request.response);
                    console.log(groupdata);
                    const grouppopup =
                    '<div class="grouppopup" id="grouppopup">' +
                        "<div class='closepopup' id='closepopup'>" +
                            "<i class='bx bx-arrow-back'></i>" +
                        "</div>" +
                        "<div class='popupheader'>" +
                            "<div class='popupheaderavatar' id='" + element.id + "' style='background-image: url(" + groupdata.avatar + ")'> </div>" +
                            "<div class='popupheadertext'>" +
                                "<div class='grouptitle'>" +  groupdata.name + "</div>" +
                                //"<div class='groupimg'> <img src='https://scontent.fmvd1-1.fna.fbcdn.net/v/t1.6435-9/91138397_142569460618578_9003032990434983936_n.png?_nc_cat=103&ccb=1-7&_nc_sid=973b4a&_nc_ohc=kANVgvRdsLsAX-y7miA&_nc_ht=scontent.fmvd1-1.fna&oh=00_AT8CDHH4X_DslZ24jK7kec_aSOWS9DrvcUQ1LUHqnvR2nA&oe=62BDC452' alt=''>" + "</div>" +
                                "</div>" +
                        '</div>' +
                        "<div class='popupnav' id='popupnav'>" +
                            "<div id='membersnav' class='navselected'> Miembros</div>" +
                            "<div id='eventsnav'> Eventos</div>" +
                        '</div>' +
                        '<div class="addmember" id="addmember">' +
                            '<div class="dropdownicon" id="addfromcontacts">'+
                                '<i class="bx bx-down-arrow-alt"></i>' +
                            '<input type="text" placeholder="Añadir miembro" id="addtotext">' +
                            '</div>' +
                            '<div class="searchbutton" id="addsearch">' +
                                '<i class="bx bx-plus"></i>' +
                            '</div>' +
                        '</div>' +
                        "<div class='popupcontent' id='popupcontent'>" +
                            '<div class="popupmembers" id="popupmembers"> </div>' +
                        '</div>' +
                            '<div class="popupevents" id="popupevents" style="display:none;"> </div>' +
                        "</div>" +
                    "</div>" +
                    "</div>";
                    document.getElementById('wraper').insertAdjacentHTML('afterbegin', grouppopup);
                    popupnav(true, null, true);
                    closepopup();
                    addmember();
                    for (let element of groupdata.members){
                        const member = document.createElement('div');
                        member.classList.add('listcontact');
                        if (element.type == 'admin') {
                            member.innerHTML = 
                                "<div class='img' style='background-image: url(" + element.avatar + "')> </div>" +
                                "<div class='memberinfo'>" +
                                    "<div class='membername'>" + element.name + " " + element.last_name + "<i class='bx bx-crown' ></i> </div>" +
                                    "<div class='memberusername'>@" + element.username + "</div>" +
                                "</div>" +
                                "<div class='membermanage'><i class='bx bx-dots-vertical'></i></div>";
                            document.getElementById('popupmembers').appendChild(member);
                        } else {
                            member.innerHTML =
                            "<div class='img' style='background-image: url(" + element.avatar + "')> </div>" +
                            "<div class='memberinfo'>" +
                                "<div class='membername'>" + element.name + " " + element.last_name + "</div>" +
                                "<div class='memberusername'>@" + element.username + "</div>" +
                            "</div>" +
                            "<div class='membermanage'><i class='bx bx-dots-vertical'></i></div>";
                            document.getElementById('popupmembers').appendChild(member);
                        }
                    }
                    if (groupdata.events.length == 0) {
                        for (let element of groupdata.events){
                            const event = document.createElement('div');
                            event.classList.add('listevent');
                            event.innerHTML =
                                "<div class='eventimg' style='background-image: url(" + element.avatar + "')> </div>" +
                                "<div class='eventinfo'>" +
                                    "<div class='eventtitle'>" + element.name + "</div>" +
                                    "<div class='eventdate'>" + element.start_date + "</div>" +
                                "</div>" +
                                "<div class='eventmanage'><i class='bx bx-dots-vertical'></i></div>";
                            document.getElementById('popupevents').appendChild(event);
                        }
                    }
                };
               });            
            };
        };
async function mainNavbar(){
        document.getElementById('groups').addEventListener("click", function() {
            const selected = document.getElementsByClassName('selected');
            console.log(selected);
            for (let element of selected) {
                element.classList.remove('selected');
            };
            document.getElementById('usergroups').classList.remove('none');
            document.getElementById('usercontacts').classList.add('none');
            document.getElementsByClassName('content')[0].id = 'groupscontent';
            this.classList.add('selected');
        });
        document.getElementById('contacts').addEventListener("click", function() {
            const selected = document.getElementsByClassName('selected')
            console.log(selected);
            for (let element of selected) {
                element.classList.remove('selected');
            };
            document.getElementById('usercontacts').classList.remove('none');
            document.getElementById('usergroups').classList.add('none');
            this.classList.add('selected');
            document.getElementById('addcontact').addEventListener("click", function() {
                const request = new XMLHttpRequest();
                const username = document.getElementById('searchcontact').value;
                request.open('POST', '/api/users/contacts', true);
                request.setRequestHeader('Content-Type', 'application/json');
                request.send(JSON.stringify({username: username}));
                request.onload = function() {
                    console.log(request.response);
                    const contact = JSON.parse(request.response);
                    console.log(contact.error);
                    if (contact.error) {
                        return;
                    } else {
                    const contactlist = document.createElement('div');
                    const deletecontact = document.createElement('div');
                    deletecontact.innerHTML = 
                    "<div class='manage'>" +
                    "<div class='manage-button-contact'>" +
                    "<i  id='trash' class='bx bx-user-x'></i>" +
                    "</div>" +
                    "</div>";
                    contactlist.classList.add('listcontact');
                    contactlist.id = contact.user_id;
                    contactlist.innerHTML =
                    "<div clasavatar_contents='image'>"+
                        "<div class='img' style='background-image: url("+ contact.avatar + ")'> </div>" +
                    "</div>" +
                    "<div class='info'>" +
                        "<p>" + contact.name + ' ' + contact.last_name + "</p>" +
                        "<p>@" + contact.username + "</p>" +
                    "</div>";
                    if (document.getElementById('nocontacts')) {
                        document.getElementById('nocontacts').remove();
                    }
                    document.getElementById('usercontacts').appendChild(contactlist);
                    deletecontact.addEventListener("click", function() {
                        const contactminipopup =
                        '<div class="minipopup" id="minipopup">' +
                                    '<p>¿Quieres eliminar este contacto?</p>' +
                                    '<div class="minipopupbtn">' +
                                        '<button class="minipopup-button">Si</button>' +
                                        '<button class="minipopup-button">No</button>' +
                                    '</div>' +
                        '</div>';
                        document.getElementById('wraper').insertAdjacentHTML('afterbegin', contactminipopup);
                        for (let button of document.getElementsByClassName('minipopup-button')) {
                            button.addEventListener("click", function() {
                                if (this.innerHTML == 'Si') {            
                                const request = new XMLHttpRequest();
                                request.open('DELETE', '/api/users/contacts/');
                                request.setRequestHeader('Content-Type', 'application/json');
                                request.send(JSON.stringify({'user_id': contact.user_id}));
                                request.onload = function() {
                                console.log(request.response);
                                document.getElementById('minipoup').remove();
                                };
                            } else {
                                document.getElementById('minipopup').remove();
                            }  
                            });
                        }
                    });
                    contactlist.appendChild(deletecontact);
                };
            };
        });
    });
}
    // Listener for the main navbar to orientate the user to the right page