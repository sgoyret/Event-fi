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
        console.log(formdata);
        var request = new XMLHttpRequest();
        request.open('POST', 'http://127.0.0.1:5000/events');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.setRequestHeader('Access-Control-Allow-Headers', '*');
        request.send(JSON.stringify(formdata)); 
        console.log(request)
        });
});