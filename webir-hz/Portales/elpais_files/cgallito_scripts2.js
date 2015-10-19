function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

function cgallito_change(id) {
    var div = document.getElementById('cgallito_div' + id);
    var img = document.getElementById('cgallito_img' + id);

    for (i = 1; i <= 3; i++) {
        var imgsrc = document.getElementById('cgallito_img' + i).src;
        var divs = document.getElementById('cgallito_div' + i);
        imgnewsrc = imgsrc.replace('_on', '_off');
        document.getElementById('cgallito_img' + i).src = imgnewsrc;
        divs.className = "cgallito_listado, cgallito_listado_off";
    }
    img.src = img.src.replace('_off', '_on');
    div.className = "cgallito_listado";
    setCookie('ckwidgetgallito', id, 7);
    //cgallito_rotateStyle(div, true);
}

function cgallito_rotateStyle(divroot, rotateForTab) {
    if (rotateForTab) {
        cgallito_displayElements(divroot);
    }
    else {
        for (x = 1; x <= 3; x++) {
            divroot = document.getElementById('cgallito_div' + x);
            cgallito_displayElements(divroot);
        }
    }
}

function cgallito_displayElements(divroot) {
    divsarrayActivos = divroot.getElementsByClassName('cgallito_modaviso');
    divsarrayInactivos = divroot.getElementsByClassName('cgallito_modaviso_off');
    cant = divsarrayActivos.length + divsarrayInactivos.length;
    if (cant > 5) { // si viene con mas de 4 elementos
        //oculto todos, creo array
        while (divsarrayActivos.length > 0) { divsarrayActivos[0].className = "cgallito_modaviso_off"; }


        //muestro 4 al asar
        divsarrayInactivos = divroot.getElementsByClassName('cgallito_modaviso_off');
        for (i = 0; i < 5; i++) { // muestro 4 elementos
            rand = Math.random(); //numero random
            cantquedan = divsarrayInactivos.length;
            num = Math.round(rand * cantquedan) - 1; //multiplico por la cantidad, resto uno porque comienza en 0 el indice
            num = Math.abs(num); //por si el resultado es menor a 0
            divsarrayInactivos[num].className = "cgallito_modaviso"; // muestro el aviso
        }
    }
}

