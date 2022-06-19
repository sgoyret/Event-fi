window.addEventListener("load", function() {
    const basepopup =  '<div class="behind" id="behind"> </div>' +
                        '<div class="popup" id="popup">' +
                        "<div class='closepopup' id='closepopup'>" +
                            "<i class='bx bx-arrow-back'></i>" +
                         '</div>';

    async function popupnav(members, groups, events) {
        // Function that adds aesthetic to the navbar
        document.getElementById('groupsnav').addEventListener("click", function() {
                const selected = document.getElementsByClassName('navselected');
                console.log(selected);
                for (let element of selected) {
                    element.classList.remove('navselected');
                };
                document.getElementById('groupsnav').classList.add('navselected');
                for (let element of groups) {
                    const group = document.createElement('div');
                    group.classList.add('listed');
                    group.innerHTML = "<div class='memberavatar'> </div>" +
                                        "<div class='membername'>" + element.name + "</div>" +
                                        "</div>";
                    document.getElementsByClassName('popupcontent')[0].appendChild(group);
                }
            });
            document.getElementById('membersnav').addEventListener("click", function () {
                const selected = document.getElementsByClassName('navselected');
                console.log(selected);
                for (let element of selected) {
                    element.classList.remove('navselected');
                };
                document.getElementById('membersnav').classList.add('navselected');
                console.log(document.getElementById('membersnav').classList);
                for (let element of members) {
                    const member = document.createElement('div');
                    member.classList.add('listed');
                    member.innerHTML = "<div class='memberavatar'> </div>" +
                                        "<div class='membername'>" + element.name + "</div>" +
                                        "<div class='memberrole'>" + element.role + "</div>" +
                                        "</div>";
                    document.getElementsByClassName('popupmembers')[0].appendChild(member);
                }
            });
            document.getElementById('eventsnav').addEventListener("click", function () {
                const selected = document.getElementsByClassName('navselected');
                console.log(selected);
                for (let element of selected) {
                    element.classList.remove('navselected');
                };
                document.getElementById('eventsnav').classList.add('navselected');
                for (let element of events) {
                    const event = document.createElement('div');
                    event.classList.add('listed');
                    event.innerHTML = "<div class='eventavatar'> </div>" +
                                        "<div class='eventname'>" + element.name + "</div>" +
                                        "<div class='eventdate'>" + element.start_date + "</div>";
                    document.getElementsByClassName('popupcontent')[0].appendChild(event);
                }
            });
        };

    async function closepopup () {
        const close = document.getElementsByClassName('closepopup')[0];
        close.addEventListener("click", function() {
            document.getElementById('wraper').removeChild(document.getElementById('popup'));
            document.getElementById('wraper').removeChild(document.getElementById('behind'));
            });
    };

    async function eventpopup () {
        // Function that checks if the user clicked on an event from the list and if so, displays the event popup
    for (let element of document.getElementsByClassName('listevent')) {
        element.addEventListener("click", function(evt) {
            if (evt.target !== this) return;
            var request = new XMLHttpRequest();
            request.open('GET', 'api/events/' + element.id);
            request.send();
            request.onload = function() {
                const eventdata = JSON.parse(request.response);
                console.log(eventdata);
                const eventpopup = basepopup +
                '<div class="eventpopup">' +
                    '<div class="popupheader">' +
                        '<div class="popupheaderavatar"> </div>' +
                        '<div class="popupheadertext">' +
                            "<div class='eventitle'>" +  eventdata.name + "</div>" +
                            //"<div class='eventimg'> <img src='https://scontent.fmvd1-1.fna.fbcdn.net/v/t1.6435-9/91138397_142569460618578_9003032990434983936_n.png?_nc_cat=103&ccb=1-7&_nc_sid=973b4a&_nc_ohc=kANVgvRdsLsAX-y7miA&_nc_ht=scontent.fmvd1-1.fna&oh=00_AT8CDHH4X_DslZ24jK7kec_aSOWS9DrvcUQ1LUHqnvR2nA&oe=62BDC452' alt=''>" + "</div>"
                            "<div class='eventstart'>" + eventdata.start_date + "</div>" +
                            "<div class='eventend'>" + eventdata.end_date + "</div>" +
                            "<div class='eventlocation'>" + eventdata.location + "</div>" +
                    "</div>" +
                "</div>" +
                    "<div class='popupnav'>" +
                        "<div id='membersnav' class='navselected'> Invitados</div>" +
                        "<div id='groupsnav'> Grupos </div>" +
                    "</div>" +
                    "<div class='popupcontent'>" +
                        "<div class='popupmembers'>" +
                        '</div>' +
                    "</div>" +
                    "<div class='eventdesc'> wonderful event</div>" +
                "</div>" +
                "</div>";
                document.getElementById('wraper').insertAdjacentHTML('afterbegin', eventpopup);
                for (let element of eventdata.members) {
                    const member = document.createElement('div');
                    member.classList.add('listed');
                    member.innerHTML = "<div class='memberavatar'> </div>" +
                                            "<div class='membername'>" + element.name + "</div>" +
                                            "<div class='memberrole'>" + element.role + "</div>";
                        document.getElementsByClassName('popupmembers')[0].appendChild(member);
                    }
                    popupnav(eventdata.members, eventdata.groups);
                    closepopup();
                };
        });
    }
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
                    groupdata = JSON.parse(request.response);
                    console.log(groupdata);
                    const grouppopup = basepopup +
                    '<div class="grouppopup">' +
                        "<div class='popupheader'>" +
                            "<div class='popupheaderavatar'> </div>" +
                            "<div class='popupheadertext'>" +
                                "<div class='grouptitle'> Grupo random</div>" +
                                //"<div class='groupimg'> <img src='https://scontent.fmvd1-1.fna.fbcdn.net/v/t1.6435-9/91138397_142569460618578_9003032990434983936_n.png?_nc_cat=103&ccb=1-7&_nc_sid=973b4a&_nc_ohc=kANVgvRdsLsAX-y7miA&_nc_ht=scontent.fmvd1-1.fna&oh=00_AT8CDHH4X_DslZ24jK7kec_aSOWS9DrvcUQ1LUHqnvR2nA&oe=62BDC452' alt=''>" + "</div>" +
                                "</div>" +
                        '</div>' +
                        "<div class='popupnav'>" +
                            "<div id='membersnav' class='navselected'> Miembros</div>" +
                            "<div id='eventsnav'> Eventos</div>" +
                        '</div>' +
                        "<div class='popupcontent'>" +
                        "</div>" +
                    "</div>" +
                    "</div>";
                    document.getElementById('wraper').insertAdjacentHTML('afterbegin', grouppopup);
                    popupnav(eventdata.members, eventdata.events);
                    closepopup();
                };
               });            
            };
        };
    // Listener for the main navbar to orientate the user to the right page
    this.document.querySelector('#events').addEventListener("click", function() {
        const selected = document.getElementsByClassName('selected');
        console.log(selected);
        for (let element of selected) {
            element.classList.remove('selected');
        };
        document.getElementById('userevents').classList.remove('none');
        document.getElementById('usergroups').classList.add('none');
        document.getElementById('usercontacts').classList.add('none');
        this.classList.add('selected');
    });
    this.document.querySelector('#groups').addEventListener("click", function() {
        const selected = document.getElementsByClassName('selected');
        console.log(selected);
        for (let element of selected) {
            element.classList.remove('selected');
        };
        document.getElementById('usergroups').classList.remove('none');
        document.getElementById('userevents').classList.add('none');
        document.getElementById('usercontacts').classList.add('none');
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
        document.getElementById('userevents').classList.add('none');
        this.classList.add('selected');
    });

    grouppopup();
    eventpopup();
});