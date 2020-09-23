$(function() {

   // set up background images
   $("div.project").each(function() {
     $(this).find("div.background").css("background-image", "url(\"../img/projects/top/top_"+$(this).attr('id')+".jpg");
   });

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

   // Handles the click of a next of previous buttons/arrows
   // The parameter is a boolean: true for next image; false for previous image
   function handleNextPrevious(next) {
     var $newProj;
     var totalProjects = 3;//4; // 4 projects total
     var projectIndex = $('div#top-projects div.project').not(".hidden").data()["index"]
                            + totalProjects; // to garantee there are never negative numbers

     var updateAmount = -2; // previous image by default
     if (next) {
       updateAmount = 0;
     }

     $('div#top-projects div.project').not(".hidden").addClass("hidden");
     $('*[data-index="' + ((projectIndex + updateAmount)%totalProjects + 1)
         + '"]').removeClass("hidden");
   }

});
