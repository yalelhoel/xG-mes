const htmlContent = `
	<h1>KEEP ME OPEN!</h1>
	<title>KEEP ME OPEN!</title>
	<script>
		window.onbeforeunload = function() {
			console.log("log to enable onbeforeunload")
			return "Are you sure you want to leave?";
		};
	<\/script>
`;
const blob = new Blob([htmlContent], { type: 'text/html' });
const url = URL.createObjectURL(blob);
window.onbeforeunload = () => {
    return false;
}
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
function b4unload() {
    var num = document.getElementById("b4num").value;
    for (let i = num; i >= 0; i--) {
        window.open(url);
    }
}
function ytun() {
    const base = "https://www.youtube-nocookie.com/embed/";
    const end = "?wmode=transparent&amp;iv_load_policy=3&amp;autoplay=0&amp;html5=1&amp;showinfo=0&amp;rel=0&amp;modestbranding=1&amp;playsinline=0&amp;theme=light";
    const strip_timestamps = /\?t=\d+/;
    var url = document.getElementById('ytval');
    var link;
    var id;
    link = url.value;
    id = link.replace(strip_timestamps, "");
    id = id.substr(id.length - 11, 11);
    var code = base + id + end;
    console.log(link + " " + id + " " + code);
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
    iframe.allowFullscreen = 'true';
    iframe.src = code;
    div.innerHTML = '<title>Home | Schoology</title>';
    div.appendChild(iframe);
    win.document.head.appendChild(favicon);
    win.document.body.appendChild(div);
    win.onbeforeunload = function () {
        return false;
    }
    win.focus();
}

window.onload = function (){
    if (window.parent != window){
        blank3r(window.location.href);
        window.close();
    }
}