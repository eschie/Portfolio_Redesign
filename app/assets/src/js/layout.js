var layout = (function() {

    var $el = $( '.box-container' ),
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
                        }

                    } ).find( 'span.box-panel-close' ).on( 'click', function() {
                        console.log( 'closed' );
                        // close the expanded section and scale up the others
                        $section.data( 'open', false ).removeClass( 'box-panel-expand' ).on( transEndEventName, function( event ) {
                            if( !$( event.target ).is( 'section' ) ) {
                                console.log( !$( event.target ).is( 'section' ) );
                                return false;
                            }
                            $( this ).off( transEndEventName ).removeClass( 'box-panel-expand-top' );
                        } );

                        if( !supportTransitions ) {
                            console.log( 'doesnt support - removing' );
                            $section.removeClass( 'box-panel-expand-top' );
                        }

                        // $section.children('.box-panel-cover').removeClass('box-panel-cover-hide');

                        $el.removeClass( 'panel-expanded' );
                        
                        return false;

                    } );

                } );

    }

    return { init: init };

})();