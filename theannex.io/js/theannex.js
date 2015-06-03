
window.TheAnnex = window.TheAnnex || {};

////////////////////////////////////////
  
TheAnnex.IntranetDetector = function(opts) {

  var $img = jQuery('<img>', {
        src: "http://ping.johnmcneilstudio.private/pixel.png",
        style: "position: absolute"
      });

  $img.one('load', function() {
    $img.remove();
    if (opts.connected) { 
      opts.connected();
    }
  });

  $('body').append($img);

};

////////////////////////////////////////

TheAnnex.Carousel = (function($) {
  
    var def = function(opts) {
      this.selector = opts.selector;
      this.images = opts.images;
      this.interval = opts.interval || 10000;
      this.imageIndex = 0;
      this.init();
    };

    def.prototype = {

      init: function() {
        var self = this;
        setInterval(function() {
          self.advance();
        }, this.interval);
      },

      advance: function() {
        console.log('ADVANCE!');
      }

    };

    return def;
})(jQuery);

