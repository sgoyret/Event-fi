window.addEventListener("load", function() {
    // Add a click listener for create navbar button
    document.getElementById('create').addEventListener("click", function() {
        document.getElementById('sidebar').style.display = "none";
        const creationpopup = 
        '<div class="popup" id="eventcreate">' +
            '<div class="selection" id="selection">'+
                '<div class="event picked" id="eventmake"> Crear evento </div>'+
                '<div class="group" id="groupmake"> Crear grupo </div>'+
            '</div>'+
            '<div id="form">' +
                '<form id="eventdata" method="POST">' +
                '<input name="name" class="creation" placeholder="Titulo"></input>' +
                '<input name="date" class="creation" placeholder="Fecha"></input>' +
                '<input name="coordinates" class="creation" placeholder="Coordenadas"></input>' +
                '<input name="description" class="creation" placeholder="Descripcion" style="height: 40%;"></input>' +
                ' <div id="creationevent" class="creationbutton"> Crear</div>' +
                '</form>' +
            '</div>' + 
            '<div class="closepopup" id="closepopup"> </div>' +
        '</div>';
        document.getElementById('wraper').insertAdjacentHTML("afterbegin", creationpopup);
        // Add a click listener for create a group button
        document.getElementById('groupmake').addEventListener("click", function() {
            const groupform = 
            '<form id="groupdata" method="POST">' +
                '<input name="name" class="creation" placeholder="Nombre"></input>' +
                '<div class="creationbutton" id="creationgroup"> Crear</div>' +
            '</form>';
            document.getElementById('form').innerHTML = groupform;
            document.getElementById('eventmake').classList.remove('picked');
            document.getElementById('groupmake').classList.add('picked');
            // Add a click listener for Crear button(group only) 
            document.getElementById('creationgroup').addEventListener("click", function() {
                const form = document.getElementById('groupdata');
                var formdata = {};
                for (let item of form) {
                    if (item.value == '') {
                        alert('Please fill in all fields');
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
            });
        });
        // Add a click listener for create an event button
        document.getElementById('eventmake').addEventListener("click", function() {
            const eventform =
                '<form id="eventdata" method="POST">' +
                '<input name="name" class="creation" placeholder="Titulo"></input>' +
                '<input name="date" class="creation" placeholder="Fecha"></input>' +
                '<input name="coordinates" class="creation" placeholder="Coordenadas"></input>' +
                '<input name="description" class="creation" placeholder="Descripcion" style="height: 40%;"></input>' +
                ' <div class="creationbutton" id="creationevent"> Crear</div>' +
                '</form>';
            document.getElementById('form').innerHTML = eventform;
            document.getElementById('eventmake').classList.add('picked');
            document.getElementById('groupmake').classList.remove('picked');
        });
        // Add a click listener for close button
        document.getElementById('closepopup').addEventListener("click", function() {
            document.getElementById('wraper').removeChild(document.getElementById('eventcreate'));
            document.getElementById('sidebar').style.display = "unset";
        });
        // Add a click listener for Crear button (event only) and send data to server
        document.getElementById('creationevent').addEventListener("click", function() {
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