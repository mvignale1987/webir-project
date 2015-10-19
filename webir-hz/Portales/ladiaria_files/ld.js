
/*
 * BOOTSTRAP ALERT 
 */
bootstrap_alert = function () {}
bootstrap_alert.warning = function (message) {
    $('#alert_placeholder').html('<div class="alert"><a class="icon-remove close" data-dismiss="alert"></a><span>' + message + '</span></div>')
}

jQuery(document).ready(function ($) {
    $(function () {


        /*
         * MENU PRINCIPAL
         */


        // STYLE CURRENT PAGE LINK
        var dropdown_open = false;
        $('#principal .dropdown a').each(function () {
            if (location.href.indexOf(this.href) !== -1) {
                var li = $(this).closest('li').addClass("active");
                li.closest('.dropdown').addClass('current').addClass('open');
                dropdown_open = true;
            }
        });

        if (!dropdown_open) {
            $('#principal .dropdown').first().addClass('current open');
        }
        $('#principal .dropdown-menu a ').click(function(e) {
            e.stopPropagation();
        });



        /*
         * PINS
         */


        $('.pin').each(function () {
            var pin = $(this);
            pin.click(function (e) {
                e.preventDefault();
                $.ajax({
                    type: "GET",
                    url: pin.attr('href') + (pin.hasClass('selected') ? 'unfollow' : 'follow'),
                    cache: false,
                    dataType: "html",
                    success: function (html, textStatus) {
                        pin.toggleClass('selected')
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log('error');
                    }
                });
            });
        });

        /*
         * enviar artículo por email
         */

        $('.send_by_email').each(function () {
            var art_id = $(this).attr('data-id');
            var art_title = $(this).attr('data-title');
            $(this).on('click touchstart', function () {
                $('#id_article_id').val(art_id);
                $('#send-by-email-article-title').html(art_title);
            });
        });

        var send_email_form = $('form#send_by_email');
        send_email_form.submit(function () {
            $.post(send_email_form.attr("action"), send_email_form.serialize(), function (data) {
                if (data.status == "OK") {
                    var content = '<div class="alert alert-success alert-dismissable"> <button type="button" class="close" data-dismiss="alert" aria-hidden="true"> '
                        + '<span class="icon-remove pull-right"></span></button><p>Artículo enviado a ' 
                        + data.email
                        + '</p></div>';
                    $('#send-by-email-form-messages').prepend(content);
                } else {
                    var content = '<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true"> '
                        + '<span class="icon-remove pull-right"></span></button><p>' 
                        + data.errors
                        + '</p></div>';
                    $('#send-by-email-form-messages').prepend(content);
                }
            });
            return false;
        });


        // Calendario de ediciones

        var $modal = $('#choose_edition');

        function leadingZero(value){
           if(value < 10){
              return value.toString().substring(1);
              // console.log(value);
           }
           return value.toString();
        }

        $('.current_edition a').on('click', function () {
            //$('body').modalmanager('loading');
            var $current_edition = $(this);
            var $calendar = $('#edition_calendar');
            var anio = leadingZero($current_edition.attr('data-anio'));
            var mes = leadingZero($current_edition.attr('data-mes'));
            $calendar.load('/ediciones/' + anio + '/' + mes + '/', '', function () {
                $modal.modal();
                $('#edition_calendar table').addClass('table');
            });

            var $choose_edition = $('#choose_edition');


            $choose_edition.find('.anios li[data-anio=' + anio + ']').addClass('active');

            $choose_edition.find('.meses li[data-mes=' + mes + ']').addClass('active');

            $anos = $choose_edition.find('.anios li');
            $anos.click(function () {
                anio = $(this).attr('data-anio');
                $anos.removeClass('active');
                $(this).addClass('active');
                $calendar.load('/ediciones/' + anio + '/' + mes + '/', '', function () {
                  $('#edition_calendar table').addClass('table');
                });
            });
            $meses = $choose_edition.find('.meses li')
            $meses.click(function () {
                mes = $(this).attr('data-mes');
                $meses.removeClass('active');
                $(this).addClass('active');
                $calendar.load('/ediciones/' + anio + '/' + mes + '/', '', function () {
                  $('#edition_calendar table').addClass('table');
                });
            });
        });

        var socialCount = function (article, platform) {
            jQuery.ajax('/share/' + platform + '/' + article.attr('data-id'));
            var count = article.find('.count.' + platform);
            count.html(parseInt(count.html(), 10) + 1);
            count.show();
            var count_global = article.find('.count.global');
            count_global.html(parseInt(count_global.html(), 10) + 1);
            count_global.show();
        }

        var sumToGlobalCount = function (el, count) {
            var toolbar = el.closest('.share');
            var count_global = toolbar.find('.count.global').first();
            count_global.html(parseInt(count_global.html(), 10) + count);
        }
        $(function () {
        $('.googlePlus').sharrre({
            share: {
                googlePlus: true
            },
            template: '<a href="#googlePlus"><span class="fa fa-2x fa-google-plus"></span></a>',
            enableHover: false,
            enableTracking: true,
            click: function (api, options) {
                api.simulateClick();
                api.openPopup('googlePlus');
            },
            urlCurl: '',
        });

        $('.twitter').sharrre({
            share: {
                twitter: true
            },
            template: '<a href="#twitter"><span class="fa fa-2x fa-twitter"></span><span class="count twitter">{total}</span></a>',
            enableHover: false,
            enableTracking: true,
            buttons: {
                twitter: {
                    via: 'ladiaria'
                }
            },
            click: function (api, options) {
                api.simulateClick();
                api.openPopup('twitter');
            },
            render: function (el, options) {
                sumToGlobalCount($(el.element), options.total);
            }
        });
        $('.facebook').sharrre({
            share: {
                facebook: true
            },
            template: '<a href="#facebook"><span class="fa fa-2x fa-facebook"></span><span class="count twitter">{total}</span></a>',
            enableHover: false,
            enableTracking: true,
            click: function (api, options) {
                api.simulateClick();
                api.openPopup('facebook');
            },
            render: function (el, options) {
                sumToGlobalCount($(el.element), options.total);
            }
        });
        $('.linkedin').sharrre({
            share: {
                linkedin: true
            },
            template: '<a href="#linkedin"><span class="fa fa-2x fa-linkedin"></span><span class="count twitter">{total}</span></a>',
            enableHover: false,
            enableTracking: true,
            click: function (api, options) {
                api.simulateClick();
                api.openPopup('linkedin');
            },
            render: function (el, options) {
                sumToGlobalCount($(el.element), options.total);
            }
        });
        });
        /*
         * INPLACEDIT
         */

        $('#ActivateInplaceEdit').click(function () {
            $('.inplace_edit_show').toggle();
        });



        /*
         * SECTION INFINITE SCROLL
         */
            $('#content').infinitescroll({
                navSelector: "#section_nav",
                // selector for the paged navigation (it will be hidden)
                nextSelector: ".next_link",
                // selector for the NEXT link (to page 2)
                itemSelector: "#content section.section_module",
                // selector for all items you'll retrieve
                loadingText: "Cargando...",
                donetext: "Fin!",
                bufferPx: 400,
                path: function () {
                    return $('.next_link').last().attr('href');
                }
            }); 


        /*
         * CIENTOCUARENTA SUBMIT
         */

        var cientocuarenta_form = $('#140modal form');
        cientocuarenta_form.submit(function () {
            var text = cientocuarenta_form.find('#id_body').first();
            if (text.val()) {
                $.ajax({
                    data: $(this).serialize(),
                    type: $(this).attr('method'),
                    url: $(this).attr('action'),
                    success: function (response) {
                        $('#140modal div.response').html(response);
                        text.val('');
                    },
                    error: function (response) {
                        $('#140modal div.response').html(response);
                    }
                });
            }
            return false;
        });

        /*
         * INVITE SUBMIT
         */

        var invite_form = $('#invita form');
        invite_form.submit(function () {
            $.post(invite_form.attr("action"), invite_form.serialize(), function (data) {
                if (data.status == "OK") {
                    $('#invitation-form-messages').html("<p>Invitación enviada a " + data.email + "</p>");
                    $('.empty-invites').remove();
                    $('.invite-list').append("<li>" + data.email + "</li>");
                    form.find('input[type=text]').val("");
                    $('.invitations_remaining').html(data.invitations_remaining);
                    if (data.invitations_remaining == 0) {
                        $('li.invita').hide();
                    }
                } else {
                    $('#invitation-form-messages').html(data.errors);
                }
            });
            return false;
        });

        /*
         * TOOLTIP
         */

        $('body').tooltip({
            selector: '[rel=tooltip]'
        });

        /*
         * sub-navigation-fixed
         */

        $('#sub-navigation-fixed li a').on('click', function () {
            setTimeout(function () {
                $(window).scrollTop($(window).scrollTop() - 40);
            }, 100);
        });


        /*
        * Affixes
        */

        var content_affix_top = $('#page_header').outerHeight(true) + 
                    $('section header.titlebar').outerHeight(true) + 
                    $('#header-pub').outerHeight(true) + 
                    $('#strip').outerHeight(true) -
                    60;

        var sidebar_right_affix_top = content_affix_top +
                    $('#right-col .sidebar-square-banner').outerHeight(true) +
                    30;


        var content_affix_bottom = $('#page_footer').outerHeight(true) + 
                                $('#nav_footer').outerHeight(true) +
                                12;

        var sidebar_right_affix_bottom = content_affix_bottom +
                    $('#footer-pub').outerHeight(true) +
                    12;
        /*
        * Sidebar banner skyscraper
        */
        $('#sidebar-skyscraper > .wrapper').affix({
        offset: {
          top: 30
        , bottom: content_affix_bottom
        }
        })

        /*
        * Sidebar article page  class="affix-top" data-spy="affix" data-offset-top="350" data-offset-bottom="600"
        */
        $('#fixed-right > .wrapper').affix({
        offset: {
          top: sidebar_right_affix_top
        , bottom: sidebar_right_affix_bottom
        }
        })

        /*
        * Toolbar article page  class="affix-top" data-spy="affix" data-offset-top="350" data-offset-bottom="600"
        */
        $('#toolbar > .wrapper').affix({
            offset: {
              top: content_affix_top
            , bottom: content_affix_bottom
            }
        })
     

        var scroll_start = 0;
        var show_strip_edition = $('.show_strip_edition');
        var offset_strip_edition = show_strip_edition.offset();
        $(document).scroll(function() { 
            scroll_start = $(this).scrollTop();
            if(scroll_start > offset_strip_edition.top) {
              $('#strip-edition').removeClass('collapse');
            } else {
              $('#strip-edition').addClass('collapse');
            }
        });


    });
});