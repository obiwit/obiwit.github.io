$(function() {

  // check if landing url is a "modal" url, and if so, open corresponding modal
  var modal_url = window.location.href.split('#')[1];
  if (modal_url) {
    var url_parts = modal_url.split("/");
    if (url_parts.length == 3) {
      $('#modal-gallery').toggle();
      if (url_parts[1] == "vid") { // open video modal_url
        loadModalVideo(url_parts[2]);
      } else if (url_parts[1] == "pdf") { // open PDF modal
        loadModalPDF(url_parts[1] + "/" +url_parts[2]);
      }
    }
  }

  // Event Listeners
  /**************************************** GENERAL PURPOSE */
  // close modal on 'escape' key press
  document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key == "Escape" || evt.key == "Esc");
    } else {
        isEscape = (evt.keyCode == 27);
    }
    if (isEscape) {
        closeModal();
    }
  };

  /******************************************* MODAL WINDOW */
  $('div#home a').on("click", function(event) {
    if ($(event.target).prop('target') == "_blank") {
       event.preventDefault();
       openModal($(this));
     }
  });
  $('#modal-gallery span.close').on("click", closeModal);
  $(window).on('hashchange', function(){
   var hash = window.location.hash;
   if (!window.location.hash) {
     closeModal();
   }
  });

  /******************************************* VIDEO RESIZE */
  $( window ).resize(function() {
   var modal_url = window.location.href.split('#')[1]; //$(location).attr('href').split('#')[1];
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
    $('#modal-gallery').toggle();

    if ($a.hasClass("video")) {
      var video_id = href.split('=')[1];
      window.location.hash = 'modal/vid/' + video_id;

      loadModalVideo(video_id);
    }
    else if ($a.hasClass("pdf")) {
      window.location.hash = 'modal' + href;

      loadModalPDF(href);
    }
  }

  function loadModalVideo(video_id) {
    $('#viewer').html("<iframe class=\"youtube-embed\" src=\"https://www.youtube-nocookie.com/embed/" + video_id + "?rel=0\" frameborder=\"0\" gesture=\"media\" allow=\"encrypted-media\" allowfullscreen></iframe></div>");

    var $iframe = $('#viewer iframe.youtube-embed');
    $iframe.css('height', ($iframe.width() * 9 / 16) + "px" );
  }

  function loadModalPDF(pdf_href) {
    var options = {
       fallbackLink: '<object data="[url]" type="application/pdf" width="100%" height="100%"> \
         <!-- <iframe src="[url]" width="100%" height="100%" style="border: none;"> --> \
         <div id="pdf-fail"><p>This browser does not support PDFs.<br/>Please download the PDF to view it:</p><a href="[url]">Download PDF</a></div> \
         <!-- </iframe> --> \
       </object>'
    };
    PDFObject.embed(pdf_href, "#viewer", options);
  }

  // Close a modal window
  function closeModal() {
    history.replaceState(null, null, '/index.html');
    $('#modal-gallery').hide();
    $('#viewer').html('');
  }


});
