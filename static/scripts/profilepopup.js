window.addEventListener("load", function() {
    var request = new XMLHttpRequest();
    request.open('GET', '/api/events')
    request.send()
    request.onload = function() {
        const eventdata = JSON.parse(request.responseText);
        if (eventdata === null) {
            document.querySelector('.list').innerHTML =
            '<li style="text-align: center; margin-top: 30px; display:block;"> Parece que no tienes ningún evento próximamente</li>'
        }
        else {
            var prototype = ''
            for (let [key, value] of Object.entries(eventdata))
            {
                prototype +=             
                '<li>' +
                '<div class="listed">' +
                    '<div class="image">' +
                        '<div class="img">' +
                        '</div>' +
                    '</div>' +
                    '<div class="info">' +
                    '<p>'+ value.title  +'</p>' +
                    '<p>' + value.date + '</p>' +
                    '<p>' + value.location + '</p>' +
                    '</div>' +
                    '<div class="manage">' +
                        '<div class="manage-button">' +
                            '<button>Ver</button>' +
                        '</div>' +
                        '<div class="manage-button">' +
                            '<button>Editar</button>' +
                        '</div>' +
                        '<div class="manage-button">' +
                            '<button>Eliminar</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</li>'
        };
            }
            document.querySelector('.list').innerHTML = prototype;
        console.log(eventdata);
    };
    this.document.querySelector('.events').addEventListener("click", function() {
        const selected = document.getElementsByClassName('selected')
        console.log(selected);
        for (let element of selected) {
            element.classList.remove('selected');
        };
        this.classList.add('selected');
        var request = new XMLHttpRequest();
        request.open('GET', '/api/events')
        request.send()
        request.onload = function() {
            var data = JSON.parse(request.responseText);
            console.log(data)
        };
    });
    this.document.querySelector('.groups').addEventListener("click", function() {
        const selected = document.getElementsByClassName('selected')
        console.log(selected);
        for (let element of selected) {
            element.classList.remove('selected');
        };
        this.classList.add('selected');
    });
    this.document.querySelector('.contacts').addEventListener("click", function() {
        const selected = document.getElementsByClassName('selected')
        console.log(selected);
        for (let element of selected) {
            element.classList.remove('selected');
        };
        this.classList.add('selected');
    });
});