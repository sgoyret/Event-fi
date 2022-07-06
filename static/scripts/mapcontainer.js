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
async function displayEvent(geojson, eventid) {
mapboxgl.accessToken = 'pk.eyJ1IjoiZGlla2thbiIsImEiOiJjbDFucDY1ZWcwZDg4M2xtanM1ajAxdmw0In0.qWC1IZvfYRzjMzuRqPcbwQ';
console.log(geojson)
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [geojson.geometry.coordinates[0], geojson.geometry.coordinates[1]], // starting position [lng, lat]
    zoom: 16 // starting zoom
});
map.on('load', function() {
  map.resize();
          // create a HTML element for each feature
          const el = document.createElement('div');
          el.classList.add('marker');
          el.addEventListener("click", function() {
                var request = new XMLHttpRequest();
                console.log(eventid)
                request.open('GET','/api/events/' + eventid);
                request.setRequestHeader('Content-Type', 'application/json');
                request.setRequestHeader('Access-Control-Allow-Origin', '*');
                request.setRequestHeader('Access-Control-Allow-Headers', '*');
                request.send();
                request.onload = function() {
                    var data = JSON.parse(request.responseText);
                    console.log(data);
                    const element = document.getElementById('wraper');
                    const eventpopup =
                    '<div class="popup" id="popup">' +
                        '<div class="eventpopup">' +
                            '<div class="popupheader">' +
                                '<div class="popupheaderavatar" style="background-image: url(' + data.avatar + ')"id=' + data._id +'> </div>' +
                                '<div class="popupheadertext">' +
                                    "<div class='eventitle'>" + data.name + "</div>" +
                                    //"<div class='eventimg'> <img src='https://scontent.fmvd1-1.fna.fbcdn.net/v/t1.6435-9/91138397_142569460618578_9003032990434983936_n.png?_nc_cat=103&ccb=1-7&_nc_sid=973b4a&_nc_ohc=kANVgvRdsLsAX-y7miA&_nc_ht=scontent.fmvd1-1.fna&oh=00_AT8CDHH4X_DslZ24jK7kec_aSOWS9DrvcUQ1LUHqnvR2nA&oe=62BDC452' alt=''>" + "</div>"
                                    "<div class='eventime'>" + data.start_date +"</div>" +
                                    "<div class='eventlocation'>" + data.location.name + "</div>" +
                                    "<div class='eventdescription'>" + data.description + "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class='popupnav'>" +
                                "<div id='membersnav' class='navselected'> Invitados</div>" +
                                "<div id='groupsnav'> Grupos</div>" +
                            "</div>" +
                            "<div class='popupcontent'>" +
                                "<div class='popupmembers'></div>" +
                                "<div class='popupgroups' style='display:none'></div>" +
                        "</div>" +
                            '<div class="closepopup" id="closepopup">' + 
                            "<i class='bx bx-arrow-back'></i>" +
                        '</div>' +
                    '</div>' +
                "</div>";
                    document.getElementsByClassName('back')[0].style.display = 'none';
                    element.insertAdjacentHTML('afterbegin', eventpopup);
                    const membersnav = document.getElementById('membersnav');
                    const groupsnav = document.getElementById('groupsnav');
                    if (data.members) {
                        for (let element of data.members) {
                            const member = document.createElement('div');
                            member.classList.add('member');
                            member.id = 'member';
                            member.innerHTML = 
                            "<div class='memberavatar' style='background-image: url(" + element.avatar +")'>" +
                            "</div>" +
                            "<div class='memberinfo'>" +
                                "<div class='membername'>" + element.name + "</div>" +
                                "<div class='memberusername'>" + element.username + "</div>" +
                            "</div>" +
                        "</div>";
                            document.getElementsByClassName('popupmembers')[0].appendChild(member);
                            if (element.type === 'admin' || element.type === 'sudo') {
                                const manage = document.createElement('div');
                                manage.classList.add('membermanage');
                                manage.innerHTML = "<i class='bx bx-dots-vertical'></i>"; 
                                document.getElementById('member').appendChild(manage);
                                manage.addEventListener("click", function() {
                                    const manageuser = document.createElement('dialog');
                                    manageuser.id = 'managepopup';
                                    document.getElementById('wraper').appendChild(manageuser)
                                    manageuser.innerHTML = 
                                    "<p id='makeadmin' class='manageoptions'> Hacer administrador </p>" +
                                    "<p id='kickfromevent' class='manageoptions'> Expulsar del evento </p>" +
                                    "<p id='closemanage'> Volver atras </p>";
                                    manageuser.showModal();
                                    document.getElementById('closemanage').addEventListener("click", function(){
                                        document.getElementById(manageuser.id).close();
                                        document.getElementById(manageuser.id).remove();
                                    })
                                })
                            }
                        }
                    } else {
                        const nomembers = document.createElement('div')
                        nomembers.classList.add('noevent')
                        nomembers.innerHTML = 'Este evento no tiene invitados aún'
                        document.getElementsByClassName('popupmembers')[0].appendChild(nomembers)
                    }
                    membersnav.addEventListener('click', function () {
                    });
                    groupsnav.addEventListener('click', function () {
                    });
                    const closepopup = document.getElementById('closepopup');
                    closepopup.addEventListener('click', function () {
                        element.removeChild(element.firstChild);
                        document.getElementsByClassName('back')[0].style.display = 'unset';
                    })
                    popupnav(true, true, false)
                };
          });
          // make a marker for each feature and add it to the map
          new mapboxgl.Marker(el)
            .setLngLat(geojson.geometry.coordinates)
              .addTo(map);
        });
}
async function displayLocations(geojson) {
    console.log(geojson)
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGlla2thbiIsImEiOiJjbDFucDY1ZWcwZDg4M2xtanM1ajAxdmw0In0.qWC1IZvfYRzjMzuRqPcbwQ';
console.log(geojson.features)
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: [-56.072566509246826, -34.787003504044016], // starting position [lng, lat]
    zoom: 16 // starting zoom
});
map.on('load', function() {
        map.resize();
                // create a HTML element for each feature
    console.log(geojson.features)
    for (let element of geojson.features) {
        console.log(element)
        const el = document.createElement('div');
        el.classList.add('marker');
        el.style = "background-color: white"
        el.id = element.properties.id;
        el.addEventListener("click", function(){
            var request = new XMLHttpRequest();
            request.open('GET','/api/locations/' + el.id);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.setRequestHeader('Access-Control-Allow-Headers', '*');
            request.send();
            request.onload = function() {
                var data = JSON.parse(request.responseText);
                console.log(data);
                const element = document.getElementById('wraper');
                const locationpopup =
                '<div class="popup" id="popup">' +
                    '<div class="eventpopup">' +
                        '<div class="popupheader">' +
                            '<div class="popupheaderavatar" id=' + data._id +'> </div>' +
                            '<div class="popupheadertext">' +
                                "<div class='eventitle'>" + data.name + "</div>" +
                                //"<div class='eventimg'> <img src='https://scontent.fmvd1-1.fna.fbcdn.net/v/t1.6435-9/91138397_142569460618578_9003032990434983936_n.png?_nc_cat=103&ccb=1-7&_nc_sid=973b4a&_nc_ohc=kANVgvRdsLsAX-y7miA&_nc_ht=scontent.fmvd1-1.fna&oh=00_AT8CDHH4X_DslZ24jK7kec_aSOWS9DrvcUQ1LUHqnvR2nA&oe=62BDC452' alt=''>" + "</div>"
                                "<div class='eventlocation'></div>" +
                            "</div>" +
                        "</div>" +
                        "<div class='popupnav'>" +
                            "<div id='events' class='navselected'> Eventos</div>" +
                            "<div id='groupsnav'></div>" +
                        "</div>" +
                        "<div class='popupcontent'>" +
                            "<div class='popupmembers'>" +
                        '</div>' +
                    "</div>" +
                        '<div class="closepopup" id="closepopup">' + 
                        "<i class='bx bx-arrow-back'></i>" +
                    '</div>' +
                '</div>' +
            "</div>";
                document.getElementsByClassName('back')[0].style.display = 'none';
                element.insertAdjacentHTML('afterbegin', locationpopup);
                const membersnav = document.getElementById('membersnav');
                const groupsnav = document.getElementById('groupsnav');
            }
        })
        console.log(element.geometry.coordinates)
        new mapboxgl.Marker(el).setLngLat(element.geometry.coordinates).addTo(map);
    }   
});    
};
/*
map.on('load', function() {
  map.resize();
          // create a HTML element for each feature
          const el = document.createElement('div');
          el.classList.add('marker');
          /*el.addEventListener("click", function() {
           var request = new XMLHttpRequest();
            request.open('GET','127.0.0.1:5000/events/' + marker.properties.id);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.setRequestHeader('Access-Control-Allow-Headers', '*');
            request.send();
            request.onload = function() {
                var data = JSON.parse(request.responseText);
                console.log(data);
                const element = document.getElementById('wraper');
                let new_div = document.createElement('div');
                new_div.classList.add('popup');
                new_div.setAttribute ('id', 'popup');
                element.appendChild(new_div);
                new_div.innerHTML += '<div class="close" id="closepopup"> </div>' +
                "<div class='eventitle'>" + data.title + "</div>" +
                "<div class='eventimg'> <img src='https://scontent.fmvd1-1.fna.fbcdn.net/v/t1.6435-9/91138397_142569460618578_9003032990434983936_n.png?_nc_cat=103&ccb=1-7&_nc_sid=973b4a&_nc_ohc=kANVgvRdsLsAX-y7miA&_nc_ht=scontent.fmvd1-1.fna&oh=00_AT8CDHH4X_DslZ24jK7kec_aSOWS9DrvcUQ1LUHqnvR2nA&oe=62BDC452' alt=''>" + "</div>"
                + "<div class='eventime'>" + data.date + "</div>"
                + "<div class='eventlocation'>" + data.coordinates + "</div>"
                + "<div class='eventdesc'>" + data.description + "</div>"
                + "<div class='tofav'> Anadir a Favoritos </div>"
                + "</div>"
                const close = document.getElementById('closepopup');
                close.addEventListener("click", function() {
                    new_div.remove();
                });
            };
          });*/
          // make a marker for each feature and add it to the map
/*
    // Add geolocate control to the map.
  map.addControl(
      new mapboxgl.GeolocateControl({
          positionOptions: {
              enableHighAccuracy: true
      },
  // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
  // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
  })
  ); */