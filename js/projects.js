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
