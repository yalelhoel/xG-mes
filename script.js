function blank3r(furl = document.getElementById('blank3rVal').value) {  
    var win = window.open();
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    var title = win.document.createElement('title');
    var div = win.document.createElement('div');
    var iframe = win.document.createElement('iframe');
    var favicon = win.document.createElement("link");
    title.innerHTML = "Home | Schoology";
    favicon.rel = 'shortcut icon';
    favicon.type = 'image/x-icon';
    favicon.href = 'https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico';
    iframe.style.border = 'none';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.margin = '0';
    console.log('furl' + furl);
    iframe.src = furl;
    div.innerHTML = '<title>Home | Schoology</title>';
    div.appendChild(iframe);
    div.appendChild(favicon);
    win.document.head.appendChild(favicon);
    win.document.body.appendChild(div);
    win.onbeforeunload = function () {
        return false;
    }
    win.focus();
}
window.onbeforeunload = function(){
    return false;
}
addEventListener("load", (event) => {
    blank3r(window.location.href);
    window.close();
});
