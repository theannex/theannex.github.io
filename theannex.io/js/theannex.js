
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
            $next = this.$newImage(this.images[this.nextIndex()], $current),
            $transport = jQuery('<div/>');

        $transport.css({
          display: 'block',
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: '100%',
          overflow: 'hidden',
          backgroundColor: '#bbb',
          border: '2px solid red'
        })
        .insertAfter($current);

        $next.css({ position: 'relative' })
             .appendTo($transport);
        this.resizeAndPosition($next);

        this.animate($current, $transport, function() {
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

        // console.log($incoming.parent().html());

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

        // $outgoing.css('left', '0%').animate({left: '-100%'}, {
        //   duration: this.duration,
        //   progress: function() {
        //     self.synchronizeVScroll($outgoing, $incoming);
        //   },
        //   complete: function() {
        //     self.synchronizeVScroll($outgoing, $incoming);
        //     $incoming.css({position: 'relative', left: 0});
        //     if (complete) { complete() };
        //   }
        // });
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

      resizeAndPosition: function($img) {

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

