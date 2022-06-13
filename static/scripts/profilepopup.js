window.addEventListener("load", function() {
    this.document.querySelector('.events').addEventListener("click", function() {
        document.querySelector('.list').innerHTML = 
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
        '{{endfor}}';
    });
    this.document.querySelector('.contacts').addEventListener("click", function() {
        console.log("hola bichicome");
        document.querySelector('.list').innerHTML =
        '{{for groujp in groups}}' +
            '<div class="event">' +
                '<div class="event-image">' +
                '</div>' +
                '<div class="event-info">' +
                    '<p>' + '{{group.name}}' + '</p>' +
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
        '{{endfor}}';
    });
});