$(function() {
  /**
   * Accordion Logic
   */
  $("button.toggle-accordion").click(function() {
    var elem = $(this);
    var nextElemText = elem.hasClass("expanded") ? "See more" : "See less";
    elem.toggleClass("expanded");
    elem.html(nextElemText);
    elem.next().toggle();
  });

  /**
   * Image Gallery Pop-Up/Modal Logic
   */
   //...
});
