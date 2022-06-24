window.addEventListener("load", function() {

    async function popupnav(members, groups, events) {
        // Function that adds aesthetic to the navbar
        if (groups) {
        try {
            document.getElementById('groupsnav').addEventListener("click", function() {
                if (document.getElementById('groupsnav').classList === 'navselected') {
                 console.log("hola!")   
                } else {
                    const selected = document.getElementsByClassName('navselected');
                    const event_id = document.getElementsByClassName('popupheaderavatar')[0].id;
                    const request = new XMLHttpRequest();
                    request.open('GET', '/api/events/' + event_id + '/groups')
                    request.setRequestHeader('Content-Type', 'application/json');
                    request.setRequestHeader('Access-Control-Allow-Origin', '*');
                    request.setRequestHeader('Access-Control-Allow-Headers', '*');
                    request.send();
                    request.onload = function() {
                        const data = JSON.parse(request.responseText)
                        console.log(data)
                    console.log(selected);
                    for (let element of selected) {
                        element.classList.remove('navselected');
                    };
                    document.getElementById('groupsnav').classList.add('navselected');
                    document.getElementsByClassName('popupcontent')[0].innerHTML = ''
                    if (groups) {
                        for (let element of groups) {
                            const group = document.createElement('div');
                            group.classList.add('listed');
                            group.innerHTML = "<div class='memberavatar'> </div>" +
                                                "<div class='membername'>" + element.name + "</div>" +
                                                "</div>";
                            document.getElementsByClassName('popupcontent')[0].appendChild(group);
                        }
                        popupnav(members, groups, events);
                }
            };
        };
    });
        } catch (error) {
            console.log(error)
        }
    }

        try {
            document.getElementById('membersnav').addEventListener("click", function () {
                if (document.getElementById('membersnav').classList.contains('navselected')){
                } else {
                    const selected = document.getElementsByClassName('navselected');
                    for (let element of selected) {
                        element.classList.remove('navselected');
                    };
                    document.getElementById('membersnav').classList.add('navselected');
                    document.getElementsByClassName('popupcontent')[0].innerHTML = ''
                    document.getElementById('popupnav').insertAdjacentHTML("afterend",
                    '<div class="addmember" id="addmember">' +
                        '<div class="dropdownicon" id="addfromcontacts">'+
                            '<i class="bx bx-down-arrow-alt"></i>' +
                            '<input type="text" placeholder="Añadir miembro" id="addtotext">' +
                        '</div>' +
                        '<div class="searchbutton" id="addsearch">' +
                            '<i class="bx bx-plus"></i>' +
                        '</div>' +
                    '</div>');
                    if (members) {
                        for (let element of members){
                            const member = document.createElement('div');
                            member.classList.add('listcontact');
                            if (element.type == 'admin') {
                                member.innerHTML = "<div class='image'>"+
                                                        "<div class='img'> </div>" +
                                                    "</div>" +
                                                    "<div class='membername'>" + element.name + "</div>" +
                                                    "<div class='memberrole'> <i class='bx bx-crown' ></i> </div>" +
                                                    "</div>";
                                document.getElementById('popupcontent').appendChild(member);
                            } else {
                                member.innerHTML =
                                "<div class='image'>"+
                                        "<div class='img'> </div>" +
                                "</div>" +
                                "<div class='membername'>" + element.name + ' ' + element.last_name + "</div>" +
                                "<div class='memberusername'> @" + element.username + "</div>" +
                                "<div class='memberrole'> </div>" +
                                "</div>";
                                document.getElementById('popupcontent').appendChild(member);
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }    
        if (events) {
        try {
            document.getElementById('eventsnav').addEventListener("click", function () {
                if (document.getElementById('eventsnav').classList.contains('navselected')) {
                } else {
                const selected = document.getElementsByClassName('navselected');
                for (let element of selected) {
                    element.classList.remove('navselected');
                };
                document.getElementById('eventsnav').classList.add('navselected');
                document.getElementsByClassName('popupcontent')[0].innerHTML = ''
                document.getElementById('grouppopup').removeChild(document.getElementById('addmember'))
                    for (let element of events) {
                        const event = document.createElement('div');
                        event.classList.add('listevent');
                        event.innerHTML = 
                        "<div class='image'>"+
                            "<div class='img'> </div>" +
                        "</div>" +
                        "<div class='info'>" +
                            "<div class='eventname'>" + element.name + "</div>" +
                            "<div class='eventdate'>" + element.start_date + "</div>" +
                        "</div>";

                        document.getElementsByClassName('popupcontent')[0].appendChild(event);
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        document.getElementById('eventsnav').addEventListener("click", function () {
            if (document.getElementById('eventsnav').classList.contains('navselected')) {
            } else {
            const selected = document.getElementsByClassName('navselected');
            for (let element of selected) {
                element.classList.remove('navselected');
            };
            document.getElementById('eventsnav').classList.add('navselected');
            document.getElementsByClassName('popupcontent')[0].innerHTML = ''
            document.getElementById('grouppopup').removeChild(document.getElementById('addmember'))
            const noevents = document.createElement('div')
            noevents.classList.add('noevent')
            noevents.innerHTML = 'Este grupo no tiene ningún evento proximamente'
            document.getElementsByClassName('popupcontent')[0].appendChild(noevents)
            }
        });
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
            console.log("hola")
            const group_id = document.getElementsByClassName('popupheaderavatar')[0].id;
            const username = document.getElementById('addtotext').value;
            const request = new XMLHttpRequest();
            request.open('POST', '/api/groups/'+ group_id + '/members')
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify({'username': username}));
            request.onload = function() {
                console.log(request.response);
            };
        });
    }
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
                            "<div class='popupheaderavatar' id='" + element.id + "'> </div>" +
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
                            '<div class="popupmembers" id="popupmembers"> </div>'+
                        "</div>" +
                    "</div>" +
                    "</div>";
                    document.getElementById('wraper').insertAdjacentHTML('afterbegin', grouppopup);
                    popupnav(groupdata.members, null, groupdata.events);
                    closepopup();
                    addmember();
                    for (let element of groupdata.members){
                        const member = document.createElement('div');
                        member.classList.add('listcontact');
                        if (element.type == 'admin') {
                            member.innerHTML = "<div class='image'>"+
                                                    "<div class='img'> </div>" +
                                                "</div>" +
                                                "<div class='membername'>" + element.name + "</div>" +
                                                "<div class='memberrole'> <i class='bx bx-crown' ></i> </div>" +
                                                "</div>";
                            document.getElementById('popupmembers').appendChild(member);
                        } else {
                            member.innerHTML =
                             "<div class='image'>"+
                                     "<div class='img'> </div>" +
                             "</div>" +
                            "<div class='membername'>" + element.name + "</div>" +
                            "<div class='memberrole'> </div>" +
                            "</div>";
                            document.getElementById('popupmembers').appendChild(member);
                        }
                    }
                };
               });            
            };
        };
    // Listener for the main navbar to orientate the user to the right page
    this.document.querySelector('#groups').addEventListener("click", function() {
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
    this.document.querySelector('#contacts').addEventListener("click", function() {
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
            };
        });
    });

    grouppopup();
});