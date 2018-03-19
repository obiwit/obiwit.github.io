$(function() {

  /**
   * Image Gallery Pop-Up/Modal Logic
   */

   // Event Listeners
   $('div#top-projects a.next').on('click', function(event) {
     handleNextPrevious(true);
   });
   $('div#top-projects a.prev').on('click', function(event) {
     handleNextPrevious(false)
   });
   // $(window).on('hashchange', function(){
   //   var hash = window.location.hash;
   //   if (!window.location.hash) {
   //     closeModal();
   //   } else {
   //     url_parts = hash.split("/");
   //     if (url_parts.length != 3 || url_parts[2] != $('#modal-gallery img').data('index')) {
   //       window.location.reload(true);
   //     }
   //   }
   // });
   // // handle (phone and tablet's) swiping events as well
   // var modal_el = document.getElementById('modal-gallery');
   // var mc = new Hammer(modal_el);
   // mc.on("swiperight", function(ev) {
   //     handleNextPrevious(true);
   // });
   // mc.on("swipeleft", function(ev) {
   //     handleNextPrevious(false);
   // });
   //
   // // check if landing url is a "modal" url, and if so, open corresponding modal
   // var hash = window.location.hash; //window.location.href.split('#')[1];
   // if (hash) {
   //   var url_parts = hash.split("/");
   //   if (url_parts.length == 3) {
   //     var list_elem_id = "li#"+ url_parts[1];
   //     // open the modal immediately, so the website appears faster
   //     $('#modal-gallery').toggle();
   //
   //     // open corresponding accordion
   //     toggleAccordion($(list_elem_id + " button.toggle-accordion"));
   //     // scroll to it
   //     $('html, body').animate({
   //       scrollTop: $(list_elem_id).offset().top
   //     }, 1000);
   //
   //     // add image to the modal
   //     var $image = $(list_elem_id + " div.accordion img[data-index='"+ url_parts[2] +"']");
   //     setTimeout(function(){ modalLoadImage($image); }, 1000); // 500 is too little for some images
   //   }
   // }

   // Handles the click of a next of previous buttons/arrows
   // The parameter is a boolean: true for next image; false for previous image
   function handleNextPrevious(next) {
     var $newProj;
     var totalProjects = 4; // 4 projects total
     var projectIndex = $('div#top-projects div.project').not(".hidden").data()["index"]
                            + totalProjects; // to garantee there are never negative numbers

     var updateAmount = -2; // previous image by default
     if (next) {
       updateAmount = 0;
     }
     console.log("[data-index='" + (
                (projectIndex + updateAmount)%totalProjects + 1) + "']");

     $('div#top-projects div.project').not(".hidden").addClass("hidden");
     $('*[data-index="' + ((projectIndex + updateAmount)%totalProjects + 1)
         + '"]').removeClass("hidden");
      // $('div#top-projects div.project').find("[data-index='" + (
      //            (projectIndex + updateAmount)%totalProjects +1) + "']");
   }

});
