
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
        setTimeout(function() {
        // setInterval(function() {
          self.advance();
        }, this.interval);
      },

      advance: function() {
        var image = this.images[this.nextIndex()],
            $current = $(this.selector).eq(0), 
            sizeTier = this.sizeTier(image, $current.parent().width()),
            naturalDims = image.sizes[sizeTier],
            $next = this.$newImage(image, $current, sizeTier),
            $transport = jQuery('<div/>');

        $transport.css({
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: '100%',
                    overflow: 'hidden'
                  })
                  .insertAfter($current);

        $next.css({ position: 'relative' })
             .appendTo($transport);

        $('window').on('resize.annexCarousel', function() {
          this.imageCover($next, naturalDims);
        }).resize();

        this.animate($current, $transport, function() {
          $('window').off('resize.annexCarousel');
          $next.insertBefore($current);
          $transport.remove();
          $current.remove();
        });

      },

      nextIndex: function() {
        return this.imageIndex = (this.imageIndex + 1) % this.images.length;
      },

      animate: function($outgoing, $incoming, complete) {
        var self = this,
            travellingOffset = $incoming.position().left - $outgoing.position().left;

        $incoming.animate({left: '0%'}, {
          duration: this.duration,
          progress: function() {
            $outgoing.css('left', $incoming.position().left - travellingOffset);
            self.synchronizeVScroll($outgoing, $incoming);
          },
          complete: function() {
            self.synchronizeVScroll($outgoing, $incoming);
            if (complete) { complete() };
          }
        });

      },

      synchronizeVScroll: function($master, $slave) {
        $slave.css({transform: $master.css('transform')});
      },

      $newImage: function(image, $current, sizeTier) {
        var $next = $current.clone().attr('src', this.imageURL(image, sizeTier));
        return $next;
      },

      sizeTier: function(image, containerWidth) {
        return (containerWidth < 750 && image['1500w']) ? '1500w' : '2500w';
      },

      imageCover: function($img, naturalDims) {
        $img.css({ width: naturalDims.width, height: naturalDims.height });
      },

      imageURL: function(image, sizeTier) {
        var query = (sizeTier === '2500w') ? '?format=2500w' : '?format=1500w&storage=local';
        return this.baseURL + image.path + image.file + query;
      }

    };

    return def;
})(jQuery);

