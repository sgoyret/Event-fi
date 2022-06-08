window.addEventListener("load", function() {
    const usercreate = document.getElementById('create');
    usercreate.addEventListener("click", function() {
        const formelements = document.getElementById('userdata').getElementsByTagName('input');
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
        request.open('POST', 'http://127.0.0.1:5001/register');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.setRequestHeader('Access-Control-Allow-Headers', '*');
        request.send(JSON.stringify(formdata));
        console.log(request)
    });
    
});