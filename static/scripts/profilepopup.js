window.addEventListener("load", function() {
    this.document.querySelector('.events').addEventListener("click", function() {
        const selected = document.getElementsByClassName('selected');
        const active = document.getElementsByClassName('active');
        console.log(selected);
        for (let element of selected) {
            element.classList.remove('selected');
        };
        document.getElementById('userevents').classList.remove('none');
        document.getElementById('usergroups').classList.add('none');
        document.getElementById('usercontacts').classList.add('none');
        this.classList.add('selected');
    });
    this.document.querySelector('.groups').addEventListener("click", function() {
        const selected = document.getElementsByClassName('selected');
        const active = document.getElementsByClassName('active');
        console.log(selected);
        for (let element of selected) {
            element.classList.remove('selected');
        };
        document.getElementById('usergroups').classList.remove('none');
        document.getElementById('userevents').classList.add('none');
        document.getElementById('usercontacts').classList.add('none');
        this.classList.add('selected');
    });
    this.document.querySelector('.contacts').addEventListener("click", function() {
        const selected = document.getElementsByClassName('selected')
        const active = document.getElementsByClassName('active')
        console.log(selected);
        for (let element of selected) {
            element.classList.remove('selected');
        };
        document.getElementById('usercontacts').classList.remove('none');
        document.getElementById('usergroups').classList.add('none');
        document.getElementById('userevents').classList.add('none');
        this.classList.add('selected');
    });
});