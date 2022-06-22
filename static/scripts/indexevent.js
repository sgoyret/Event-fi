async function eventpopup () {
    // Function that checks if the user clicked on an event from the list and if so, displays the event popup
    const basepopup =  '<div class="behind" id="behind"> </div>' +
    '<div class="popup" id="popup">' +
    "<div class='closepopup' id='closepopup'>" +
        "<i class='bx bx-arrow-back'></i>" +
     '</div>';

    const back = document.getElementById('wraper').innerHTML;
    console.log(back)
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
                    '<div class="popupheaderavatar" id="' + element.id + '"> </div>' +
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
                    '<div class="searchcontact">' +
                        '<input type="text" placeholder="Añadir a mis contactos" id="searchcontact">' +
                        '<div class="searchbutton" id="addcontact">' +
                            '<i class="bx bx-plus"></i>' +
                        '</div>' +
                    '</div>' +
                    "<div class='popupmembers'>" +
                    '</div>' +
                "</div>" +
                "<div class='eventdesc'> wonderful event</div>" +
            "</div>" +
            "</div>";
            document.getElementById('wraper').insertAdjacentHTML('afterbegin', eventpopup);
            if (eventdata.members){
                for (let element of eventdata.members) {
                    const member = document.createElement('div');
                    member.classList.add('listed');
                    member.innerHTML = "<div class='memberavatar'> </div>" +
                                            "<div class='membername'>" + element.name + "</div>" +
                                            "<div class='memberrole'>" + element.type + "</div>";
                        document.getElementsByClassName('popupmembers')[0].appendChild(member);
                    }
                    popupnav(eventdata.members, eventdata.groups);
                    closepopup();
            };
        };
    });
}
};
window.addEventListener("load", function() {
    eventpopup();
});