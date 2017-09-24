$(function() {
  /**
   * Accordion Logic
   */
  $('button.toggle-accordion').click(function() {

    var elem = $(this);
    var nextElemText = elem.hasClass('expanded') ? 'See more' : 'See less';
    elem.toggleClass('expanded');
    elem.html(nextElemText);

    var accordionContent = elem.next();
    accordionContent.toggle();
  });



  /**
   * Image Gallery Pop-Up/Modal Logic
   */

   // Event Listeners
   $('#projects div.accordion img').click(function(event) {
     openModal(event);
   });
   $('#modal-gallery span.close').click(closeModal);
   $('#modal-gallery a.next').click(function(event) {
     handleNextPrevious(true);
   });
   $('#modal-gallery a.prev').click(function(event) {
     handleNextPrevious(false)
   });

   // Open a modal window (called when an image is clicked)
   function openModal(elem) {

     $('#main-image').html('');

     var $image = $(elem.target);
     $('#modal-gallery').toggle();
     modalLoadImage($image);
   }

   // Close a modal window
   function closeModal() {
     $('#modal-gallery').hide();
   }

   // load an image into the main content part of the modal window (doesn't open
   // the modal window itself)
   function modalLoadImage($image) {
     // clean modal
     $('#main-image').html('');

    // add selected image to the modal, and show it
     $('#main-image').append($image.clone());

     var imageHeight = $image.height();
     var imageWidth = $image.width();
     if (imageHeight > imageWidth) {
       $('#main-image').css('maxWidth', (imageWidth/imageHeight * 65) + "vh" );
     } else {
       $('#main-image').css('maxWidth', (imageWidth/imageHeight * 60) + "vh" );
     }

     // add caption based on img's alt text
     $('#caption').html($image.attr('alt'));
   }

   // Handles the click of a next of previous buttons/arrows
   // The parameter is a boolean: true for next image; false for previous image
   function handleNextPrevious(next) {
     var $image;
     var imgIndex = $('#main-image img').data()["index"];
     var imgProject = $('#main-image img').data()["project"];
     var totalImgNum = $("#" + imgProject + " div.accordion").data()["items"];

     var updateAmount = totalImgNum-2; // previous image by default
     if (next) {
       updateAmount = 0;
     }
     console.log((imgIndex + updateAmount)%totalImgNum +1);

     $image = $("#" + imgProject).find("[data-index='" + (
                (imgIndex + updateAmount)%totalImgNum +1) + "']");
                // we add 1 to make it count from 1 to length (ie. versus going from 0 to length-1)
     modalLoadImage($image);
   }
});
