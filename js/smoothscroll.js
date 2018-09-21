var scroll = function(target, hash){

  // Does a scroll target exist?
  if (target.length) {
    // Only prevent default if animation is actually gonna happen
    // event.preventDefault();
    $('html, body').animate({
      scrollTop: target.offset().top
    }, 600, function() {
      // Callback after animation
      // Must change focus!
      var $target = $(target);
      $target.focus();
      if ($target.is(":focus")) { // Checking if the target was focused
        return false;
      } else {
        $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
        $target.focus(); // Set focus again
      };

      // if(addToHistory){
      //   var hash = window.location.hash;
      //   if(!hash){
      //     // window.history.pushState('faq', 'FLOP FAQ', '/' + hash);
      //   }
      // }
    });
  }
}

$( document ).ready(function() {

  if(window.location.hash) {
    var hash = window.location.hash;
    var target = $(hash);
    target = target.length ? target : $('[name=' + hash.slice(1) + ']');

    scroll(target, hash);
  }

  // Select all links with hashes
  $('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &&
      location.hostname == this.hostname
    ) {

      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

      scroll(target, this.hash);
    }
  });


});
