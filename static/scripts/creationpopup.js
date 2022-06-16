window.addEventListener("load", function() {
    const userpage = document.getElementById('create');
    console.log(userpage)
    userpage.addEventListener("click", function() {
        const element = document.getElementById('eventcreate');
        const creationpopup = 
        '<div class="popup" id="eventcreate">' +
            '<form id="eventdata" method="POST">' +
            '<input name="title" class="creation" placeholder="Titulo"></input>' +
            '<input name="description" class="creation" placeholder="Descripcion"></input>' +
            '<input name="date" class="creation" placeholder="Fecha"></input>' +
            '<input name="coordinates" class="creation" placeholder="Coordenadas"></input>' +
            ' <div id="creation"> Crear</div>' +
            '</form>' + 
            '<div class="closepopup" id="closepopup"> </div>' +
        '</div>';
        document.getElementById('wraper').insertAdjacentHTML("afterbegin", creationpopup);
        const close = document.getElementById('closepopup');
        close.addEventListener("click", function() {
            document.getElementById('wraper').removeChild(document.getElementById('eventcreate'));
            document.getElementById('sidebar').style.display = "unset";
        });
        document.getElementById('sidebar').style.display = "none";
    const eventcreate = document.getElementById('creation');
    eventcreate.addEventListener("click", function() {
        const formelements = document.getElementById('eventdata').getElementsByTagName('input');
        var formdata = {};
        for (let item of formelements) {
            if (item.value == '') {
                alert('Please fill in all fields');
                return;
            } else {
                formdata[item.name] = item.value;
            }
        }
        formdata['coordinates'] = formdata['coordinates'].split(',');
        formdata['coordinates'] = [parseFloat(formdata['coordinates'][0]), parseFloat(formdata['coordinates'][1])];
        const request = new XMLHttpRequest();
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
        };
        });
    });
    });