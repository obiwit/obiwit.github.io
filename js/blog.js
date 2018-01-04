$(function() {
  $(window).on('resize', function(){
    width = $(window).width() / parseFloat($("body").css("font-size"));
    if (width > 70) {
      $("#sidebar").css("maxWidth", (width-60)+"em");
    }
  });
});
