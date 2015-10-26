
			

jQuery(function($) {

	triggerArticleLimelightPlayer();

	function triggerArticleLimelightPlayer() {
	//console.log("triggerArticleLimelightPlayer()");
        if (window.limelightVideoId) {
            $.getScript('http://assets.delvenetworks.com/player/embed.js', function(){
                $('.video-limelight').html('<div class="LimelightEmbeddedPlayer">' +
                    '<object type="application/x-shockwave-flash" id="limelight_player_357301" name="limelight_player_357301" class="LimelightEmbeddedPlayerFlash" width="615" height="388" data="http://assets.delvenetworks.com/player/loader.swf">' +
                        '<param name="movie" value="http://assets.delvenetworks.com/player/loader.swf"/>' +
                        '<param name="wmode" value="window"/>' +
                        '<param name="allowScriptAccess" value="always"/>' +
                        '<param name="allowFullScreen" value="true"/>' +
                        '<param name="flashVars" value="defaultQuality=600&amp;startQuality=600&amp;playerForm=Player&amp;mediaId=' + window.limelightVideoId   + '"/>' +
                    '</object>' +
                    '<script>LimelightPlayerUtil.initEmbed("limelight_player_357301");</script>' +
                '</div>');
            });


        };
    }

});

    var g_param_c1 = "2";
    var g_param_c2 = "6906621";
    var g_param_c3 = "";
    var g_param_c4 = "";
    var g_event_buffering = "BUFF";
    var g_event_end = "END";
    var g_event_play = "PLAY";
    var g_event_pause = "PAUSE";
    var g_player_key = "limelight_player_357301";
    var g_duration = 0;
    var streamSense = null;
	

	
	
    window.limelightChannels = [
    {"name":"automovilismo","id":"46658694d13b4e828795169c26d0ccad"},
    {"name":"divertite","id":"4c08951b7b464d6f9c80c2ec7af2a4ed"},
    {"name":"domingo","id":"1bce0332ea584bd5b73f964f2303c512"},
    {"name":"economia","id":"6c849a6f0d9f436db31b50b68a0d335f"},
    {"name":"el-empresario","id":"656db443a5c84f4a85363cd49a35f63a"},
    {"name":"eliminatorias","id":"483d28fb92b94d3caf118c0f7844a658"},
    {"name":"especiales","id":"2a05b1e765f246b9acd6250f65a15794"},
    {"name":"futbol","id":"3651b325d3514dff81ded5de7c4a3345"},
    {"name":"futbol-internacional","id":"b78201b6745c43c8bd8e3c624dab4c10"},
    {"name":"informacion","id":"6256839d2811416ab0b8ed045e4e76fc"},
    {"name":"multideportivo","id":"d8c1224cf2084b22b93f341f41df0886"},
    {"name":"mundo","id":"89ca0e120b654326974ba53177d68f4b"},
    {"name":"noticias","id":"d263b17ccd804bd687d0436a4f1779af"},
    {"name":"opinion","id":"4aaa4d518cfc42ddb3d88956f318cf51"},
    {"name":"que-pasa","id":"5909c7d56a6b4cfc897611529e53770d"},
    {"name":"sabado-show","id":"a90c725813ff4179801d484beaee4393"},
    {"name":"showdegoles","id":"8eea67ed5b7c42bbadbfba31e8509d49"},
    {"name":"tenis","id":"30c0b3e534c34cbda6b4af5d1ffdeb5c"},
    {"name":"turf","id":"0593c51b17a2402fa934535432eb46a4"},
    {"name":"vida-actual","id":"a28639d5afae47a0ac4aa51b33481914"},
    {"name":"mundial","id":"d8ea65a4617f403fb7f96a91cd727c54"}
    ];

    function getLimelightChannel(){
        var sectionName = window.location.pathname.split( '/' );
        var sectionSlug = sectionName[1].toLowerCase();
        
        switch(sectionSlug){
            case "se-dice":
            case "ecos":            
                sectionSlug="opinion";
                break;
            case "basquetbol":
            case "rugby":            
                sectionSlug="multideportivo";
                break;
            case "sociales":
                sectionSlug="vida-actual";
                break;
            case "economia-y-mercado":
                sectionSlug="economia";
                break;  
            case "tvshow":
                sectionSlug="";
                break;  
               
            
        }
        
        if(sectionSlug=="") return "";
        
        for(var index in window.limelightChannels){
            
            if(window.limelightChannels[index].name == sectionSlug){
                return window.limelightChannels[index].id; 
            }           
        }
        
        return "";
    
    };

    
	function delvePlayerCallback(playerId, eventName, data) {
		//console.log("delvePlayerCallback: " + eventName);
		if (eventName == 'onPlayerLoad' && (DelvePlayer.getPlayers() == null || DelvePlayer.getPlayers().length == 0)) {
			DelvePlayer.registerPlayer(g_player_key);
		}
		switch (eventName) {
			case 'onPlayStateChanged':
				doOnPlayStateChanged(data);
				break;
			case 'onMediaLoad':
				doOnMediaLoad(data);
				break;
                        case 'onMediaComplete':
				videoTracking(g_event_end);
				break;
		}
	}

	function setDomain(){
		//console.log("setDomain()");
		var dominio = document.domain;
		var isMobile = false;//mobileCheck();
		if(dominio.toLowerCase().indexOf("elpais.com.uy")!=-1){
			g_param_c3 = "elpais";
			if(isMobile) g_param_c3 = "mobile-elpais";
		}else if(dominio.toLowerCase().indexOf("ovaciondigital.com.uy")!=-1){
			g_param_c3 = "ovacion";
			if(isMobile) g_param_c3 = "mobile-ovaciondigital";
		}else if(dominio.toLowerCase().indexOf("tvshow.com.uy")!=-1){
			g_param_c3 = "tvshow";
			if(isMobile) g_param_c3 = "mobile-tvshow";
		}else{
			g_param_c3 = dominio;
		}
	}

	function setSection(){
		//console.log("setSection()");
		var array_paths = window.location.pathname.split("/");
		for(var x=0; x<array_paths.length; x++){
			if(array_paths[x] != undefined && array_paths[x] != null && array_paths[x] != ""){
				g_param_c4 = array_paths[x];
				break;
			}
		}
	}

	function doOnPlayStateChanged(e) {
		//console.log("doOnPlayStateChanged()");
		if (e.isBusy) {
                    videoTracking(g_event_buffering);
		} else if (e.isPlaying) {
                    videoTracking(g_event_play);				
		} else {
                    videoTracking(g_event_pause);
		}
	}
				
	function doOnMediaLoad(e) {
		//console.log("doOnMediaLoad()");
		if(typeof(window.limelightVideoId)=="undefined") return;

		g_duration = e.durationInMilliseconds;
		setDomain();
		setSection();
		initComscoreStreamSense();
		
	}
				
	function initComscoreStreamSense(){
		
		if(streamSense==null){
			//console.log("initComscoreStreamSense()");
			streamSense = new ns_.StreamSense({}, 'http://b.scorecardresearch.com/p?c1=' + g_param_c1 + '&c2='+ g_param_c2 +'&ns_site='+g_param_c3);
		}
		var clips = [];
		clips[1] = {
				
				// Internal Content ID
				ns_st_ci: window.limelightVideoId,
				
				// Program Name (nopertti: Este campo es optional)
				ns_st_pr: $('meta[name=title]').attr('content'),
				
				// Playlist title (nopertti: Este campo es optional)
				//ns_st_pl: "Noticias de Futbol y Deportes",
				
				// Episode Title (nopertti: Este campo es optional)
				ns_st_ep: $('meta[name=title]').attr('content'),
				
				// Content Genre Description (nopertti: Este campo es optional)
				//ns_st_ge: "Deportes",
				ns_st_ge: g_param_c4,
				
				// Stream Type (nopertti: Este campo es optional)
				ns_st_ty: "vod"
			
		}
		
		streamSense.setClip(clips[1]);
		//Predefined labels
		streamSense.setLabel("ns_st_mp", "LimeLight Player 5.13.9");
                streamSense.getClip().setLabel("ns_st_cl", g_duration);
	}
			
	function playVideo(){
		//console.log("playVideo()");
		videoTracking(g_event_play);
		DelvePlayer.doPlay();
	}
				
	function pauseVideo(){
		//console.log("pauseVideo()");
		videoTracking(g_event_pause);
		DelvePlayer.doPause();
	}
				
	function videoTracking(event) {
		var position = DelvePlayer.doGetPlayheadPositionInMilliseconds() / 1000;
		switch (event) {
                    case g_event_buffering:
                            streamSense.notify(ns_.StreamSense.PlayerEvents.BUFFER, {}, position);
                            break;
                    case g_event_play:
                            streamSense.notify(ns_.StreamSense.PlayerEvents.PLAY, {}, position);
                            break;
                    case g_event_pause:
                            streamSense.notify(ns_.StreamSense.PlayerEvents.PAUSE, {}, position);
                            break;
                    case g_event_end:
                            streamSense.notify(ns_.StreamSense.PlayerEvents.END, {}, g_duration);
                            break;
			
		}
	}


jQuery(function($) {

	   var OMVideo = function($el, options) {
        var rand = Math.floor(Math.random()*111111);
        var VIDEO_CONFIG = {
                id:"strobemediaplayback"+rand,
                src: '',
                width: 516,
                height: 324,
                autoPlay: true,
                //enableStageVideo: false,
                favorFlashOverHtml5Video:true,
                swf:'/javascripts/epplayer/StrobeMediaPlayback.swf',
                plugin_ads: "/javascripts/epplayer/AdvertisementPlugin.swf",
                //javascriptCallbackFunction: "onWFJavaScriptBridgeCreated"

                plugin_mast: "/javascripts/epplayer/MASTPlugin.swf", // allow use of mast/vast
                src_namespace_mast:'http://www.akamai.com/mast/1.0', // allow use of mast/vast
                src_mast_uri:'http://servicios.elpais.com.uy/Includes/11/player/osmf/mast.xml', // allow use of mast/vast
        };

        // if vast ads variable exists
        if(('EP_VIDEO_VAST_URI' in window) && (EP_VIDEO_VAST_URI!="")){
            //they assign at config player
            VIDEO_CONFIG.src_mast_uri = EP_VIDEO_VAST_URI;
        }

        this.videoConfig = VIDEO_CONFIG;

        if ('EP_VIDEO_ADS' in window) {
            for (x in EP_VIDEO_ADS){
                    var match_url = document.location.pathname.match('^'+x);
                if (match_url && match_url.length > 0) {
                    for (y in EP_VIDEO_ADS[x]) {
                        if((y+"").indexOf("ads_")!=-1){
                            this.videoConfig = $.extend({}, this.videoConfig, eval("({"+y+":'"+eval("EP_VIDEO_ADS[x]."+y)+ "'})"));
                        }
                    }
                }
            }
        }

        var self = this;
        this.$els = $el;
        this.$els.each(function(){
            self.$el = $(this);
            self.$el.on('click', function(ev) {
                ev.preventDefault();
            });
            self.$onClickContainer = self.$el.closest('.video-container');
            self.$onClickContainer.on('click', function(ev) {
                ev.preventDefault();
                self.playModal($(this));
            });

            self.$onClickContainer = self.$el.closest('.video-container-inline');
            self.$onClickContainer.on('click', function(ev) {
                ev.preventDefault();
                self.playInline($(this));
            });
            self.$el.data('omVideo', self);
        });
    }

    OMVideo.prototype.domainName = function(url) {

        return 'http://' + document.location.hostname;
        //return url.match(/:\/\/(.[^/]+)/)[1];
    }

    OMVideo.prototype.playInline = function($container) {
        var $popup,
            $html,
            $close,
            $video_player,
            video_player,
            $el = $container.find('.video-play'),
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

        if ($el.data('limelightid') && $el.data('limelightid') !== 'undefined') {
            this.playLimelight($playerContainer, $el.data('limelightid'), width, height);
            return;
        };

        try {
            //flash player
            this.videoConfig.src = this.domainName() + aHref;
            $video_player = $playerContainer.strobemediaplayback(this.videoConfig);
            video_player = $video_player[0];
            //$playerContainer.html(video_player);
            $popup.show();

        } catch (e) {
            //html5 player
            video_player = '<video src="'+aHref+'" \
                            controls="controls">\
                            </video>\
                    ';
            $playerContainer.html(video_player);

            var video = $container.find('video');
            video.css('width', width);
            video.css('height', height);

            if (video.get(0).paused == false) {
                video.get(0).pause();
                $popup.hide();
            } else {
                $popup.show();
                video.get(0).play();
            }
        }
    }


    OMVideo.prototype.playModal = function($container) {
        var $popup,
            $html,
            $close,
            video_player,
            $video_player,
            $el = $container.find('.video-play'),
            aHref = $el.attr('href'),
            $existingPopup = $('body').find('.video-overlay');


        $existingPopup.remove();

        $html = $('<div class="video-overlay"><div class="overlay"></div><div class="video-popup">\
                        <a href="#" class="icon-remove close"></a>\
                        <div id="strobemediaplayback"> </div>\
                    </div></div>');
        $popup = $html.find('.video-popup');
        $playerContainer = $popup.find("#strobemediaplayback");

        $('body').append($html);
        var width = $popup.css('width'),
            height = $popup.css('height'),
            $overlay = $html.find('.overlay');


        var $close = $popup.find('.close');

        $close.on('click', function(ev) {
            ev.preventDefault();
            $html.remove();
        });

        if ($el.data('limelightid') && $el.data('limelightid') !== 'undefined') {
            this.playLimelight($playerContainer, $el.data('limelightid'), width, height);

            $overlay.on('click', function(ev) {
                ev.preventDefault();
                $html.remove();
            });

            return;
        };

        this.videoConfig.width = width;
        this.videoConfig.height = height;

        try {
            this.videoConfig.src = this.domainName()+aHref;
            $video_player = $playerContainer.strobemediaplayback(this.videoConfig);
            video_player = $video_player[0];
            $playerContainer.html(video_player);
            $overlay.on('click', function(ev) {
                ev.preventDefault();
                $html.remove();
            });

        } catch (e) {
            //html5 player
            video_player = '<video src="'+aHref+'" \
                            controls="controls">\
                            </video>\
                    ';
            $playerContainer.html(video_player);

            var video = $popup.find('video');
            video.css('width', width);
            video.css('height', height);

            $overlay.on('click', function(ev) {
                ev.preventDefault();
                video.get(0).pause()
                $html.remove();
            });
        }
    }

    OMVideo.prototype.playLimelight = function($container, limelightVideoId, width, height) {
        $.getScript('http://assets.delvenetworks.com/player/embed.js', function(){
            $container.html('<div class="LimelightEmbeddedPlayer">' +
                '<object type="application/x-shockwave-flash" id="limelight_player_357301" name="limelight_player_357301" class="LimelightEmbeddedPlayerFlash" width="' + width + '" height="' + height + '" data="http://assets.delvenetworks.com/player/loader.swf">' +
                    '<param name="movie" value="http://assets.delvenetworks.com/player/loader.swf"/>' +
                    '<param name="wmode" value="window"/>' +
                    '<param name="allowScriptAccess" value="always"/>' +
                    '<param name="allowFullScreen" value="true"/>' +
                    '<param name="flashVars" value="playerForm=Player&amp;mediaId=' + limelightVideoId + '"/>' +
                '</object>' +
                '<script>LimelightPlayerUtil.initEmbed("limelight_player_357301");</script>' +
            '</div>');
        });
    }

    $.fn.omVideo = function(options, $el) {
        var omVideo;
        if (options === true) {
            return this.data('omVideo');
        } else if (typeof options == 'string') {
            omVideo = new OMVideo(this, options);
            omVideo[options].call(omVideo, this);
            return this;
        }

        omVideo = this.data('omVideo');
        if (omVideo) {
            return this;
        }

        omVideo = new OMVideo(this, options);

        return this;
    }
    if ($.browser.msie) {
        setTimeout(function(){
            $('.video-play').omVideo();
        }, 200);
    } else {
        $('.video-play').omVideo();
    }


});
