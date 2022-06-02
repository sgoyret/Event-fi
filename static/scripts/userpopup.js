window.addEventListener("load", function() {
    const userpage = document.getElementById('usericon');
    userpage.addEventListener("click", function() {
        const element = document.getElementById('userpopup');
        element.classList.replace('popupnone', 'popup');
    });
    const close = document.getElementById('closeuserpopup');
    close.addEventListener("click", function() {
        const element = document.getElementById('userpopup');
        element.classList.replace('popup', 'popupnone');
    });
});