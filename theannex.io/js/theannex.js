window.TheAnnex = {
  
  IntranetDetector: function(opts) {
    var $img = jQuery('<img>', {
          src: "http://ping.johnmcneilstudio.private/pixel.png",
          style: "position: absolute"
        });

    $img.one('load', function() {
      $img.remove();
      if (opts.connected) {
        opts.connected.call(this);
      }
    });

    $('body').append($img);
  },

  Carousel: function(opts) {
    this.init(opts);
  }

}

TheAnnex.Carousel.prototype = {

  init: function(opts) {
    setTimeout(function() {
      console.log(jQuery(opts.selector));
    }, 100);
  }

}