var images = [
["550b7215e4b0ff038e4495dc/t/551ad267e4b0453e4dfd043f/1427821161513/87f25d87b603af68c37c3689cd76760a.jpg", 1.32],
["550b7215e4b0ff038e4495dc/t/55300e9ce4b0f2eae9d69cbc/1429212833620/Deception_Force_Website_on_Devices_v2.jpg", 1.50],
["550b7215e4b0ff038e4495dc/t/55301033e4b0e2a3eb389b15/1429213238226/Intel.jpg", 1.78]
],
imageIndex = 0;

// advances the landing page image.
function carousel() {
  var $current = $('#parallax-images .image-container img.loaded').eq(0),
      $next = $current.clone(),
      width = $current.outerWidth();
  imageIndex = (imageIndex + 1) % (images.length);
  $next.css({position: 'absolute', left: '100%'})
       .attr('src', imageURL(imageIndex, width))
       .width(imageWidth(imageIndex, $current.outerHeight()));
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
}
  
function $nextImage(index, containWidth, containHeight) {
  var query = (containWidth >= 750) ? '?format=2500w' : '?format=1500w&storage=local',
      url = 'https://static1.squarespace.com/static/' + images[index][0];
  return $('<img>', {
    
  });
}

function imageURL(index, width) {
  var query = (width >= 750) ? '?format=2500w' : '?format=1500w&storage=local';
  return 'https://static1.squarespace.com/static/' + images[index][0] + query;
}

function imageWidth(index, height) {
  return height * images[index][1];
}
  
// tests if we are on the JMS intranet by attempting to load a 1x1 png
// and displays the "Process" link if we are.
function showProcessButton() {
  var $img = $('<img>', {
        src: "http://ping.johnmcneilstudio.private/pixel.png",
        style: "position: absolute"
      });
  $img.one('load', function() {
    $('body').addClass('intranet-connected');
    $img.remove();
  });
  $('body').append($img);
}
  
$(function() { // on DOM ready:
  showProcessButton();
  setInterval(carousel, 8000);
});
