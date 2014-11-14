var layout = (function() {

    var $el = $( '.box-container' ),
        $menu = $( '.menu' ),
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

        $sections.each( function() {
                    
                    var $section = $( this );

                    // expand the clicked section and scale down the others
                    $section.on( 'click', function() {

                        if( !$section.data( 'open' ) ) {
                            $section.data( 'open', true ).addClass( 'box-panel-expand box-panel-expand-top' );
                            // $section.children('.box-panel-cover').addClass('box-panel-cover-hide');
                            $el.addClass( 'panel-expanded' );
                            $menu.addClass( 'menu-contract' );
                            $contentContainer.addClass( 'content-container-contract');
                        }

                    } ).find( 'span.box-panel-close' ).on( 'click', function() {
                        // close the expanded section and scale up the others
                        $section.data( 'open', false ).removeClass( 'box-panel-expand' ).on( transEndEventName, function( event ) {
                            if( !$( event.target ).is( 'section' ) ) {
                                return false;
                            }
                            $( this ).off( transEndEventName ).removeClass( 'box-panel-expand-top' );
                            $menu.removeClass( 'menu-contract' );
                        } );

                        if( !supportTransitions ) {
                            $section.removeClass( 'box-panel-expand-top' );
                        }

                        // $section.children('.box-panel-cover').removeClass('box-panel-cover-hide');

                        $el.removeClass( 'panel-expanded' );
                        $menu.removeClass( 'menu-contract' );
                        $contentContainer.removeClass( 'content-container-contract');
                        
                        return false;

                    } );

                } );

    }

    return { init: init };

})();