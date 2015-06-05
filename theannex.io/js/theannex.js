
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
        var self = this,
            image = this.images[this.nextIndex()],
            $current = $(this.selector).eq(0), 
            sizeTier = this.sizeTier(image.sizes, $current.parent().width()),
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

        // size image to cover container
        this.imageCover($next, naturalDims, image.focus);
        // ... and listen for window resize during animation
        $('window').on('resize.annexCarousel', function() {
          self.imageCover($next, naturalDims, image.focus);
        });

        this.animate($current, $transport, {
          progress: function() {
            self.synchronizeVScroll($current, $next);
          },
          complete: function() {
            $('window').off('resize.annexCarousel');
            $next.insertBefore($current);
            $transport.remove();
            $current.remove();
          }
        });
      },

      nextIndex: function() {
        return this.imageIndex = (this.imageIndex + 1) % this.images.length;
      },

      animate: function($outgoing, $incoming, opts) {
        var travellingOffset = $incoming.position().left - $outgoing.position().left;

        $incoming.animate({left: '0%'}, {
          duration: this.duration,
          progress: function() {
            if (opts.progress) { opts.progress() }
            $outgoing.css('left', $incoming.position().left - travellingOffset);
          },
          complete: opts.complete
        });

      },

      synchronizeVScroll: function($master, $slave) {
        $slave.css({transform: $master.css('transform')});
      },

      $newImage: function(image, $current, sizeTier) {
        var imagePath = this.baseURL + image.path + image.file;
        return $current.clone().attr({
          'src'                    : imagePath + '?' + this.imageSizeQuery(sizeTier),
          'alt'                    : image.file,
          'data-src'               : imagePath,
          'data-image'             : imagePath,
          'data-image-dimensions'  : image.sizes[sizeTier].join('x'),
          'data-image-focal-point' : (image.focus || [0.5, 0.5]).join(','),
          'data-image-resolution'  : sizeTier
        });
      },

      sizeTier: function(sizes, containerWidth) {
        return (containerWidth < 750 && sizes['1500w']) ? '1500w' : '2500w';
      },

      imageCover: function($img, naturalDims, focus) {
        var containerWidth = $img.parent().width(),
            containerHeight = $img.parent().height(),
            newImageWidth = containerWidth, // try equal width to container
            newImageHeight = containerWidth * naturalDims[1] / naturalDims[0],
            focus = focus || [0.5, 0.5];

        if (newImageHeight < containerHeight) { // does not cover so match height instead
          newImageHeight = containerHeight;
          newImageWidth = containerHeight * naturalDims[0] / naturalDims[1];
        }

        $img.css({
          width  : newImageWidth,
          height : newImageHeight,
          top    : (containerHeight - newImageHeight) * focus[1],
          left   : (containerWidth - newImageWidth) * focus[0]
        });
      },

      imageSizeQuery: function(sizeTier) {
        return (sizeTier === '2500w') ? 'format=2500w' : 'format=1500w&storage=local';
      }

    };

    return def;
})(jQuery);

