paseE2E = {
    settings: {},
    init: function(settings) {

        paseE2E.settings = $.extend({
            onLoggedIn: function() {},
            onNotLogged: function() {},
            onSuccess: function() {
                //Se borrar la cookie para count de modal
                paseE2E.removeCookie("lw-modalPase");
                paseE2E.reload();
            },
            onLogout: function() {
                paseE2E.reload();
            },
            urlIframeLW: "",
            origin: "",
            urlReload : "",
            reloadOnClose: false
        }, settings);

        if (window.addEventListener) {
            addEventListener("message", paseE2E.listener, false);
        } else {
            attachEvent("onmessage", paseE2E.listener);
        }

        $(document).ready(function() {
            if(window.location.hash == "#login" || window.location.hash == "#register") {
                if(!paseE2E.isLoggedIn()) {
                    paseE2E.openModal();
                }
            }
            $(paseE2E.settings.placeMiCuenta).click(function(ev) {
                ev.preventDefault();
                paseE2E.openModalProfile();
            });

            $(paseE2E.settings.buttonLogout).click(function(ev) {
                ev.preventDefault();
                paseE2E.triggerEvent('startLogout');
                gigya.socialize.logout({callback: paseE2E.onLogoutHandler});                
            });
        });
        gigya.socialize.addEventHandlers({
            onLogin: paseE2E.onLoginHandler, 
            onLogout: paseE2E.onLogoutHandler
        });    
        
        paseE2E.isLogged();
    },

    listener: function(event) {
        if (paseE2E.getHostname(event.origin) == paseE2E.getOrigin()) {
            if (typeof event.data == "string") {
                data = JSON.parse(event.data);
                if (typeof data.autenticar != "undefined") {
                    if(typeof data.siteContext != "undefined"){
                        paseE2E.settings.urlReload = data.siteContext;
                    }
                    paseE2E.closeDialog(event.data);
                }
                if (data.e2eEventType == "socialLoginAndRedirect") {
                    gigya.socialize.login({
                        pendingRegistration: true,
                        authFlow: "redirect",
                        provider: data.provider,
                        redirectURL: data.redirectURL
                    });
                }
            }
        }
    },

    closeDialog: function (eventData) {
        closeDialogEvent = true ;
        data = JSON.parse(eventData);
        if (data.autenticar) {
            paseE2E.refreshUI();
        } else if(paseE2E.settings.reloadOnClose){
            paseE2E.reload("/");
        } else {        
            paseE2E.closeModal();
        }
        
    },
    triggerEvent: function (eventName, params) {
        $(window).trigger('pase:' + eventName, params);
    },

    setOrigin: function(url) {
        paseE2E.settings.origin = url;
    },

    getOrigin: function() { 
        return paseE2E.getHostname(paseE2E.settings.origin);

    },
    getHostname: function(url) {
        var a = document.createElement('a');
        a.href = url;
        return a.hostname;
    },

    setCookie: function(name, value,expire) {
        if (expire === undefined) {
             expire = 5478;
        } 
        options = {
            domain: ".clarin.com",
            path: '/',
            expires: expire
        }
        $.cookie(name, value, options);
    },

    getCookie: function(name) {
        value = $.cookie(name);
        return value;
    },

    removeCookie: function(name) {
        paseE2E.setCookie(name, null);
    },

    checkUserInfo: function (response) {
        if (response.user.isLoggedIn == ""){
            paseE2E.notLogged();
            paseE2E.triggerEvent('notLogged');
            paseE2E.settings.onNotLogged();
        }
        else{
            paseE2E.logged(paseE2E.getLabelUsuarioFromGigya(response.user));
            paseE2E.triggerEvent('loggedIn', [response]);
            paseE2E.settings.onLoggedIn(response);
        }
    },

    isLogged: function(){
        if(paseE2E.getCookie("nombre") != null && paseE2E.getCookie("idPase") != null) {
            paseE2E.logged(paseE2E.getCookie("nombre"));
            paseE2E.triggerEvent('loggedIn');
            paseE2E.settings.onLoggedIn();
        } 
        gigya.socialize.getUserInfo({callback: paseE2E.checkUserInfo});
    },

    isLoggedIn: function(){
        if(paseE2E.getCookie("nombre") != null && paseE2E.getCookie("idPase") != null) {
            //Remover o cambiar a 1 ?
            return true;
        }
        return false;
    },

    notLogged: function() {
        paseE2E.removeCookie("nombre");
        paseE2E.removeCookie("idPase");

        date = new Date();
        displayDate = (date.getDate()) + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' -- ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        paseE2E.setCookie("pase-logout","1-" + displayDate, 1); 
        
        $(paseE2E.settings.placeIngresar).text('Ingresar ');
        $(paseE2E.settings.placeIngresar).unbind('click') ;
        $(paseE2E.settings.placeIngresar).click(function(ev) {  
            ev.preventDefault();
            paseE2E.openModal() ;
        });
    },

    logged: function(labelUsuario) {
        $(paseE2E.settings.placeName).text(labelUsuario);
    },

    openModal: function() {
 
        paseE2E.setOrigin(paseE2E.settings.urlIframe);

        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        width = width > 844 ? 844 : width;
        var height = 850;
        $.colorbox({
            iframe:true,
            innerWidth: width,
            innerHeight:height,
            fixed: false,
            scrolling: false,
            className:"modalLoginPase",
            href: paseE2E.settings.urlIframe,
            closeButton: false
        });
    },
    openModalProfile: function() {
 
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        width = width > 1000 ? 1000 : width;
        var scroll = true;
        height = height - 80;
        if(height > 950){
            height = 950;
            scroll = false;
        }
        $.colorbox({
            iframe:true,
            innerWidth:width,
            innerHeight:height,
            fixed: false,
            scrolling: scroll,
            className:"modalPaseE2E",
            href: paseE2E.settings.urlProfile,
            closeButton: true
        });
    },

    openModalLW: function() {
        
        paseE2E.setOrigin(paseE2E.settings.urlIframeLW);
        paseE2E.settings.reloadOnClose = true;

        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        width = width > 930 ? 930 : width;
        var height = 850;
        $.colorbox({
            iframe:true,
            fixed: true,
            scrolling: false,
            escKey: false,
            overlayClose: false,
            className:"modalLoginPase",
            href: paseE2E.setUrlModalLW(),
            closeButton: false,
            onComplete: function() {
                $.colorbox.resize({
                    innerWidth: width,
                    innerHeight: height
                });

            },
            onClosed: function() {
                paseE2E.closeDialog("{}");
            }
        });

    },

    closeModal: function() {
        $.colorbox.close();
    },

    onLoginHandler: function(eventObj) {
        try {
            
            eventObj.user.identities = {}

            $.ajax({
                 type:"GET",
                 url: paseE2E.settings.urlLogin,
                 data: { "usuarioJSON": JSON.stringify(eventObj) },
                 dataType: "jsonp",
                 timeout: 200000,
                 jsonp:"callback"
             }).done(function(msg) {
                if(msg.estado == "SUCCESS") {
                    paseE2E.setCookie("Pase-fecNac", (msg.usuario.fechaNacimiento).substring(0,10));
                    paseE2E.setCookie("Pase-genero", msg.usuario.genero);
                    paseE2E.setCookie("nombre", paseE2E.getLabelUsuario(msg.usuario));
                    paseE2E.setCookie("idPase", msg.usuario.uid);
                    paseE2E.setCookie("pase-user", JSON.stringify(msg.usuario));
                    paseE2E.logged( paseE2E.getLabelUsuario(msg.usuario) );

                    paseE2E.triggerEvent('success');
                    paseE2E.settings.onSuccess();
                    
                }

             });

        } catch (e) {
            BBT.log(e);
        }
    },

    onLogoutHandler: function(eventObj) {
        paseE2E.removeCookie("nombre");
        paseE2E.removeCookie("idPase");
        
        date = new Date();
        displayDate = (date.getDate()) + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' -- ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        paseE2E.setCookie("pase-logout","2-" + displayDate, 1);

        paseE2E.triggerEvent('logout');
        paseE2E.settings.onLogout();
    },

    reload: function(url) {
        var urlToRedirect  = window.location.href.split('#')[0]
        console.log(paseE2E.settings.urlReload);
        if(typeof(url) != "undefined") {
            urlToRedirect = url;        
        }else{
            if( paseE2E.settings.urlReload  != ""){
                urlToRedirect =  paseE2E.settings.urlReload ;
            } 
        }
        if(typeof(window.event) != "undefined" && window.event != null) {
            window.event.returnValue = false;
        } 
        window.location.href = urlToRedirect;

    },
    refreshUI: function() {
        try{
            gigya.services.socialize.refreshUI({
                callback: function(response) {
                    if ( response.errorCode == 0 ) {
                        gigya.socialize.getUserInfo({callback:paseE2E.getUserInfoCallback});
                    }
                    
                }
            });

        } catch (e) {
            BBT.log(e);
        }
    },
    
    getUserInfoCallback: function(response) {
        if (response.errorCode == 0) {
            if (response.user.UID != "" && response.user.UIDSignature != "") {
                paseE2E.onLoginHandler(response);
            } else {
                paseE2E.reload();
            }
        }
    },
    getLabelUsuario: function(usuario) {
        if (usuario["nombre"] != null && usuario["nombre"] != "") {
            return usuario["nombre"] ;
        }
        if (usuario["apodo"] != null && usuario["apodo"] != "") {
            return usuario["apodo"] ;
        }
        return usuario["email"] ;
    },

    getLabelUsuarioFromGigya: function(usuario) {
        if (usuario["firstName"] != null && usuario["firstName"] != "") {
            return usuario["firstName"] ;
        }
        if (usuario["nickname"] != null && usuario["nickname"] != "") {
            return usuario["nickname"] ;
        }
        return usuario["email"] ;
    },

    setUrlModalLW : function(){

        paseE2E.setCookieOpenModalVersion();

        var cookieValues = JSON.parse(paseE2E.getCookie("lw-modalPase"));

        var href = paseE2E.settings.urlIframeLW;
        var count = cookieValues.valor;
        var viewId; 

        for(key in paseE2E.settings.paramsModal) {
            if(count>key) {
                
                viewId = "?viewId=" + paseE2E.settings.paramsModal[key];
            }
        }

        href += viewId;
        return href;
    },

    setCookieOpenModalVersion : function(){

        var cantOpenModal = 1;
        var cookieValues;
        var expireDate = new Date();
        var dias = 90;

        if($.cookie('lw-modalPase')){

            cookieValues = JSON.parse(paseE2E.getCookie("lw-modalPase"));
            cantOpenModal = parseInt(cookieValues.valor)+1;

            paseE2E.setCookie("lw-modalPase",JSON.stringify({"valor" :cantOpenModal,"expireDate" : cookieValues.expireDate}),new Date(cookieValues.expireDate));
        
        }else{

            expireDate.setTime(expireDate.getTime() + (dias * 24 * 3600 * 1000));
            paseE2E.setCookie("lw-modalPase",JSON.stringify({"valor" :cantOpenModal,"expireDate" : expireDate}),expireDate);
        }
        
    }
}
