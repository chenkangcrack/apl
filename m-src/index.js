(function() {
  var exec, extractTextFromDOM, format;

  exec = require('./compiler').exec;

  format = require('./vocabulary/format').format;

  $.fn.toggleVisibility = function() {
    return this.css('visibility', this.css('visibility') === 'hidden' ? '' : 'hidden');
  };

  extractTextFromDOM = function(e) {
    var c, r, _ref;

    if ((_ref = e.nodeType) === 3 || _ref === 4) {
      return e.nodeValue;
    } else if (e.nodeType === 1) {
      if (e.nodeName.toLowerCase() === 'br') {
        return '\n';
      } else {
        c = e.firstChild;
        r = '';
        while (c) {
          r += extractTextFromDOM(c);
          c = c.nextSibling;
        }
        return r;
      }
    }
  };

  jQuery(function($) {
    var actions, alt, c, code, hashParams, layouts, name, nameValue, shift, updateLayout, value, _i, _j, _len, _len1, _ref, _ref1, _results;

    setInterval((function() {
      return $('#cursor').toggleVisibility();
    }), 500);
    $('#editor').on('mousedown touchstart mousemove touchmove', function(e) {
      var $bestE, bestDX, bestDY, bestXSide, te, x, y, _ref, _ref1, _ref2;

      e.preventDefault();
      te = (_ref = (_ref1 = e.originalEvent) != null ? (_ref2 = _ref1.touches) != null ? _ref2[0] : void 0 : void 0) != null ? _ref : e;
      x = te.pageX;
      y = te.pageY;
      bestDY = bestDX = 1 / 0;
      bestXSide = 0;
      $bestE = null;
      $('#editor span').each(function() {
        var $e, dx, dy, p, x1, y1;

        $e = $(this);
        p = $e.position();
        x1 = p.left + $e.width() / 2;
        y1 = p.top + $e.height() / 2;
        dx = Math.abs(x1 - x);
        dy = Math.abs(y1 - y);
        if (dy < bestDY || dy === bestDY && dx < bestDX) {
          $bestE = $e;
          bestDX = dx;
          bestDY = dy;
          bestXSide = x > x1;
        }
      });
      if ($bestE) {
        if (bestXSide) {
          $('#cursor').insertAfter($bestE);
        } else {
          $('#cursor').insertBefore($bestE);
        }
      }
      return false;
    });
    $('.key').bind('mousedown touchstart', function(event) {
      var $k;

      event.preventDefault();
      $k = $(this);
      $k.addClass('down');
      if ($k.hasClass('repeatable')) {
        $k.data('timeoutId', setTimeout(function() {
          $k.data('timeoutId', null);
          $k.trigger('aplkeypress');
          $k.data('intervalId', setInterval((function() {
            return $k.trigger('aplkeypress');
          }), 200));
        }, 500));
      }
      return false;
    });
    $('.key').bind('mouseup touchend', function(event) {
      var $k, iid;

      event.preventDefault();
      $k = $(this);
      $k.removeClass('down');
      clearTimeout($k.data('timeoutId'));
      $k.data('timeoutId', null);
      if ((iid = $k.data('intervalId')) != null) {
        clearInterval(iid);
        $k.data('intervalId', null);
      } else {
        $k.trigger('aplkeypress');
      }
      return false;
    });
    layouts = ['1234567890qwertyuiopasdfghjklzxcvbnm', '!@#$%^&*()QWERTYUIOPASDFGHJKLZXCVBNM', '¨¯<≤=≥>≠∨∧←⍵∊⍴~↑↓⍳○*⍺⌈⌊⍪∇∆∘⋄⎕⊂⊃∩∪⊥⊤∣', '⍣[]{}«»;⍱⍲,⌽⍷\\⍉\'"⌷⍬⍟⊖+-×⍒⍋/÷⍞⌿⍀⍝.⍎⍕:'];
    alt = shift = 0;
    updateLayout = function() {
      var layout;

      layout = layouts[2 * alt + shift];
      $('.keyboard .key:not(.special)').each(function(i) {
        return $(this).text(layout[i]);
      });
    };
    updateLayout();
    actions = {
      insert: function(c) {
        return $('<span>').text(c.replace(/\ /g, '\xa0')).insertBefore('#cursor');
      },
      enter: function() {
        return $('<br>').insertBefore('#cursor');
      },
      backspace: function() {
        return $('#cursor').prev().remove();
      },
      exec: function() {
        var code, err, result;

        try {
          code = extractTextFromDOM(document.getElementById('editor')).replace(/\xa0/g, ' ');
          result = exec(code);
          $('#result').removeClass('error').text(format(result).join('\n'));
        } catch (_error) {
          err = _error;
          if (typeof console !== "undefined" && console !== null) {
            if (typeof console.error === "function") {
              console.error(err);
            }
          }
          $('#result').addClass('error').text(err);
        }
        $('#pageInput').hide();
        $('#pageOutput').show();
      }
    };
    $('.key:not(.special)').on('aplkeypress', function() {
      return actions.insert($(this).text());
    });
    $('.enter').on('aplkeypress', actions.enter);
    $('.space').on('aplkeypress', function() {
      return $('<span>&nbsp;</span>').insertBefore('#cursor');
    });
    $('.bksp').on('aplkeypress', actions.backspace);
    $('.shift').on('aplkeypress', function() {
      $(this).toggleClass('isOn', (shift = 1 - shift));
      return updateLayout();
    });
    $('.alt').on('aplkeypress', function() {
      $(this).toggleClass('isOn', (alt = 1 - alt));
      return updateLayout();
    });
    $('.exec').on('aplkeypress', actions.exec);
    $('body').keypress(function(event) {
      if (event.keyCode === 10) {
        actions.exec();
      } else if (event.keyCode === 13) {
        actions.enter();
      } else {
        actions.insert(String.fromCharCode(event.charCode));
      }
      return false;
    });
    $('body').keydown(function(event) {
      if (event.keyCode === 8) {
        actions.backspace();
      }
    });
    $('#closeOutputButton').bind('mouseup touchend', function(event) {
      event.preventDefault();
      $('#pageInput').show();
      $('#pageOutput').hide();
      return false;
    });
    hashParams = {};
    if (location.hash) {
      _ref = location.hash.substring(1).split(',');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        nameValue = _ref[_i];
        _ref1 = nameValue.split('='), name = _ref1[0], value = _ref1[1];
        hashParams[name] = unescape(value);
      }
    }
    code = hashParams.code;
    if (code) {
      _results = [];
      for (_j = 0, _len1 = code.length; _j < _len1; _j++) {
        c = code[_j];
        if (c === '\n') {
          _results.push(actions.enter());
        } else {
          _results.push(actions.insert(c));
        }
      }
      return _results;
    }
  });

}).call(this);