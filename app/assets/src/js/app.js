(function() {

    window.App = {
        Models: {},
        Collections: {},
        Views: {}
    };

    window.template = function(id){
        return _.template( $('#' + id).html() );
    };


})();