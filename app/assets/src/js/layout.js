var layout = (function() {

    var $el = $( '.box-container' ),
        $menu = $( '.menu' ),
        $nav = $( '.nav' ),
        $navBtns = $nav.children( '.btn' ),
        $contentContainer = $( '.content-container' ),
        $sections = $el.children( 'section' ),
        transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition' : 'transitionend',
            'OTransition' : 'oTransitionEnd',
            'msTransition' : 'MSTransitionEnd',
            'transition' : 'transitionend'
        },
        transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
        supportTransitions = Modernizr.csstransitions;

    function init() {
        initEvents();
        initMobile();
        if ( $(window).width() <= 570 ){
            $('body').swipeJump();
        }
    }

    function initEvents() {

        FastClick.attach(document.body);

        $(window).resize( function (){
            if ( $(window).width() <= 570 ){
                $('body').swipeJump();
                if ( $el.hasClass('panel-expanded') ) {
                    $menu.removeClass('menu-contract');
                    $contentContainer.removeClass( 'content-container-contract');
                    $('.menu').moveDown();
                    $('.menu').data('menu-hidden',true);
                }
            } else if ( $(window).width() > 570 ) {
                $('body').unbind('touchstart');
                $('body').unbind('touchend');
                $('body').unbind('touchleave');
                if( $el.hasClass('panel-expanded') ) {
                    $('.menu').addClass('menu-contract');
                    $contentContainer.addClass( 'content-container-contract');
                }
                if( $('.menu').data('menu-hidden') == true ){
                    // $('body').trigger("swipeDown");
                    $('.menu').moveUp();
                    $('.menu').data('menu-hidden',false);
                }
            }
        });
 
        function toggleMenu () {
            if ( $(document).width() > 570 ) {
                if ( $menu.hasClass('menu-contract') ){
                    $menu.removeClass('menu-contract');
                    $contentContainer.removeClass( 'content-container-contract');
                } else {
                    $menu.addClass('menu-contract');
                    $contentContainer.addClass( 'content-container-contract');
                }
            }
        }

        function openBox (section,id,callback) {
            if( !section.data( 'open' ) ) {
                section.data( 'open', true ).addClass( 'box-panel-expand box-panel-expand-top' );
                $el.addClass( 'panel-expanded' );
                $(id).addClass('active');
            }
            if (callback){
                callback();
            }
        }

        function closeBox (section,id,callback) {
            section.data( 'open', false ).removeClass( 'box-panel-expand' ).on( transEndEventName, function( event ) {
                if( !$( event.target ).is( 'section' ) ) {
                    return false;
                }
                $( this ).off( transEndEventName ).removeClass( 'box-panel-expand-top' );
                $(id).removeClass('active');
            } );

            if( !supportTransitions ) {
                section.removeClass( 'box-panel-expand-top' );
            }

            $el.removeClass( 'panel-expanded' );
            if (callback){
                callback();
            }
            return false;
        }

        $sections.each( function() {
                    
            var $section = $( this ),
                navid = "."+$section.attr('id').replace('box','btn');

            $section.on( 'click', '.pagelink', function(e) {
                if ( !$(this).hasClass('box-panel-expand') ){
                    if ( !e.isTrigger ){
                        openBox($section,navid,toggleMenu);
                    } else {
                        openBox($section,navid);
                    }
                }
            } );

            $section.on( 'click', 'span.box-panel-close', function(e) {
                    if ( !e.isTrigger ){
                        closeBox($section,navid,toggleMenu);
                    } else {
                        closeBox($section,navid);
                    }
            } );

        });

        $navBtns.each( function(){
            var $btn = $(this),
                $link = $( this ).find('.navlink'),
                navid = "#"+$btn.attr('id').replace('btn','box');

            $link.on('click', function(e){
                e.preventDefault();
                if ( !$(this).parent().hasClass('active') ){
                    $(this).parent().toggleClass('active').siblings().removeClass('active');
                    $('section.box-panel-expand > span.box-panel-close').trigger('click');
                    setTimeout( function(){
                        $(navid+" .pagelink").trigger('click');
                    }, 500);
                }
            });
        })

    }

    function initMobile() {
        var defaults = {
            easing: "easeInOutCubic",
            animationTime: 1000,
            swipeAmnt: 30,
            target: $('html,body'),
            upTarget: $('.menu'),
            downTarget: $('.content-container')
        };
        
        $.extend($.easing,{
            easeInOutCubic: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t + b;
                return c/2*((t-=2)*t*t + 2) + b;
            }
        });
        
        $.fn.swipeEvents = function(options) {
            var settings = $.extend({}, defaults, options);
            return this.each(function() {

                var startY,
                $this = $(this);

                $this.bind('touchstart', touchstart);
                $this.bind('touchend', touchend);
                $this.bind('touchleave', touchend);

                function touchstart(event) {
                    if ( !$('.box-container').hasClass('panel-expanded') ) {
                        event.preventDefault();
                        var touches = event.originalEvent.touches;
                        if (touches && touches.length) {
                            startY = touches[0].pageY;
                            $this.bind('touchmove', touchmove);
                        }
                    }
                }

                function touchend(event) {
                        $this.unbind('touchmove', touchmove);
                }

                function touchmove(event) {
                    var touches = event.originalEvent.touches;
                    if (touches && touches.length) {
                        var deltaY = startY - touches[0].pageY;

                        if (deltaY >= settings.swipeAmnt) {
                            $this.unbind('touchmove', touchmove);
                            setTimeout( function () {
                                $this.trigger("swipeUp");
                            },250);
                        }
                        if (deltaY <= -settings.swipeAmnt) {
                            $this.unbind('touchmove', touchmove);
                            setTimeout( function () {
                                $this.trigger("swipeDown");
                            },250);
                        }
                    }
                }

            });
        };
        
        $.fn.swipeJump = function(options) {
            var settings = $.extend({}, defaults, options),
                el = $(this);
            
            $.fn.moveDown = function() {
                $('.menu').data("menu-hidden",true);
                $('.menu').slideUp(settings.animationTime, settings.easing).animate({opacity:0},{queue:false,duration:settings.animationTime});
            }
            $.fn.moveUp = function() {
                $('.menu').data("menu-hidden",false);
                $('.menu').slideDown(settings.animationTime, settings.easing).animate({opacity:1},{queue:false,duration:settings.animationTime});
            }
                
            el.swipeEvents()
                .bind("swipeDown", function(event){
                    if (!$("body").hasClass("disabled-onepage-scroll")) {
                        event.preventDefault();
                        el.moveUp();
                    }
                })
                .bind("swipeUp", function(event){
                    if (!$("body").hasClass("disabled-onepage-scroll")) {
                        event.preventDefault();
                        el.moveDown();
                    }
                });
            return false;
        }
    }

    return { init: init };

})();