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
    }

    function initEvents() {

        function toggleMenu () {
            if ( $menu.hasClass('menu-contract') ){
                $menu.removeClass('menu-contract');
                $contentContainer.removeClass( 'content-container-contract');
            } else {
                $menu.addClass('menu-contract');
                $contentContainer.addClass( 'content-container-contract');
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
                    console.log( 'section clicked: open' );
                    if ( !e.isTrigger ){
                        openBox($section,navid,toggleMenu);
                    } else {
                        openBox($section,navid);
                    }
                }
            } );

            $section.on( 'click', 'span.box-panel-close', function(e) {
                console.log( 'section clicked: close' );
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

    return { init: init };

})();