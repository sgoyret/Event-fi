window.addEventListener("load", function() {
    const basepopup = '<div class="popup" id="popup">' +
                        "<div class='closepopup' id='closepopup'> </div>";

    async function popupnav() {
        // Function that adds aesthetic to the navbar
        document.getElementById('groupsnav').addEventListener("click", function() {
                const selected = document.getElementsByClassName('navselected');
                console.log(selected);
                for (let element of selected) {
                    element.classList.remove('navselected');
                };
                document.getElementById('groupsnav').classList.add('navselected');
            });
            document.getElementById('membersnav').addEventListener("click", function () {
                const selected = document.getElementsByClassName('navselected');
                console.log(selected);
                for (let element of selected) {
                    element.classList.remove('navselected');
                };
                document.getElementById('membersnav').classList.add('navselected');
                console.log(document.getElementById('membersnav').classList);
            });
            document.getElementById('eventsnav').addEventListener("click", function () {
                const selected = document.getElementsByClassName('navselected');
                console.log(selected);
                for (let element of selected) {
                    element.classList.remove('navselected');
                };
                document.getElementById('eventsnav').classList.add('navselected');
            });
        };

    async function closepopup () {
        const close = document.getElementsByClassName('closepopup')[0];
        close.addEventListener("click", function() {
            document.getElementById('wraper').removeChild(document.getElementById('popup'));
            });
        console.log()
    };

    async function eventpopup () {
        // Function that checks if the user clicked on an event from the list and if so, displays the event popup
        console.log('hey we nailed it!x2')
        const eventpopup = basepopup +
        '<div class="eventpopup">' +
            '<div class="popupheader">' +
                '<div class="popupheaderavatar"> </div>' +
                '<div class="popupheadertext">' +
                    "<div class='eventitle'> Evento random</div>" +
                    //"<div class='eventimg'> <img src='https://scontent.fmvd1-1.fna.fbcdn.net/v/t1.6435-9/91138397_142569460618578_9003032990434983936_n.png?_nc_cat=103&ccb=1-7&_nc_sid=973b4a&_nc_ohc=kANVgvRdsLsAX-y7miA&_nc_ht=scontent.fmvd1-1.fna&oh=00_AT8CDHH4X_DslZ24jK7kec_aSOWS9DrvcUQ1LUHqnvR2nA&oe=62BDC452' alt=''>" + "</div>"
                    "<div class='eventime'> Eventime </div>" +
                    "<div class='eventlocation'> Holberton</div>" +
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
    for (let element of document.getElementsByClassName('listevent')) {
        element.addEventListener("click", function(evt) {
            if (evt.target !== this) return;
            document.getElementById('wraper').insertAdjacentHTML('afterbegin', eventpopup);
            popupnav();
            closepopup();
        });
    }
};

    async function grouppopup () {
        // Function that checks if the user clicked on a group from the list and if so, displays the group popup
        console.log('hey we nailed it!')
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
        for (let element of document.getElementsByClassName('listgroup')) {
            element.addEventListener("click", function(evt) {
                if (evt.target !== this) return;
                document.getElementById('wraper').insertAdjacentHTML('afterbegin', grouppopup);
                popupnav();
                closepopup();
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