/*
 * 	desMarquee - jQuery plugin
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 *  Modificado: 01-08-2012
 */
(function($){
    $.fn.desMarquee = function(settings){

        var conf = jQuery.extend({
            initDelay:  3500,
            autoPlay: 	true,
            speed: 		55,
            btnStop:    '.stop',
            btnPlay:    '.play'
        }, settings);

        var e = this;
        var m = e.children();
		e.css({'position':'relative','overflow':'hidden'});
		m.css({'position':'absolute','left':'0px'});
		m.children().css({'float':'left','white-space':'nowrap'});
        var moveTo = m.children().eq(0).outerWidth();
        var mRightItems = 0;
        var speedMove = 10000;
        var state = '';
    
        m.children().each(function(index){
			if(index==0){
				m.width($(this).outerWidth());
			}else{
				m.width($(this).outerWidth() + m.width());
			}
            mRightItems = $(this).css('margin-right');
        });
		
        var move = function(){		
			if(m.width() > e.width()){
		        state = '';        
		        moveTo = m.children().eq(0).outerWidth();
		        speedMove = (moveTo + parseInt(m.css('left'))) * conf.speed;        
		        m.animate({
			            left: '-'+moveTo+'px'
		            }, {
		                duration: speedMove,
		                'easing': 'linear',
		                complete: function(){
		                    m.css('left', mRightItems).children().eq(0).appendTo(m);
		            	    move();
			            }
			    });
			}
        };
        
        m.bind('mouseenter', function(){ 
            m.stop();
        }).bind('mouseleave', function(){ 
            if(state != 'stop'){                    
                m.stop();        
           	    move();
       	    }
        });
        
        e.parent().find(conf.btnStop).bind('click', function(){
            m.stop();
            state = 'stop';            
            return false;
        });

        e.parent().find(conf.btnPlay).bind('click', function(){
            m.stop();
            move();
            return false;            
        });        

        if(conf.autoPlay){ 
            setTimeout(function(){ 
	            m.stop();
    			move();			
            }, conf.initDelay);        
        }

		if(m.width() > e.width()){
			m.append(m.html()).css('width','20000em');
		}
    };
}(jQuery));
