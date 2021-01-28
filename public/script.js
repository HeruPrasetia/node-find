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