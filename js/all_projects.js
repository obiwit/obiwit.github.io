$(function() {
  
  /**
   * Define some setup variables and functions
   */

  imageProjectSet = new Set($('li img').map(function() { return $(this).data('project'); }).get());
  pdfProjectSet = new Set($('li a.pdf').map(function() { return $(this).data('project'); }).get());

  function getProjectYear($project) {
    return $project.parent().attr('id').split('-')[0];
  }

  function removeHash() {
    // based on https://stackoverflow.com/a/5298684
    var scrollV, scrollH, loc = window.location;
    if ("pushState" in history) {
        history.pushState("", document.title, loc.pathname + loc.search);
    } else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.hash = "";

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
  }

  /**
   * Year-level Accordion Logic
   */
  $('h2').on('click', function() {
    // get year
    var elem = $(this);
    var year = elem.attr('id');

    // change span arrow
    var span = $(elem.children('span')[0]);
    if (span.html() == "▶") {
      span.html("▼");
    } else {
      span.html("▶");
    }

    // hide/unhide corresponding year's projects
    $('#'+year+'-body').toggleClass('hidden');
  });
  // allow ongoing project 'jumping'
  $('div#ongoing-projects a').on('click', function(e) {
    e.preventDefault();

    // show that year's projects
    var elem = $('h2#12017');
    var year = elem.attr('id');
    var span = $(elem.children('span')[0]);
    span.html("▼");
    $('#'+year+'-body').removeClass('hidden');

    // scroll to project
    $([document.documentElement, document.body]).animate({
      scrollTop: $($(this).attr('href')).offset().top
  }, 1000);
  });

  /**
   * Project-level Accordion Logic
   */
  $('button.toggle-accordion').on('click', function() {
    var elem = $(this);
    toggleAccordion(elem);
  });
  function toggleAccordion(accordion) {
    var nextElemText = accordion.hasClass('expanded') ? 'See more' : 'See less';
    accordion.toggleClass('expanded');
    accordion.html(nextElemText);

    var accordionContent = accordion.next();
    accordionContent.toggle();
  }


  /**
   * Image Gallery Pop-Up/Modal Logic
   */

   // Event Listeners
   $('#projects div.accordion img').on('click', function(event) {
     // Open a modal window (called when an image is clicked)
     $('#modal-gallery').toggle();
     modalLoadImage($(event.target));
   });
   $('#modal-gallery span.close').on('click', closeModal);
   $('#modal-gallery a.next').on('click', function(event) {
     handleNextPrevious(true);
   });
   $('#modal-gallery a.prev').on('click', function(event) {
     handleNextPrevious(false)
   });
   $(window).on('hashchange', function(){
     var hash = window.location.hash;
     if (!window.location.hash) {
       closeModal();
     } else {
       url_parts = hash.split("/");
       // if bad hash present, remove it
      if (url_parts.length != 3 || (imageProjectSet.has(url_parts[1]) && pdfProjectSet.has(url_parts[1]))) {
        // close modal and remove hash
        closeModal();
        removeHash();
      }
    }
  });
  $('#projects li a.pdf').on('click', function(event) {
    if ($(event.target).prop('target') == "_blank") {
       event.preventDefault();
       // open up modal and display pdf
       $('#modal-gallery').toggle();
       loadModalPDF(($(this)).data('project'), ($(this)).attr('href'));
    }
  });

   // close modal on 'escape' key press, handle side arrows to navigate modal
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
     } else if (isRightArrow) {
         handleNextPrevious(true);
     } else if (isLeftArrow) {
         handleNextPrevious(false);
     }
   };


  /**
   * General page Logic
   */

   // handle (phone and tablet's) swiping events as well
   var modal_el = document.getElementById('modal-gallery');
   var mc = new Hammer(modal_el);
   mc.on("swiperight", function(ev) {
       handleNextPrevious(true);
   });
   mc.on("swipeleft", function(ev) {
       handleNextPrevious(false);
   });


   // check if landing url is a "modal" url, and if so, open corresponding modal
   var hash = window.location.hash; //window.location.href.split('#')[1];
   if (hash) {
    var url_parts = hash.split("/");

    if (url_parts.length == 3) {
      var list_elem_id = "li#"+ url_parts[1];

      var year = getProjectYear($(list_elem_id))
      var elem = $('h2#'+year);
      var span = $(elem.children('span')[0]);
      span.html("▼");
      $('#'+year+'-body').removeClass('hidden');

      // open the modal immediately, so the website appears faster
      $('#modal-gallery').toggle();

      // scroll to relevant list item
      $('html, body').animate({
        scrollTop: $(list_elem_id).offset().top
      }, 1000);

      // check whether the modal belongs to a project's image or pdf set
      if (imageProjectSet.has(url_parts[1]) && !isNaN(url_parts[2])) {
        // open corresponding accordion
        toggleAccordion($(list_elem_id + " button.toggle-accordion"));

        // add image to the modal
        var $image = $(list_elem_id + " div.accordion img[data-index='"+ url_parts[2] +"']");
        setTimeout(function(){ modalLoadImage($image); }, 1000); // 500 is too little for some images
      }
      else {
        // handle pdf
        var $a = $(list_elem_id + " a.pdf[href*='"+url_parts[2]+"']");
        if ($a.prop('target') == "_blank") {
          loadModalPDF($a.data('project'), $a.attr('href'));
        }
      }
    } else if (url_parts.length == 1 && !isNaN(url_parts[0])) {
      // unhide corresponding year
      var year = getProjectYear($(hash))
      var elem = $('h2#'+year);
      var span = $(elem.children('span')[0]);
      span.html("▼");
      $('#'+year+'-body').removeClass('hidden');
    } else {
      removeHash();
    }
   }

   // Close a modal window
   function closeModal() {
     history.replaceState(null, null, '/all_projects.html');
     $('#modal-gallery').hide();
     $('#main-image').html('');
   }

   // load an image into the main content part of the modal window (doesn't open
   // the modal window itself)
   function modalLoadImage($image) {
      // guarantee modal is clean
      $('#main-image').html('');
      $('#modal-gallery .modal-content').css('height', 'auto');
      $('#modal-gallery a.prev').show();
      $('#modal-gallery a.next').show();

      // update url
      window.location.hash = 'modal/' + $image.data('project') + '/' + $image.data('index');

      // add selected image to the modal, and show it
      $('#main-image').append($image.clone());

      var imageHeight = $image.height();
      var imageWidth = $image.width();

      var gallerySize = $image.parent().data()["items"];
      if(gallerySize <= 1) {
        $('#main-image').css('maxWidth', (imageWidth/imageHeight * 80) + "vh" );
        if (gallerySize == 1) {
          // if the gallery only has one element, hide the next and previous buttons
          $('#modal-gallery a.prev').hide();
          $('#modal-gallery a.next').hide();
        }
      } else if (imageHeight > imageWidth) {
        $('#main-image').css('maxWidth', (imageWidth/imageHeight * 65) + "vh" );
      } else {
        $('#main-image').css('maxWidth', (imageWidth/imageHeight * 60) + "vh" );
      }
      // add caption based on img's alt text
      var caption = $image.attr('alt');

      // add pre-caption (bold italized text before the actual caption)if it exists
      if ($image.data()["pre"]){
        caption = '<strong><em>' + $image.data()["pre"] + '</em></strong>' + caption;
      }

      // add caption itself, with a very slight delay that creates a more 'fluid' experience
      $('#caption').html(caption);
      $('#caption').hide();
      setTimeout(function() { $('#caption').show(); }, 100);

      // add PS (sub-caption) if it exists
      if ($image.data()["ps"]){
        $('#caption').append('<br><span class="small" style="color: #bbb">'+$image.data()["ps"]+'</span>');
      }

      // add navigational previews below the caption
      addPreviews();

     // vertically center everything
     setTimeout(function(){ 
       $('div#modal-gallery .modal-content').css("marginTop", 
       ($('div#modal-gallery').height()
       - $('div#modal-gallery .modal-content').height()) / 2 - 0.1); }, 
       100); 
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
     $('#previews').hide();
     setTimeout(function() {
       $('#previews').show();
       $('#previews span').hide();
       setTimeout(function() { $('#previews span').show(); }, 100);
     }, 100);
     // the above lines create a more 'fluid' experience

     // add new images
     var imgIndex = $('#main-image img').data()["index"];
     var imgProject = $('#main-image img').data()["project"];
     var totalImgNum = $("#" + imgProject + " div.accordion").data()["items"];

     var screenWidth = $(window).width();

     var indexes = [-3, -2, 0, 1];
     var navInfo = ['Back two images', 'Previous image', 'Next image', 'Foward two images'];
     if (totalImgNum <= 1) {
       indexes = [];
     } else if (totalImgNum <= 2) {
       indexes = [0];
       var navInfo = ['Next image'];
     } else if (screenWidth < 500 || totalImgNum <= 3) {
       indexes = [-2, 0]
       var navInfo = ['Previous image', 'Next image'];
     } else if (screenWidth < 850 || totalImgNum <= 4) {
       indexes = [-2, 0, 1];
       var navInfo = ['Previous image', 'Next image', 'Foward two images'];
     }

     for(var i = 0; i < indexes.length; i++) {
       var $image = $("#" + imgProject).find("[data-index='" + ((imgIndex+totalImgNum+indexes[i])%totalImgNum+1) + "']");
       $('#previews').append($('<div class="preview"><span>'+navInfo[i]+'</span></div>').append($image.clone().css('margin', "0 " + parseInt($image.height()/$image.width() * 0.04 * screenWidth) + "px" )));
     }

     $('#previews span').on('click', function(event) {
       modalLoadImage($(event.target).next().css('margin', "0"));
     });
     $('#previews img').on('click', function(event) {
       modalLoadImage($(event.target).css('margin', "0"));
     });
   }

   function loadModalPDF(project, pdf_href) {
    var options = {
       fallbackLink: '<object data="[url]" type="application/pdf" width="100%" height="100%"> \
         <!-- <iframe src="[url]" width="100%" height="100%" style="border: none;"> --> \
         <div id="pdf-fail"><p>This browser does not support PDFs.<br/>Please download the PDF to view it:</p><a href="[url]">Download PDF</a></div> \
         <!-- </iframe> --> \
       </object>'
    };

     // guarantee modal is clean
     $('#main-image').html('');
     $('#modal-gallery .modal-content').css('height', '100%');
     $('#modal-gallery a.prev').hide();
     $('#modal-gallery a.next').hide();

     // update url
     window.location.hash = 'modal/' + project + '/' + pdf_href.split("/")[3];

    // set dimensions
     var imageHeight = $('#modal-gallery .modal-content').height();
     var imageWidth = $('#modal-gallery .modal-content').width();
    $('#main-image').css('maxWidth', (imageWidth/imageHeight * 80) + "vh" );
    $('#main-image').css('marginTop', "3%");
    $('#main-image').css('marginTop', "1%");
    $('#main-image').css('height', "95%");

    PDFObject.embed(pdf_href, "#main-image", options);
  }
});
