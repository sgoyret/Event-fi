window.addEventListener("load", function() {
    this.document.querySelector('.events').addEventListener("click", function() {
        document.querySelector('.list').innerHTML = 
        '{{ if events }}' +
            '{{for event in events}}' +
                '<div class="event">' +
                    '<div class="event-image">' +
                    '</div>' +
                    '<div class="event-info">' +
                        '<p>' + '{{event.title}}' + '</p>' +
                        '<p>' + '{{event.date}}' + '</p>' +
                        '<p>' + '{{event.coordinates}}' + '</p>' +
                    '</div>' +
                        '<div class="event-manage">' +
                            '<div class="event-manage-button">' +
                                '<button>Ver</button>' +
                            '</div>' +
                            '<div class="event-manage-button">' +
                                '<button>Editar</button>' +
                            '</div>' +
                            '<div class="event-manage-button">' +
                                '<button>Eliminar</button>' +
                        '</div>' +
            '{{endfor}}' +
            '{{else}}' +
                '<li> Parece que no tienes ningún evento próximamente</li>' +
            '{{end}}';
    });
    this.document.querySelector('.groups').addEventListener("click", function() {
        console.log("hola bichicome");
        document.querySelector('.list').innerHTML =
        '{{ if groups }}' +
            '{{for group in groups}}' +
            '<li>' +
                '<div class="listed">' +
                    '<div class="image">' +
                    '</div>' +
                    '<div class="info">' +
                        '<p>' + '{{event.title}}' + '</p>' +
                        '<p>' + '{{event.date}}' + '</p>' +
                        '<p>' + '{{event.coordinates}}' + '</p>' +
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
                '</li>' +
            '{{endfor}}' +
            '{{else}}' +
                '<li> Parece que no tienes ningún evento próximamente</li>' +
            '{{end}}';
    });
});