async function notificationsPopup() {
    console.log("hola")
    var notifications = new XMLHttpRequest;
    const notificationspopup = '';
    notifications.open("GET", "/api/users/notifications", false);
    notifications.send()
    notifications.onload = function() {
        var notificationsdata = JSON.parse(notifications.responseText);
        console.log(notificationsdata)
        if (notificationsdata.length === 0) {
        notificationspopup =
            '<div class="notifications-popup">' +
                '<div class="notifications-popup-header">' +
                    '<h3>Notificaciones</h3>' +
                    '<div class="close-notifications-popup">' +
                        '<i class="fas fa-times"></i>' +
                    '</div>' +
                '</div>' +
                '<div class="notifications-popup-body">' +
                '<p> No tienes notificaciones <p>' +
                '</div>' +
            '</div>';
        } else {
            notificationspopup = 
            '<div class="notifications-popup">' +
                '<div class="notifications-popup-header">' +
                    '<h3>Notificaciones</h3>' +
                    '<div class="close-notifications-popup">' +
                        '<i class="fas fa-times"></i>' +
                    '</div>' +
                '</div>' +
                '<div class="notifications-popup-body" id="notifications-popup-body">' +
            '   </div>' +
        '</div>';
        }
        document.getElementById('wraper').insertAdjacentHTML('afterbegin', notificationpopup);
        if (notificationsdata.lenght > 0) {
            for (let element in notificationsdata) {
            const notificationitem = document.createElement('p')
            notificationitem.innerHTML += element; 
            document.getElementById('notifications-popup-body').appendChild(notificationitem)    
        }
    } else {
        }
        document.getElementsByClassName('close-notifications-popup')[0].addEventListener('click', function() {
            document.getElementsByClassName('notifications-popup')[0].remove();
        });
    }
}
window.addEventListener('load', function(){
    document.getElementById('notifications').addEventListener('click', function() {
        notificationsPopup()
    });
});