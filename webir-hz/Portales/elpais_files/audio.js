jQuery(function($) {

    var OMAudio = function($el, options) {
        var rand = Math.floor(Math.random()*111111);
        var VIDEO_CONFIG = {
                id:"strobemediaplayback"+rand,
                src: '',
                // width: 516,
                height: 35,
                autoPlay: true,
                playButtonOverlay: false,
                controlBarAutoHide: false,
                //enableStageVideo: false,
                favorFlashOverHtml5Video:true,
                swf:'/javascripts/epplayer/StrobeMediaPlayback.swf',
                plugin_ads: "/javascripts/epplayer/AdvertisementPlugin.swf",
                // javascriptCallbackFunction: "onWFJavaScriptBridgeCreated"
        };
        this.videoConfig = VIDEO_CONFIG;

        var self = this;
        this.$els = $el;
        this.$els.each(function(){
            self.$el = $(this);
            self.$el.on('click', function(ev) {
                ev.preventDefault();
            });

            self.$onClickContainer = self.$el.closest('.audio-container');
            self.$onClickContainer.on('click', function(ev) {
                ev.preventDefault();
                self.playModal($(this));
            });

            self.$onClickContainer = self.$el.closest('.audio-container-inline');
            self.$onClickContainer.on('click', function(ev) {
                ev.preventDefault();
                self.playInline($(this));
            });


            self.$el.data('omAudio', self);
        });
    }

    OMAudio.prototype.domainName = function(url) {
        return 'http://' + document.location.hostname;
    }

    OMAudio.prototype.playInline = function($container) {
        var $popup,
            $html,
            $close,
            $audio_player,
            audio_player,
            $el = $container.find('.audio-player-image'),
            aHref = $el.attr('href'),
            $existingPopup = $('body').find('.video-overlay');

        $existingPopup.remove();
        $html = $('<div class="video-overimage">\
                <div id="strobemediaplayback"> </div>\
                        <a href="#" class="icon-remove close"></a>\
                    <div>');
        $popup = $container.find('.video-overimage');
        if($popup.length==0)
            $container.append($html);
        $popup = $container.find('.video-overimage');
        $playerContainer = $container.find("#strobemediaplayback");
        $playerContainer.attr('style','background:#000');

        var width = $container.css('width'),
            height = $container.css('height');

        this.videoConfig.width = width;
        this.videoConfig.height = height;

        try {
            //flash player
            this.videoConfig.src = this.domainName() + aHref;
            $audio_player = $playerContainer.strobemediaplayback(this.videoConfig);
            audio_player = $audio_player[0];
            // $playerContainer.html(audio_player);
            $popup.show();
        } catch (e) {
            //html5 player
            audio_player = '<audio src="'+aHref+'" \
                            controls="controls">\
                            </audio>\
                    ';
            $playerContainer.html(audio_player);

            var audio = $container.find('audio');
            audio.css('width', width);
            audio.css('height', height);

            if (audio.get(0).paused == false) {
                audio.get(0).pause();
                $popup.hide();
            } else {
                $popup.show();
                audio.get(0).play();
            }
        }
    }

    OMAudio.prototype.playModal = function($container) {
        var $popup,
            $html,
            $close,
            audio_player,
            $audio_player,
            $el = $container.find('.audio-player-image'),
            aHref = $el.attr('href'),
            $existingPopup = $('body').find('.video-overlay');

        $existingPopup.remove();


        $html = $('<div class="video-overlay"><div class="overlay"></div><div class="audio-popup">\
                        <a href="#" class="icon-remove close"></a>\
                        <div id="strobemediaplayback"> </div>\
                    </div></div>');
        $popup = $html.find('.audio-popup');
        $playerContainer = $popup.find("#strobemediaplayback");

        $('body').append($html);
        var width = $popup.css('width'),
            height = $popup.css('height'),
            $overlay = $html.find('.overlay');

        this.videoConfig.width = width;
        this.videoConfig.height = height;

        try {
            this.videoConfig.src = this.domainName()+aHref;
            $audio_player = $playerContainer.strobemediaplayback(this.videoConfig);
            audio_player = $audio_player[0];
            $playerContainer.html(audio_player);
            $overlay.on('click', function(ev) {
                ev.preventDefault();
                $html.remove();
            });

        } catch (e) {
            //html5 player
            audio_player = '<audio src="'+aHref+'" \
                            controls="controls">\
                            </video>\
                    ';
            $playerContainer.html(audio_player);

            var video = $popup.find('video');
            video.css('width', width);
            video.css('height', height);

            $overlay.on('click', function(ev) {
                ev.preventDefault();
                video.get(0).pause()
                $html.remove();
            });
        }

        var $close = $popup.find('.close');

        $close.on('click', function(ev) {
            ev.preventDefault();
            $html.remove();
        });

    }


    $.fn.omAudio = function(options, $el) {
        var omAudio;
        if (options === true) {
            return this.data('omAudio');
        } else if (typeof options == 'string') {
            omAudio = new OMAudio(this, options);
            omAudio[options].call(omAudio, this);
            return this;
        }

        omAudio = this.data('omAudio');
        if (omAudio) {
            return this;
        }

        omAudio = new OMAudio(this, options);

        return this;
    }
    if ($.browser.msie) {
        setTimeout(function(){
            $('.audio-player-image').omAudio();
        }, 200);
    } else {
        $('.audio-player-image').omAudio();
    }

    window.OMAudio = OMAudio;
});
