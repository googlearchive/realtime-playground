/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * User Interface logic for the OAuth playground. Such as initializing the UI
 * elements, user interface triggers such as disabling/enabling buttons, window
 * resize login etc...
 *
 * @author nivco@google.com
 */

/** google global namespace for Google projects. */
var rtpg = rtpg || {};

/** Realtime Playground UI namespace. */
rtpg.ui = rtpg.ui || {};

/**
 * Initializes the buttons.
 */
rtpg.ui.initButtons = function() {
  $('.rp-button').each(function() {
    var thisButton = $(this);
    if (thisButton.hasClass('rp-togglebutton')) {
      thisButton.bind('click', function() {
        thisButton.toggleClass('selected');
      });
    }
  });
};

/**
 * Initializes the scroll bars.
 */
rtpg.ui.initScrollBoxes = function() {
  var maxS = 15;
  $('.scrollBarInner').bind('scroll', function() {
    $(this).find('.shadow').css('opacity', $(this).scrollTop() / maxS);
  });
};

/**
 * Resize all elastic elements based on screen dimensions and other elements
 * dimensions.
 */
rtpg.ui.resizeElements = function() {
  $('#rightContainer').width($(document).width() -
      $('#leftContainer').width());
  if ($(window).scrollTop() >=
      ($('#rp-googlebar').outerHeight() + $('#logTitle').outerHeight() - 30)) {
    $('#logContainer').height($('body').height() -
        $('.rp-appbar').outerHeight() + 22);
    $('#rightContainer').css('position','fixed');
    $('#rightContainer').css('top','67px');
    $('#rightContainer').css('right','0');

  } else {
    $('#logContainer').height($('body').height() -
        $('.rp-appbar').outerHeight() -
        $('#rp-googlebar').outerHeight() -
        $('#logTitle').outerHeight() -
        16 +
        $(window).scrollTop());
    $('#rightContainer').css('position','relative');
    $('#rightContainer').css('top','');
    $('#rightContainer').css('right','0');
  }
};

rtpg.ui.matchSelectFromKey = function() {
  $('#demoMapValues').prop("selectedIndex", $('#demoMapKeys').prop("selectedIndex"));
  $('#demoMapKey').val($('#demoMapKeys').val());
  $('#demoMapValue').val($('#demoMapValues').val());
}

rtpg.ui.hideShowLocalEvents = function() {
  if ($('#filterLocal').get(0).checked) {
    $('.localEvent').hide();
  } else {
    $('.localEvent').show();
  }
}

rtpg.ui.matchSelectFromValue = function() {
  $('#demoMapKeys').prop("selectedIndex", $('#demoMapValues').prop("selectedIndex"));
  $('#demoMapKey').val($('#demoMapKeys').val());
  $('#demoMapValue').val($('#demoMapValues').val());
}

rtpg.ui.matchListValue = function() {
  $('#demoListSetContent').val($('#demoListInput').val());
}

//Resizing elastic elements on window resize.
$(window).resize(rtpg.ui.resizeElements);
$(window).scroll(rtpg.ui.resizeElements);

//Initializing everything on document ready.
$(document).ready(function() {
  rtpg.ui.initButtons();
  rtpg.ui.initScrollBoxes();
  rtpg.ui.resizeElements();

  $('#demoMapValues').change(rtpg.ui.matchSelectFromValue);
  $('#demoMapKeys').change(rtpg.ui.matchSelectFromKey);
  $('#demoListInput').change(rtpg.ui.matchListValue);
  $('#filterLocal').change(rtpg.ui.hideShowLocalEvents);
});

// Loading Tooltips
google.setOnLoadCallback(rtpg.start);
google.load('picker', '1');
$(function() {
  $( document ).tooltip({
    position: {
      my: "center top+4",
      at: "center bottom",
      using: function(position, feedback) {
        $(this).css( position );
        $('<div>').addClass('arrow')
          .addClass(feedback.vertical)
          .addClass(feedback.horizontal)
          .appendTo(this);
      }
    }
  });
});