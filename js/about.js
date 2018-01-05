$(function() {

   // Event Listeners
   /******************************************* MODAL WINDOW */
   $('div#home a').click(function(event) {
     event.preventDefault();
     openModal($(this));
   });
   $('#modal-gallery span.close').click(closeModal);
   $(window).on('hashchange', function(){
     var hash = window.location.hash;
     if (!window.location.hash) {
       closeModal();
     }
   });
   /******************************************* VIDEO RESIZE */
   $( window ).resize(function() {
     var modal_url = $(location).attr('href').split('#')[1];
     if (modal_url) {
       if (modal_url.split("/")[1] == "vid") {
         $iframe = $('#viewer iframe.youtube-embed');
         $iframe.css('height', ($iframe.width() * 9 / 16) + "px" );
       }
     }
   });

    // Open a modal window (called when an image is clicked)
    function openModal($a) {

      var href = $a.attr('href');

      if ($a.hasClass("video")) {
        window.location.hash = 'modal/vid/' + href.split('=')[1];
        $('#modal-gallery').toggle();

        $('#viewer').html("<iframe class=\"youtube-embed\" src=\"https://www.youtube-nocookie.com/embed/ie7F8p41Lh4?rel=0\" frameborder=\"0\" gesture=\"media\" allow=\"encrypted-media\" allowfullscreen></iframe></div>");

        $iframe = $('#viewer iframe.youtube-embed');
        $iframe.css('height', ($iframe.width() * 9 / 16) + "px" );
      }
      else if ($a.hasClass("pdf")) {
        window.location.hash = 'modal' + href;
        $('#modal-gallery').toggle();

        var options = {
           fallbackLink: '<object data="[url]" type="application/pdf" width="100%" height="100%"> \
             <!-- <iframe src="[url]" width="100%" height="100%" style="border: none;"> --> \
             <div id="pdf-fail"><p>This browser does not support PDFs.<br/>Please download the PDF to view it:</p><a href="[url]">Download PDF</a></div> \
             <!-- </iframe> --> \
           </object>'
        };
        PDFObject.embed(href, "#viewer", options);
      }
    }

    // Close a modal window
    function closeModal() {
      history.replaceState(null, null, '/index.html');
      $('#modal-gallery').hide();
    }


});
