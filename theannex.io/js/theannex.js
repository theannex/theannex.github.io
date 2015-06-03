
window.TheAnnex = window.TheAnnex || {};

////////////////////////////////////////
  
// test for presence of JMS intranet
TheAnnex.IntranetDetector = function(opts) {

  // attempt to load an IMG since it is possible to load an HTTP IMG inside an HTTPS site
  // (cache-buster query string is appended to IMG URL)
  jQuery('<img>', {
    src: "http://ping.johnmcneilstudio.private/pixel.png?" + (Math.random() + 1).toString(36).substring(7),
    style: "position: absolute"
  })
  .one('load', function() {
    $(this).remove();      // no longer needed: test is complete
    if (opts.connected) {
      opts.connected();    // callback on success
    }
  })
  .appendTo('body'); // kick it off

};

////////////////////////////////////////

TheAnnex.Carousel = (function($) {
  
    var def = function(opts) {
      this.selector = opts.selector;
      this.baseURL = opts.baseURL || '';
      this.images = opts.images;
      this.interval = opts.interval || 7000;
      this.duration = opts.duration || 1000;
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
        var $current = $(this.selector).eq(0), 
            $next = this.$newImage(this.images[this.nextIndex()], $current);

        $next.css({position: 'absolute', left: '100%'})
             .insertAfter($current);

        this.animate($current, $next, function() {
          $current.remove();
        });

      },

      nextIndex: function() {
        return this.imageIndex = (this.imageIndex + 1) % this.images.length;
      },

      animate: function($current, $next, complete) {
        var self = this;

        $next.animate({left: '0%'}, this.duration);

        $current.css('left', '0%').animate({left: '-100%'}, {
          duration: this.duration,
          progress: function() {
            self.synchronizeVScroll($current, $next);
          },
          complete: function() {
            self.synchronizeVScroll($current, $next);
            $next.css({position: 'relative', left: 0});
            if (complete) { complete() };
          }
        });
      },

      synchronizeVScroll: function($master, $slave) {
        $slave.css({transform: $master.css('transform')});
      },

      $newImage: function(image, $current) {
        var $next = $current.clone(),
            containerWidth = $current.parent().width(),
            containerHeight = $current.parent().height();
        $next.attr('src', this.imageURL(image, containerWidth))
             .width(this.imageWidth(image, containerHeight));
        return $next;
      },

      imageURL: function(image, containerWidth) {
        var query = (containerWidth >= 750) ? '?format=2500w' : '?format=1500w&storage=local';
        return this.baseURL + image.path + image.file + query;
      },

      imageWidth: function(image, containerHeight) {
        var size = image.sizes['2500w'];
        return containerHeight * size.width / size.height;
      }

    };

    return def;
})(jQuery);

