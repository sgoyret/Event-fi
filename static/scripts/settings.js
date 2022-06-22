window.addEventListener("load", function() {
    async function display_password_change() {
        document.getElementById('change_pass').addEventListener('click', function() {
            document.getElementById('passwordchange').style.display = 'block';
            document.getElementById('change_pass').style.display = 'none';
        });
    };
    display_password_change();
});