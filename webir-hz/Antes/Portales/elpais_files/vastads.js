function whatsAppShareButton() {

    try {
        if (es_nota()) {
            var isValid = ((navigator.userAgent.match(/Android|iPhone/i) && !navigator.userAgent.match(/iPod|iPad/i)) ? true : false);

            if (isValid) {

                $(".social-media-button-article.comments a").html("-");
                $(".social-media-button-article.comments div").attr("title", "Comentarios");
                $(".social-media-article-iframe.rating").css("width", "128px");

                var textShare = $("meta[property='og:title']").attr("content");

                textShare = encodeURIComponent(textShare);

                urlShare = (document.URL || window.location.href);
                widgetShare = "whatsapp://send?text=" + textShare + "%20" + encodeURIComponent(urlShare);

                $(".social-media-article-iframe.twitter").after("<div class=\"whatsapp\" style=\"margin: 9px 0 9px 18px;  float: left;\"><a href=\"" + widgetShare + "\" onclick='trackWhatsAppShareButton(\"" + urlShare + "\");'><img src=\"http://static.diarioelpais.com/images/14/img_wa.gif\"></a></div>");

            }
        }
    } catch (e) {
    }

}

function trackWhatsAppShareButton(url) {
    pageTracker._trackEvent('whatsapp', 'compartir', ("/" + url.split("/").slice(3).join("/")));
}

function kaloogaWidget() {

    try {
        if (es_nota()) {

            if ((readCookie("xp-country") != "") && (readCookie("xp-country") != "Uruguay")) {

                $(".image-article .image img").addClass("kalooga_17287");

                var d = document, k = "kalooga", s = "script", n = d.createElement(s), f = d.getElementsByTagName(s)[0];
                n.async = true;
                n.type = "text/java" + s;
                n.src = "//publishing.kalooga.com/acct/1883.js";
                f.parentNode.insertBefore(n, f);
            }
        }
    } catch (e) {
    }

}


function epdFindTag(tagName) {

    try {
        if ('EP_NOTA_TAGS' in window) {
            return ((EP_NOTA_TAGS).toLowerCase().indexOf(tagName) != -1);
        }
    } catch (e) {
    }
    return false;

}

function fixTorneos()
{
    //var home_torneo = $(".campeonato-division .box-title span");
    //if (home_torneo.length > 0) {
    //    home_torneo.html("CLAUSURA");
    //}

    var stats = $("#changeChampionship option");

    //if (stats.length > 0) {
    //    stats[0].text = "Uruguayo - Torneo Clausura";
    //}

    if (stats.length > 0) {
        stats[14].text = "Campeonato Argentino";
    }

}

function es_nota() {
    return (typeof (EP_NOTA_TAGS) != "undefined" && EP_NOTA_TAGS != "");
}

function hasGallery() {
    try {
        if (($("a[class='viewGallery']").length > 0) || ($("div[data-jcarousel='true']").length > 0)) {
            return true;
        }
    } catch (err) {
    }
    return false;
}

function lumintate_widget() {
    return;
    if (es_nota()) {

        var a, s = document.getElementsByTagName("script")[0];
        a = document.createElement("script");
        a.type = "text/javascript";
        a.async = true;
        a.src = "http://www.luminate.com/widget/async/11c0dab21c3/";
        s.parentNode.insertBefore(a, s);
    }
}

function outbrain_widget() {

    try {

        if (es_nota()) {

            var article_ob = $(".content .main-page-content .big-border:first");

            var urlPage_11122013 = window.location.href;
            if (article_ob.length > 0) {
                article_ob.append('<div class="OUTBRAIN" style="margin:10px 0;" data-src="' + urlPage_11122013 + '" data-widget-id="AR_1" data-ob-template="ElPaisUruguay" ></div>');
                jQuery.getScript("http://widgets.outbrain.com/outbrain.js", function (data, textStatus, jqxhr) {
                    console.log(data); // Data returned
                    console.log(textStatus); // Success
                    console.log(jqxhr.status); // 200
                    console.log("Load was performed.");
                });
            }
        }

    } catch (err) {
    }

}


function agregarCategoriaMenuOvacion()
{
    try {
        var o = jQuery(".section-ovacion div.container div.header ul.menu-bottom li:nth-child(2)");
        if (o.length > 0) {
            o.after("<li><a href='/seleccion' >Selección </a></li>");
        }
    } catch (e) {
    }
}

function ocultarElementos() {

    try {        

        //Ovación
        jQuery('body > div > div.header > ul.menu-top > li > a[href*="ovaciondigital"]').remove();

        //quitar quepasa de bloque Suplementos
        jQuery(".suplementos-part .suplementos .logo.que-pasa").remove();

        jQuery(".box-los-mas ul li:nth-child(6)").remove();
        jQuery(".box-los-mas ul li:nth-child(6)").remove();
        jQuery(".box-los-mas ul li:nth-child(6)").remove();
        jQuery(".box-los-mas ul li:nth-child(6)").remove();
        jQuery(".box-los-mas ul li[class!='see-more']:nth-child(6)").remove();

        //gallito not uy
        if (readCookie("xp-country") != "Uruguay") {
            var el = jQuery("#box_widgetgallito");
            if (el.length > 0) {
                el.parent().remove();
            }
        }


    } catch (e) {
    }

}

function agregarAlMenu()
{
    if ($("div.header .menu-top li a[href='http://elpaistv.com.uy/']").length == 0) {
        jQuery("div.header .menu-top").append('<li><a href="http://elpaistv.com.uy/" target="_blank" title="El País TV" >El País TV</a></li>');
    }

    if ($("div.header .menu-top li a[href='http://elescolar.com.uy/']").length == 0) {
        jQuery("div.header .menu-top").append('<li><a href="http://elescolar.com.uy/" target="_blank" title="El Escolar" >El Escolar</a></li>');
    }
}


function OvacionStyleTemas()
{
    try {
        if ((window.location.href).indexOf("www.ovaciondigital.com.uy/tag/") != -1) {

            $(".search-page .header .middle-content .logo").empty();
            $(".search-page .header .middle-content").css("background", "url(/images/backgrounds/header-deportes-01.png) repeat-x center").css("background-color", "#277621")
            $(".search-page .header .middle-content .logo").css("background", "url('/images/../images/sprites-se518345bad.png') no-repeat").css("margin", "-10px 130px 0 -10px").css("width", "418px").css("height", "80px").css("background-position", "0 0")
            $(".search-term .term").css("color", "#277621");
            $(".sub-menu .front").remove();
            $(".sub-menu .items").remove();
        }
    } catch (e) {
    }

}


function doveSponsorClima()
{

    var d = new Date();
    var n = d.getDay();

    try {
        //if(n==5){
        if ((window.location.href).indexOf("/clima/") != -1) {
            $(".header .middle-content").addClass("sponsor");
        } else {
            $(".section-home .header .middle-content").addClass("sponsor");
        }
        //}
    } catch (e) {
    }
}


function AdServerSearchByTag()
{
    try {
        if (es_nota()) {

            var arrTags = (EP_NOTA_TAGS + "").split(",");
            var adsFilterTags = "";
            $.each(arrTags, function (i, tag) {

                if (adsFilterTags != "")
                    adsFilterTags += "&";
                adsFilterTags += "tag=" + tag.toLowerCase().replace(/ /g, "-");

            });

            OAS_query = adsFilterTags;

        }

    } catch (e) {
    }

}
AdServerSearchByTag();

/*if(epdFindTag("show de goles")){
 if ('EP_VIDEO_VAST_URI' in window) {
 EP_VIDEO_VAST_URI="http://servicios.elpais.com.uy/Includes/11/player/osmf/mastGoles.xml";
 }
 }*/

/*if(epdFindTag("micro clima")){
 if(typeof(OAS_query)=="undefined") {var OAS_query="";}
 if(OAS_query!=""){
 OAS_query += "&";
 }
 OAS_query += "tag=micro-clima";
 }*/

function agregarDeMarcoBanner()
{
    try {
        if ((window.location.href).indexOf('/datafactory/clasificacion/futbol-uruguay') != -1) {
            $('<div align="center"><span><font color="white" size="3">Presenta: </font></span> <img src="http://www.demarco.com.uy/images/logo.png" width="100"></div>').insertAfter('.championships:first');
        }
    } catch (e) {
    }
}

function agregarCintilloElPaisTV() {
    try {
        if ((window.location.href).indexOf("http://www.elpais.com.uy/") != -1) {
            $('<iframe width="979" scrolling="no" height="106" frameborder="0" src="http://elpaistv.com.uy/widgets/cintillo-epd.html"></iframe>').insertAfter('div.big-main-news-container:first');
        }
    } catch (e) {
    }
}

jQuery(function ($) {

    OvacionStyleTemas();
    //doveSponsorClima()
    ocultarElementos();
    agregarAlMenu();
    fixTorneos();
    kaloogaWidget();
    whatsAppShareButton();
    agregarDeMarcoBanner();
    //agregarCategoriaMenuOvacion();
    agregarCintilloElPaisTV();
    //outbrain_widget();
    //ajustarLinkElPaisTv();
    //lumintate_widget();

});

/*var wonloadOld = window.onload;
 window.onload = function(){
 try{
 if(wonloadOld){wonloadOld();}
 }catch(e){}
 }*/