jQuery(function($) {

    window.wfCmsOnLogin = function(callback) {
        if (window.wfCmsLoggedInUser) {
			callback.apply(this, [{type: 'cms:user:already-logged-in'}, window.wfCmsLoggedInUser]);

        } else {
            $(window).on('cms:user:logged-in', function(ev, user) {
                callback.apply(this, arguments);
            });
        }
    };

    //rewrite search url on submit
    triggerSearchFormSubmit();

    //sidebar latest
    triggerLatestChange();

    // sidebar most
    triggerMostTabChange();

    // print article popup
    triggerArticlePrint();

    triggerArticleSizeChange();

    getLoginInfo();

    triggerCommentLoginSubmit();

    // article rating
    triggerArticleRating();

    //main menu added bind ontap
    triggerHoverIos();

    //article send
    triggerArticleMail();

    displayMobilePopup();
    
    addPlayButtonSmall();
    
    addPlayButtonBig();
    
    addPlayButtonDoble();
    
    addPlayButtonEspecial();
    
    addPlayButtonEspecialSmall();
    
    addGaleriaButtonSmall();
    
    addGaleriaButtonBig();
    
    addGaleriaButtonDoble();
    
    addGaleriaButtonDobleEspecial();
    
    addGaleriaSprite();
    
    addGaleriaButtonEspecialSmall();
    
    addGaleriaButtonEspecial();
       
    function triggerSearchFormSubmit() {
        var $form = $('.search-form');
        $form.on("submit",function(ev){
           ev.preventDefault();
           document.location = $form.attr('action') + '/' + $('.search-input').val();
        });

        $('.search-submit').on('click', function(ev){
            ev.preventDefault();
            $form.submit();
        });
    }

    function triggerLatestChange() {
        var $select = $('.latest-select');
        var $container = $('.box-last-minute-content');
        $select.on("change",function(ev){
            var url = $(this).data('path') + $(this).val();
            $.get(url, function(html) {
                $container.html(html);
            });
        });
    }

    function triggerMostTabChange () {
        var $links = $('.box-los-mas .box-menu a');
        $links.click(function (ev){
            ev.preventDefault();
            var $this = $(this);
            var $tab = $this.data('tab');

            var $parent = $this.parents('.box-los-mas');

            $parent.find('.box-menu a').removeClass('active');
            $this.addClass('active');

            $parent.find('ul').hide();
            $parent.find('ul.' + $tab).show();
        });
    }

    var loginForm;
    function triggerLoginFormPopup () {
        $('#header-login-link').click(function(event){
            event.preventDefault();
            var url = $(this).prop('href');

            if (loginForm) {
                if (event.params && event.params.message) {
                    loginFormMessage(event.params.message);
                }
                openLoginForm();
            } else {
                $.post(url, function(form){
                    loginForm = true;

                    var $overlay = $('.overlay');
                    if (!$overlay.length) {
                        $overlay = $('<div>').addClass('overlay').appendTo($('body'));
                    } else {
                        $overlay.show();
                    }

                    $('body').append(
                        $(form)
                        .addClass('login-popup')
                    );

                    if (event.params && event.params.message) {
                        loginFormMessage(event.params.message);
                    }

                    triggerLoginPopupClose();
                    triggerLoginSubmit($('form.login'));
                });
            }

            return false;
        })
    }

    function loginFormMessage(message){
        $('.login-page-simple form')
            .prepend(
                $('<div>')
                    .addClass('error')
                    .text(message)
            );

        setTimeout(function() {
            $('.login-page-simple form .error').remove();
        }, 5000);
    }

    function openLoginForm() {
        $('.login-page-simple')
            .show();
        $('.overlay').show();
    }

    function closeLoginForm() {
        $('.login-page-simple')
            .hide();
        $('.overlay').hide();
    }

    function triggerLoginPopupClose() {
        $('form.login .cancel').click( function(event){
            event.preventDefault();
            $(this)
                .parents('.login-page-simple')
                .hide();
            $('.overlay').hide();
        });
    }

    function triggerCommentLoginSubmit() {
        var session_initiated = false;

        // comment logon form submit
        $('.login-page-session form').submit(function(event){
            event.preventDefault();

            if (!session_initiated) {

                var $form = $(this);
                $.getJSON('/user/init', function(data) {
                    if (data.error_code == 0) {
                        session_initiated = true;
                        triggerLoginSubmit($form);
                        $form.submit();
                    }
                });
            }
        });
    }

    function triggerLoginSubmit($form) {
        var $formContainer = $form.parent();
        $form
            .submit(function(event){
                event.preventDefault();
                var
                    $form = $(this),
                    url = $form.prop('action'),
                    params = {
                        url: url,
                        data: $form.serialize(),
                        type: 'post',
                        dataType: 'json',
                        success: function(data) {
                            if (data.error_code) {
                                var error_message = data.error_message;

                                // hardcode error message translation
                                if (error_message == "Bad credentials") {
                                    error_message = "Usuario o contraseña incorrecta";
                                }

                                $form.prepend('<div class="error">' + error_message + '</div>');
                                setTimeout(function() {
                                    $form.find('.error').remove();
                                }, 5000);

                                enableLoginForm($form);
                            } else {
                                $form.html('<div class="success">...</div>');

                                //document.location.reload();
                                wfCmsOnLogin(function() {
                                    closeLoginForm();
                                });
                                getLoginInfo();
                            }
                        },
                        error: function(event, data) {
                            enableLoginForm($form);
                        }
                    }
                    ;

                $formContainer.find('.error').remove();
                disableLoginForm($form);
                $.ajax(params);
            })
            .find('.submit')
                .on('click', function(event) {
                    event.preventDefault();
                    $(event.target).closest('form').submit();
                });
            ;
    }

    function enableLoginForm($form) {
        $form.find('input,.btn').removeClass('disabled').attr('enabled', true);
    }

    function disableLoginForm($form) {
        $form.find('input,.btn').addClass('disabled').attr('enabled', false);
    }

    function triggerArticleSizeChange() {
        var $article = $('.article-page.article'),
            maxSize = 1.5,
            minSize = 0.8;

        size = parseFloat(readCookie('_cms-font-size'));
        if (size) {
            $article.css('font-size', size+'em');
        } else {
            size = 1;
        }

        // increase or decrease article size
        $('.social-media-button-article.art-size div').click(function() {
            if ($(this).hasClass('number')) { // decrease
                size -= 0.1;
                size = Math.max(size, minSize);
            } else { // increase
                size += 0.1;
                size = Math.min(size, maxSize);
            }

            $article.css('font-size', size+'em');

            expDate = new Date();
            expDate.setYear(expDate.getYear() + 1);

            document.cookie = '_cms-font-size=' + size +
                ';domain=' + document.location.hostname +
                ';path=/' +
                ';expire=' + expDate.toGMTString();
        });
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function getLoginInfo() {
        var $userInfo = $('.header .user-links');

        $.getJSON('/user/welcome', function(data, status, jqXHR) {
            var routes = data.routes,
                strings = data.strings;

            if (status == 'success' && data.logged_in) {
                window.wfCmsLoggedInUser = data.user;

				//console.log( "[getLoginInfo()] - ga('set', '&uid', " + data.user.id + ")" );
				ga('set', '&uid', data.user.id );				
				ga('send', 'event', 'login', 'logged-in');

				ga('redElPaisTrk.set', '&uid', data.user.id );				
				ga('redElPaisTrk.send', 'event', 'login', 'logged-in');

                $(window).trigger('cms:user:logged-in', [data.user]);
                $userInfo
                    .find('.user-status')
                        .remove()
                    .end()
                    .prepend('\
                    <div class="user-welcome user-status">\
                            <div class="user-name">\
                                ' + strings.welcome + '\
                            </div>\
                            <ul class="user-options">\
                                <li>\
                                    <a href="' + routes.logout + '" >\
                                        ' + strings.logout + '\
                                    </a>\
                                </li>\
                                <li>\
                                    <a href="' + routes.profile + '">\
                                        ' + strings.profile + '\
                                    </a>\
                                </li>\
                            </ul>\
                    </div>\
                    ');
            } else {
                $(window).trigger('cms:user:logged-out', [routes, strings]);

                $userInfo
                    .find('.user-status')
                        .remove()
                    .end()
                    .prepend('<div class="user-status">\
                        <a href="' + routes.login + '" id="header-login-link">' + strings.login + '</a>\
                        <a href="' + routes.register + '">' + strings.register + '</a>\
                    </div>');
                triggerLoginFormPopup();
            }
        });
    }

    var printModal;
    function triggerArticlePrint() {
        $('.social-media-button-article.print div').click(function(){
            $('html, body').scrollTop(0);

            if (printModal) {
                triggerPrintPopupOpen();
            } else {
                printModal = true;
                var $modal = $('<div>')
                    .attr('id', 'article-print')
                    .addClass('print-popup')
                    .append(
                        $('<div>').addClass('popup-close')
                    ).append(
                        $('<div>').addClass('header')
                        .append(
                            $('<img>').attr('src', '/images/logos/elpais-menu-reversed.png')
                        ).append(
                            $('<div>')
                                .addClass('print')
                                .text('Imprimir nota')
                                .click(function(){
                                    window.print();
                                })
                        )
                    );

                var $article = $('.article-page.article');
                $modal
                    .append(safeCloneNode($article.find('.supra')))
                    .append(safeCloneNode($article.find('.title')))
                    .append(safeCloneNode($article.find('.top-box')))
                    .append(safeCloneNode($article.find('.intro')))
                    .append(safeCloneNode($article.find('.article-content')));

                $('body')
                    .append($modal)
                    .append(
                       $('<div>').addClass('overlay')
                   );

                triggerPrintPopupClose();
            }
        });
    }

    function safeCloneNode($el) {
        var $wrap;
        if ($el.prop('outerHTML')) {
            $wrap = $el.prop('outerHTML');
        } else {
            $wrap = $el.wrap('<div></div>').parent().html();
            $el.unwrap();
        }

        var rScript = new RegExp('<SCRIPT\\b.*?</SCRIPT>', 'img'),
            rObject = new RegExp('<OBJECT\\b.*?</object>', 'img'),
            rIframe = new RegExp('<IFRAME\\b.*?(/>|</IFRAME>)', 'img'),
            rIns = new RegExp('<INS\\b.*?</INS', 'img'),//outerHTML has some <INS tags
            strip = function(s, r) {
                while(r.test(s)) {
                    s = s.replace(r, '');
                }

                return s;
            };

        $wrap = strip($wrap, rIns);
        $wrap = strip($wrap, rScript);
        $wrap = strip($wrap, rObject);
        $wrap = strip($wrap, rIframe);
        return $($wrap).html();
    }

    function triggerPrintPopupOpen() {
        $('.print-popup').show();
        $('.overlay').show();
    }

    function triggerPrintPopupClose() {
        $('.overlay, .popup-close').click(function() {
            $('.print-popup').hide();
            $('.overlay').hide();
        });
    }

    function triggerArticleRating() {
        var loggedIn = false;

        // check if raty is loaded (only loads in article page)
        if( $.isFunction( $.fn.raty ) ){
            var $star = $('#star');

            $star.on('click', function(){
                // trigger login form popup
                e = jQuery.Event("click");
                e.params = {
                    'message': 'Para poder realizar votaciones usted debe ingresar al sistema. Por favor, inténtelo de nuevo.',
                };
                $('#header-login-link').trigger(e);
            });


            // if user is logged in allow to vote once
            var options = {
                path: '/images/icons',
                hints: [
                    'Desinteresa/No Aporta',
                    'Común/Importa Poco',
                    'Interesante',
                    'Muy Interesante',
                    'Excelente/Gran Aporte'
                ],
                // readOnly: true,
                space: false,
                score: function() {
                    return $(this).data('score');
                },
                click: function(score, evt) {
                    var $this = $(this);
                    wfCmsOnLogin(function(ev, user) {
                        loggedIn = true;
                        processArticleRating($this, score, options);
                    });
                },
            };

            $star.raty(options);
        }
    }

    function processArticleRating($this, score, options) {
        var article_id = $this.data('id');
        var url = '/module/rate/' + $this.data('type') + '/' + article_id + '/' + score;

        // check if article has been voted before
        var ids = readCookie('_cms-article-rating');
        if (ids && ids.match(article_id)) {
            alert('Solo se puede votar una noticia una sola vez.');
            $('#star').raty('score', $('#star').data('score'))
            return;
        }

        // post vote
        $.ajax(url, {
            type: 'POST',
            success: function(data){
                alert('Gracias por calificar la noticia.');
                $this.parents('.rating')
                    .html(data);

                $('#star').raty(options);

                // add cookie
                if (ids) {
                    ids = ids + ',' + article_id;
                } else {
                    ids = article_id;
                }

                expDate = new Date();
                expDate.setYear(expDate.getYear() + 1);

                document.cookie = '_cms-article-rating=' + ids +
                    ';domain=' + document.location.hostname +
                    ';path=/' +
                    ';expire=' + expDate.toGMTString();
            }
        });
    }

    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
          from += len;

        for (; from < len; from++) {
          if (from in this &&
              this[from] === elt)
            return from;
        }
        return -1;
      };
    }

    function triggerHoverIos() {
        //ugly hack
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
            $('.masios').bind('click', function(e) {
                if ($(e.target).hasClass('masios')) {
                    e.preventDefault();
                }
            });
        }
    }

    var sendMailForm = false;
    function triggerArticleMail(){
        $('.social-media-button-article.mail div').click(function(){
            var $this = $(this);

            var $overlay = $('.overlay');
            if (!$overlay.length) {
                $overlay = $('<div>').addClass('overlay').appendTo($('body'));
            } else {
                $overlay.show();
            }

            if (!window.wfCmsLoggedInUser) {
                e = jQuery.Event("click");
                e.params = {
                    'message': 'Por favor, ingrese su usuario y contraseña para enviar la noticia.',
                };
                $('#header-login-link').trigger(e);

                wfCmsOnLogin(function(ev, user) {
                    // after login trigger open mail form again
                    $this.click();
                });

                return;
            }

            if (!sendMailForm) {
                sendMailForm = true;
                $.ajax('/module/mail',
                {
                    type: "GET",
                    success: function(data){
                        $overlay.show();

                        // kill previous recaptcha - there can be only one!
                        Recaptcha.destroy();

                        $('body').append(data);

                        //function already exists in article page, loaded by comment form
                        genemu_recaptcha_load(null, 'form_mail_captcha_div');

                        triggerMailPopupClose();
                        triggerMailFormSubmit();
                    },
                    error: function(){
                        sendMailForm = false;
                    },
                });
            }
        });
    }

    function triggerMailPopupClose() {
        $('.overlay, .popup-close').click(function() {
            //remove captcha from mail popup, recreate in comment form
            Recaptcha.destroy();
            genemu_recaptcha_load();

            sendMailForm = false;
            $('.mail-popup').remove();
            $('.overlay').hide();
        });
    }

    function triggerMailFormSubmit() {
        $('.mail-popup')
        .on('submit', 'form', function(event){
            event.preventDefault();

            var $this = $(this);
            var successMessage = 'Envío realizado';

            $this.parent().css('cursor', 'wait');

            $this.find('#form_article_id').prop('value', $('.social-media-button-article.mail').data('id'));
            $this.find('#form_article_title').prop('value', $.trim($('.article-page .title').text()));
            $.post($this.prop('action'), $this.serialize(), function(data) {
                $this.parent().css('cursor', 'default');
                if (data == 'mail_sent') {
                    $this.parent()
                        .find('.title').remove().end()
                        .find('form').remove().end()
                        .append(
                            $('<div>')
                                .addClass('success')
                                .text(successMessage)
                        )
                        ;
                } else {
                    $this.parent().html(data);
                    genemu_recaptcha_load(null, 'form_mail_captcha_div');
                }
            });
        });
    }

    function mobileCheck() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check && !(new RegExp('_force=2').exec(document.cookie));
    }

    function displayMobilePopup(){
        if (mobileCheck()) {
            $('.mobile-redirect')
            .show()
            .find('a').click(function(event){
                event.preventDefault();

                // expire force desktop version cookie
                document.cookie = '_force=' +
                    ';domain=' + document.location.hostname +
                    ';path=/' +
                    ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                var host = document.location.protocol + '//' +
                        document.location.host.replace(/^(www.)?/, 'm.'),
                    mUrl = host + document.location.pathname;
                window.location.replace(mUrl);
            });
        };
        return null;
    };
    
    function addPlayButtonSmall(){
        $(".video-icon-play-small").each(function() { 
        var href = $(this).find('.image.page-link').attr('href');
        $(this).find('.image.page-link').after('<a href="'+href+'" class="video-icon-midle page-link"></a>');
        });
    };
    
    function addPlayButtonBig(){
        $(".video-icon-play-big").each(function() { 
        var href = $(this).find('.image.page-link').attr('href');
        $(this).find('.image.page-link').after('<a href="'+href+'" class="video-icon page-link"></a>');
        });
    };
    
    function addPlayButtonDoble(){
        $(".video-icon-play-doble").each(function() { 
        var href = $(this).find('.image.right.videoplay.page-link').attr('href');
        $(this).find('.image.right.videoplay.page-link').after('<a href="'+href+'" class="video-icon-midle page-link"></a>');
        });
    }
    
    function addPlayButtonEspecial(){
        $(".video-icon-play-especial").each(function() { 
        var href = $(this).find('.video-content .text .news-title.page-link ').attr('href');
        $(this).find('.image').after('<a href="'+href+'" class="video-icon page-link"></a>');
        });
    }
    
    function addPlayButtonEspecialSmall(){
        $(".video-icon-play-especial-small").each(function() { 
        var href = $(this).find('.article-head .news-title.page-link ').attr('href');
        $(this).find('.image').after('<a href="'+href+'" class="video-icon-midle page-link"></a>');
        });
    }
    
    function addGaleriaButtonSmall(){
        $(".galeria-small").each(function() { 
        var href = $(this).find('.image.page-link').attr('href');
        $(this).find('.image.page-link').after('<a href="'+href+'" class="icon-galeria-small page-link"></a>');
        });
    }
    
    function addGaleriaButtonBig(){
        $(".galeria-big").each(function() { 
        var href = $(this).find('.image.page-link').attr('href');
        $(this).find('.image.page-link').after('<a href="'+href+'" class="icon-galeria-big page-link"></a>');
        });
    }
    
    function addGaleriaButtonDoble(){
        $(".galeria-doble").each(function() { 
        var href = $(this).find('.image.right.videoplay.page-link').attr('href');
        $(this).find('.image.right.videoplay.page-link').after('<a href="'+href+'" class="icon-galeria-small page-link"></a>');
        });
    }
    
    function addGaleriaButtonDobleEspecial(){
        $(".galeria-doble-especial").each(function() { 
        var href = $(this).find('.image.right.videoc.page-link').attr('href');
        $(this).find('.image.right.videoc.page-link').after('<a href="'+href+'" class="icon-galeria-small page-link"></a>');
        });
    }
    
    function addGaleriaSprite(){
        $('.box-multimedia.left-side .article').each(function(){
            var href = $(this).find('.image').attr('href');
            $(this).find('.image').after('<a href="'+href+'" class="galeria-icon-button"></a>');
        });
    }
    
    function addGaleriaButtonEspecialSmall(){
        $(".galeria-especial-small").each(function() { 
        var href = $(this).find('.article-head .news-title.page-link ').attr('href');
        $(this).find('.image').after('<a href="'+href+'" class="icon-galeria-small page-link"></a>');
        });
    }
    
    function addGaleriaButtonEspecial(){
        $(".galeria-especial-big").each(function() { 
        var href = $(this).find('.video-content .text .news-title.page-link ').attr('href');
        $(this).find('.image').after('<a href="'+href+'" class="icon-galeria-big page-link"></a>');
        });
    }

    $(document).ajaxSend(function (event, request, settings) {
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    });
});