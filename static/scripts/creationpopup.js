window.addEventListener("load", function() {
    const userpage = document.getElementById('addevent');
    userpage.addEventListener("click", function() {
        const element = document.getElementById('eventcreate');
        element.classList.replace('popupnone', 'popup');
    });
    const close = document.getElementById('closeeventcreate');
    close.addEventListener("click", function() {
        const element = document.getElementById('eventcreate');
        element.classList.replace('popup', 'popupnone');
    });
    const eventcreate = document.getElementById('create');
    eventcreate.addEventListener("click", function() {
        var request = new XMLHttpRequest();
        request.open('POST', 'http://127.0.0.1:5000/events');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.setRequestHeader('Access-Control-Allow-Headers', '*');
        request.send(); 
        console.log(request.getAllResponseHeaders())
        });
});