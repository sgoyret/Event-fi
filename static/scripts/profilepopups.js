// Profile popups that are activated when user clicks on an event or group
window.addEventListener("load", function() {
    const basepopup = '<div class="popup" id="popup">';
    if (document.getElementById('events').contains(document.getElementsByClassName('selected')[0])) {
        console.log("hey!")
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
                "<div class='tofav'> Anadir a Favoritos</div>" +
                '<div class="closepopup" id="closepopup"> </div>' +
            "</div>";
        for (let element of document.getElementsByClassName('listed')) {
            element.addEventListener("click", function() {
                document.getElementById('wraper').insertAdjacentHTML('afterbegin', eventpopup);
                const close = document.getElementById('closepopup');
                close.addEventListener("click", function() {
                    document.getElementById('wraper').removeChild(document.getElementById('popup'));
                });
            });
        };
    if (document.getElementById('groups').contains(document.getElementsByClassName('selected')[0])) {
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
        for (let element of document.getElementsByClassName('listed')) {
            element.addEventListener("click", function() {
                document.getElementById('wraper').insertAdjacentHTML('afterbegin', grouppopup);
                const close = document.getElementById('closepopup');
                close.addEventListener("click", function() {
                    document.getElementById('wraper').removeChild(document.getElementById('popup'));
                    });
                });
            };
        };
    };
});