
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
        var self = this,
            $current = $(this.selector).eq(0),
            containerWidth = $current.parent().width(),
            containerHeight = $current.parent().height(),
            $next,
            imageInfo;

        this.imageIndex = (this.imageIndex + 1) % (this.images.length);
        imageInfo = this.images[this.imageIndex];
        $next = this.$nextImage(imageInfo, $current, containerWidth, containerHeight);

        $next.css({position: 'absolute', left: '100%'})
             .insertAfter($current)
             .animate({left: '0%'}, 1000);

        $current.css('left', '0%').animate({left: '-100%'}, {
          duration: 1000,
          progress: function() {
            self.synchronizeVScroll($current, $next);
          },
          complete: function() {
            self.synchronizeVScroll($current, $next);
            $next.css({position: 'relative', left: 0});
            $current.remove();
          }
        });

      },

      synchronizeVScroll: function($master, $slave) {
        $slave.css({transform: $master.css('transform')});
      },

      $nextImage: function(imageInfo, $current, containerWidth, containerHeight) {
        var $next = $current.clone();
        $next.attr('src', this.imageURL(this.imageIndex, containerWidth))
             .width(this.imageWidth(this.imageIndex, containerHeight));
        return $next;
      },

      imageURL: function(index, containerWidth) {
        var query = (containerWidth >= 750) ? '?format=2500w' : '?format=1500w&storage=local';
        return this.baseURL + this.images[index].path + this.images[index].file + query;
      },

      imageWidth: function(index, containerHeight) {
        var image = this.images[index],
            size = image.sizes['2500w'];
        return containerHeight * size.width / size.height;
      }

    };

    return def;
})(jQuery);

