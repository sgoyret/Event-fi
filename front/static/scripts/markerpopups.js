window.addEventListener("load", function() {
    const elements = document.getElementsByClassName('marker');
    console.log(elements);
    for (let item of elements) {
        item.addEventListener("click", function() {
            const element = document.getElementById('popup');
            element.classList.replace('popupnone', 'popup');
        });
    };
    const close = document.getElementById('closepopup');
    close.addEventListener("click", function() {
        const element = document.getElementById('popup');
        element.classList.replace('popup', 'popupnone');
    });
});