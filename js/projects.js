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
     openModal($(event.target));
   });
   $('#modal-gallery span.close').click(closeModal);
   $('#modal-gallery a.next').click(function(event) {
     handleNextPrevious(true);
   });
   $('#modal-gallery a.prev').click(function(event) {
     handleNextPrevious(false)
   });
   $(window).on('hashchange', function(){
     var hash = window.location.hash;
     if (!window.location.hash) {
       closeModal();
     }
   });

   // Open a modal window (called when an image is clicked)
   function openModal($image) {

     $('#main-image').html('');

     window.location.hash = 'modal/' + $image.data('project') + '/' + $image.data('index');

     $('#modal-gallery').toggle();
     modalLoadImage($image);
   }

   // Close a modal window
   function closeModal() {
     history.replaceState(null, null, '/projects.html');
     $('#modal-gallery').hide();
   }

   // load an image into the main content part of the modal window (doesn't open
   // the modal window itself)
   function modalLoadImage($image) {
     // clean modal
     $('#main-image').html('');
     $('#modal-gallery a.prev').show();
     $('#modal-gallery a.next').show();

    // add selected image to the modal, and show it
     $('#main-image').append($image.clone());

     var imageHeight = $image.height();
     var imageWidth = $image.width();
     if (imageHeight > imageWidth) {
       $('#main-image').css('maxWidth', (imageWidth/imageHeight * 65) + "vh" );
     } else {
       $('#main-image').css('maxWidth', (imageWidth/imageHeight * 60) + "vh" );
     }
     var gallerySize = $image.parent().data()["items"];
     if(gallerySize < 3) {
       $('#main-image').css('maxWidth', (imageWidth/imageHeight * 80) + "vh" );
       if (gallerySize == 1) {
         // if the gallery only has one element, hide the next and previous buttons
         $('#modal-gallery a.prev').hide();
         $('#modal-gallery a.next').hide();
       }
     }
     // add caption based on img's alt text
     var caption = $image.attr('alt');

     // add pre-caption (bold italized text before the actual caption)if it exists
     if ($image.data()["pre"]){
       caption = '<strong><em>' + $image.data()["pre"] + '</em></strong>' + caption;
     }

     // add caption itself
     $('#caption').html(caption);

     // add PS (sub-caption) if it exists
     if ($image.data()["ps"]){
        $('#caption').append('<br><span class="small" style="color: #bbb">'+$image.data()["ps"]+'</span>');
     }

     // add navigational previews below the caption
     addPreviews();
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

     $image = $("#" + imgProject).find("[data-index='" + (
                (imgIndex + updateAmount)%totalImgNum +1) + "']");
                // we add 1 to make it count from 1 to length (ie. versus going from 0 to length-1)
     modalLoadImage($image);
   }

   // Adds several smaller images below the principal, for navigational purposes
   // Doesn't show image previews if there aren't enough images in a gallery (ie. at least 3)
   function addPreviews() {
     // clear previous images
     $('#previews').html('');

     // add new images
     var imgIndex = $('#main-image img').data()["index"];
     var imgProject = $('#main-image img').data()["project"];
     var totalImgNum = $("#" + imgProject + " div.accordion").data()["items"];

     var screenWidth = $(window).width();

     var indexes = [-3, -2, 0, 1];
     var navInfo = ['Back two images', 'Previous image', 'Next image', 'Foward two images'];
     if (totalImgNum < 3) {
       indexes = [];
     } else if (screenWidth < 500 || totalImgNum < 4) {
       indexes = [-2, 0]
       var navInfo = ['Previous image', 'Next image'];
     } else if (screenWidth < 850 || totalImgNum < 5) {
       indexes = [-2, 0, 1];
       var navInfo = ['Previous image', 'Next image', 'Foward two images'];
     }

     for(var i = 0; i < indexes.length; i++) {
       var $image = $("#" + imgProject).find("[data-index='" + ((imgIndex+totalImgNum+indexes[i])%totalImgNum+1) + "']");
       $('#previews').append($('<div class="preview"><span>'+navInfo[i]+'</span></div>').append($image.clone().css('margin', "0 " + parseInt($image.height()/$image.width() * 0.04 * screenWidth) + "px" )));
     }

     $('#previews div img').click(function(event) {
       modalLoadImage($(event.target).css('margin', "0"));
     });
   }
});
