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
    var $ = jQuery;
    setTimeout(function() {
      console.log($(opts.selector));
    }, 100);
  }

}
