window.addEventListener("load", function() {
        const elements = document.getElementsByClassName('marker');
        for (let i = 0 ; i < elements.length; i++) {
        console.log(elements[i]);
        elements[i].addEventListener("click", function() {
            const element = document.getElementById('wraper');
            console.log(elements[i].id.split('.')[1]);
            var request = new XMLHttpRequest();
            request.open('GET', 'http://192.168.1.21:5000/events/' + elements[i].id.split('.')[1]);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
            request.setRequestHeader('Access-Control-Allow-Headers', '*');
            request.send();
            request.onload = function() {
                var data = JSON.parse(request.responseText);
                console.log(data.name + ': ' + data.value);
                console.log("hola");
                element.innerHTML += '<div class="popup">' + 
                "<div class='close' id='closepopup'> </div>" +
                "<div class='eventitle'>" + data.title + "</div>" +
                "<div class='eventimg'> <img src='https://scontent.fmvd1-1.fna.fbcdn.net/v/t1.6435-9/91138397_142569460618578_9003032990434983936_n.png?_nc_cat=103&ccb=1-7&_nc_sid=973b4a&_nc_ohc=kANVgvRdsLsAX-y7miA&_nc_ht=scontent.fmvd1-1.fna&oh=00_AT8CDHH4X_DslZ24jK7kec_aSOWS9DrvcUQ1LUHqnvR2nA&oe=62BDC452' alt=''>" + "</div>"
                + "<div class='eventime'>" + data.date + "</div>" +
                + "<div class='eventlocation'>" + data.coordinates + "</div>"
                + "<div class='eventdesc'>" + data.description + "</div>"
                + "<div class='tofav'> Anadir a Favoritos</div>"
                + "</div>"
                const close = document.getElementById('closepopup');
                close.addEventListener("click", function() {
                    const element = document.getElementById('popup');
                    element.classList.replace('popup', 'popupnone');
                });
            };
        });
    };
});