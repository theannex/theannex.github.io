
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
      this.interval = opts.interval || 7000;
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
        var $current = $('#parallax-images .image-container img.loaded').eq(0),
            $next = $current.clone(),
            width = $current.outerWidth();
        this.imageIndex = (this.imageIndex + 1) % (this.images.length);
        $next.css({position: 'absolute', left: '100%'})
             .attr('src', this.imageURL(this.imageIndex, width))
             .width(this.imageWidth(this.imageIndex, $current.outerHeight()));
        $next.insertAfter($current);
        $current.css('left', '0%').animate({left: '-100%'}, {
          duration: 1000,
          progress: function() {
            // duplicate transform so both scroll together
            $next.css({transform: $current.css('transform')});
          },
          complete: function() {
          $next.css({position: 'relative', left: 0});
            $current.remove();
          }
        });
        $next.animate({left: '0%'}, 1000);
      },

      imageURL: function(index, width) {
        var query = (width >= 750) ? '?format=2500w' : '?format=1500w&storage=local';
        return 'https://static1.squarespace.com/static/' + this.images[index].file + query;
      },

      imageWidth: function(index, height) {
        var image = this.images[index],
            size = image.size;
        return height * size.width / size.height;
      }

    };

    return def;
})(jQuery);

