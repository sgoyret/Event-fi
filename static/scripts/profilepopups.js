// Profile popups that are activated when user clicks on an event or group

    const basepopup = '<div class="popup" id="popup">';

    async function popupnav() {
        document.getElementById('membersnav').addEventListener("click", function () {
            const selected = document.getElementsByClassName('navselected');
            console.log(selected);
            for (let element of selected) {
                element.classList.remove('navselected');
            };
            document.getElementById('membersnav').classList.add('navselected');
        });
        document.getElementById('detailsnav').addEventListener("click", function() {
            const selected = document.getElementsByClassName('navselected');
            console.log(selected);
            for (let element of selected) {
                element.classList.remove('navselected');
            };
            document.getElementById('detailsnav').classList.add('navselected');
        });
    };

    async function eventpopup () {
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
                "<div id='detailsnav'> Detalles</div>" +
            "</div>" +
            "<div class='popupcontent'>" +
                "<div class='popupmembers'>" +
                '</div>' +
            "</div>" +
            "<div class='eventdesc'> wonderful event</div>" +
            '<div class="closepopup" id="closepopup"> </div>' +
        "</div>";
    for (let element of document.getElementsByClassName('listevent')) {
        element.addEventListener("click", function(evt) {
            if (evt.target !== this) return;
            document.getElementById('wraper').insertAdjacentHTML('afterbegin', eventpopup);
            popupnav();
            const close = document.getElementById('closepopup');
            close.addEventListener("click", function() {
                document.getElementById('wraper').removeChild(document.getElementById('popup'));
                });
            });
        };
    };

    async function grouppopup () {
        console.log('hey we nailed it!')
        const grouppopup = basepopup +
            '<div class="grouppopup">' +
                "<div class='popupheader'>" +
                    "<div class='grouptitle'> Grupo random</div>" +
                    "<div class='groupimg'> <img src='https://scontent.fmvd1-1.fna.fbcdn.net/v/t1.6435-9/91138397_142569460618578_9003032990434983936_n.png?_nc_cat=103&ccb=1-7&_nc_sid=973b4a&_nc_ohc=kANVgvRdsLsAX-y7miA&_nc_ht=scontent.fmvd1-1.fna&oh=00_AT8CDHH4X_DslZ24jK7kec_aSOWS9DrvcUQ1LUHqnvR2nA&oe=62BDC452' alt=''>" + "</div>"
                    "<div class='popupnav'>" +
                        "<div id='membersnav' class='navselected'> Miembros</div>" +
                        "<div id='eventsnav'> Eventos</div>" +
                    '</div>' +
                "<div class='popupcontent'>" +
                "</div>" +
                "<div class='closepopup' id='closepopup'> </div>" +
            "</div>";
        for (let element of document.getElementsByClassName('listgroup')) {
            element.addEventListener("click", function(evt) {
                if (evt.target !== this) return;
                document.getElementById('wraper').insertAdjacentHTML('afterbegin', grouppopup);
                popupnav();
                const close = document.getElementById('closepopup');
                close.addEventListener("click", function() {
                    document.getElementById('wraper').removeChild(document.getElementById('popup'));
                    });
                });
            };
        };