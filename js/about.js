$(function() {

  // check if landing url is a "modal" url, and if so, open corresponding modal
  var modal_url = window.location.href.split('#')[1];
  if (modal_url) {
    var url_parts = modal_url.split("/");

    if (url_parts.length == 3) { // simple modal window
      $('#modal-gallery').toggle();
      if (url_parts[1] == "vid") { // open video modal_url
        // url_parts[2] = video id
        loadModalVideo(url_parts[2]);
      } else if (url_parts[1] == "pdf") { // open PDF modal
        // url_parts[2] = pdf path
        loadModalPDF(url_parts[1] + "/" + url_parts[2]);
      }
    } else if (url_parts[1] == "pdf-gallery") { // open a PDF gallery modal
      // url_parts[2] = group id
      // url_parts[3] = current index
      $('#modal-gallery').toggle();
      loadModalPDF("pdf/" + url_parts[2] + url_parts[3] + ".pdf");

      // add next and prev arrows
      $('#modal-gallery').append('<a class="prev cursor">&#10094;</a><a class="next cursor">&#10095;</a>');

      $('#modal-gallery a.next').on('click', function(event) {
        handleNextPrevious(true);
      });
      $('#modal-gallery a.prev').on('click', function(event) {
        handleNextPrevious(false);
      });
    }
  }
  function handleNextPrevious(next) {
    var modal_url = window.location.href.split('#')[1];
    if (modal_url) {
      var url_parts = modal_url.split("/");

      // get gallery size and updateAmount
      var $gallery = $('#home').find("[data-gallery='" + url_parts[2] + "']");
      var gallerySize = $gallery.data()["items"];
      var updateAmount = next? 0 : gallerySize-2;

      // get new index, update url and load next/prev pdf
      var newIndex = (Number(url_parts[3]) + updateAmount) % gallerySize + 1;
      window.location.hash = 'modal/' + url_parts[1] + '/' + url_parts[2] + '/' + newIndex;
      loadModalPDF("pdf/" + url_parts[2] + newIndex + ".pdf");
    }
  }

  // Event Listeners
  /**************************************** GENERAL PURPOSE */
  // close modal on 'escape' key press, handle side arrows to navigate modal, if gallery
  document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false, isRightArrow = false, isLeftArrow = false;
    if ("key" in evt) {
        isEscape = (evt.key == "Escape" || evt.key == "Esc");
        isRightArrow = (evt.key == "ArrowRight");
        isLeftArrow = (evt.key == "ArrowLeft");
    } else {
        isEscape = (evt.keyCode == 27);
        isRightArrow = (evt.keyCode == 39);
        isLeftArrow = (evt.keyCode == 37);
    }
    if (isEscape) {
        closeModal();
    }
    // check if modal is a modal gallery
    else if (window.location.href.split('#')[1].split("/")[1] == "pdf-gallery") {

       if (isRightArrow) {
          handleNextPrevious(true);
      } else if (isLeftArrow) {
          handleNextPrevious(false);
      }
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

  // Open a modal window (called when a link is clicked)
  function openModal($a) {

    var href = $a.attr('href');
    $('#modal-gallery').toggle();

    // video modal window
    if ($a.hasClass("video")) {
      var video_id = href.split('=')[1];
      window.location.hash = 'modal/vid/' + video_id;

      loadModalVideo(video_id);
    }

    // pdf modal window
    else if ($a.hasClass("pdf")) {
      window.location.hash = 'modal' + href;

      loadModalPDF(href);
    }

    // pdf window modal window
    else if ($a.hasClass("pdf-gallery")) {
      window.location.hash = 'modal' + href;

      url_parts = href.split("/");
      loadModalPDF("pdf/" + url_parts[2] + url_parts[3] + ".pdf");

      // add next and prev arrows
      $('#modal-gallery').append('<a class="prev cursor">&#10094;</a><a class="next cursor">&#10095;</a>');

      $('#modal-gallery a.next').on('click', function(event) {
        handleNextPrevious(true);
      });
      $('#modal-gallery a.prev').on('click', function(event) {
        handleNextPrevious(false);
      });
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

    // remove next and prev buttons, if they existed
    $('#modal-gallery a.next').remove();
    $('#modal-gallery a.prev').remove();
  }


});
