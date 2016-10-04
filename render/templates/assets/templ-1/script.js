$(function () {
  init();
  $('#engines input').click(saveEngine);
  $('.second-classes').mouseover(menuDelegate);
  $('.share').click(handleShare);
  $('.link-page').mouseover(linkHoverDelegate);
  $('.link-page').mouseleave(linkOutDelegate);
  $('.link-page').click(linkClickDelegate);
  $('#ctrl-panel').hover(colorOpen, colorClose);
  $('#ctrl-panel').click(colorDelegate);
  $('#search-input').on('keypress', searchInputHandle);
  $('#search-button').click(search);
  $('#recommend-form').submit(handleForm('api/submits'));
  $('#feedback-form').submit(handleForm('api/feedbacks'));
});

function menuDelegate(e) {
  var $target = $(e.target);
  if (!$target.is('li')) {
    return;
  }
  $(this).children('.active').removeClass('active');
  $('#' + $(this).data('active')).removeClass('active');
  $target.addClass('active');
  $('#' + $target.data('target')).addClass('active');
  $(this).data('active', $target.data('target'));
  setIconAndDescription($target.data('category'), $target.data('icon-url'), $target.data('description'))
}

function linkHoverDelegate(e) {
  var $target = $(e.target);
  if (!$target.is('a')) {
    return;
  }
  setIconAndDescription($target.data('category'), $target.data('icon-url'), $target.data('description'))
}
function linkOutDelegate(e) {
  var elem = $(this).parent().find('ul .active').first();
  setIconAndDescription(elem.data('category'), elem.data('icon-url'), elem.data('description'))
}

function setIconAndDescription(category, icon, description) {
  var infoElem = $('#link-info-' + category);
  if (icon) {
    infoElem.find('.icon img').first().attr('src', icon)
  }
  infoElem.children('.description').first().text(description);

}

function linkClickDelegate(e) {
  var $target = $(e.target);
  if (!$target.is('a')) {
    return;
  }
  $.post('api/statistics?type=click&id=' + $target.data('id')).error(function () {});
}

function setBgColor(color) {

  if (Modernizr.csstransitions) {
    $('#background').css('background-color', color);
  } else {
    $('#background').clearQueue().animate(
      { backgroundColor: color }, {
        duration: 3000,
        easing: 'swing'
      })
  }
}

function colorOpen(e) {
  if (!Modernizr.csstransitions) {
    $('.bg-color').clearQueue().animate(
      { marginLeft: '18px', marginBottom: '18px' }, {
        duration: 500,
        easing: 'swing'
      })
  }
}
function colorClose(e) {
  if (!Modernizr.csstransitions) {
    $('.bg-color').clearQueue().animate(
      { marginLeft: '-18px', marginBottom: '-18px' }, {
        duration: 500,
        easing: 'swing'
      })
  }
}

function colorDelegate(e) {
  var $target = $(e.target);
  if (!$target.is('a')) {
    return;
  }
  var color = $target.data('color')
  setBgColor(color);
  saveBgColor(color);
}

function searchInputHandle(e) {
  if (e.keyCode === 13) {
    search();
  }
}

function search() {
  var engine =  $('input[name="engine"]:checked').val();
  var content = $('#search-input').val();
  var url;
  switch (engine) {
    case 'google':
      url = 'https://letsgg.tk/search?q=' + encodeURIComponent(content);
      break;

    case 'bing':
      url = 'https://cn.bing.com/search?q=' + encodeURIComponent(content);
      break;

    case 'sogou':
      url = 'https://www.sogou.com/web?query=' + encodeURIComponent(content);
      break;

    case 'baidu':
      url = 'https://www.baidu.com/s?wd=' + encodeURIComponent(content);
      break;

    case 'wikipedia':
      if (content) {
        url = 'https://w.hancel.net/w/index.php?search=' + encodeURIComponent(content);
      } else {
        url = 'https://w.hancel.net';
      }
      break;

    default:
      return;
  }
  window.open(url, '_blank');
}

function handleShare() {
  var share = $(this);
  var form = $('#recommend').toggle().find('form').first();
  form.trigger('reset');
  form.find('input[name="category"]').val(share.data('category'))
}

function popup(type) {
  switch (type) {
    case 'submit':
      $('#recommend').toggle();
      return;

    case 'feedback':
      $('#feedback').toggle();
      return;
  }
}

function closepop() {
  $('.popup').each(function () {
    $(this).css('display', 'none');
  })
}

function arrayToObject(array) {
  var obj = {};
  for (var i = 0; i < array.length; i++) {
    if (!array[i]['value']) {
      return false;
    }
    obj[array[i]['name']] = array[i]['value'];
  }
  return obj;
}


function handleForm(url) {
  return function (e) {
    e.preventDefault();
    e.stopPropagation();
    var form = $(this);
    var array = form.serializeArray();
    var obj = arrayToObject(array);
    if (!obj) {
      alert('请将表单填写完整');
      return false;
    }
    $.ajax({
      type: 'POST',
      url: url,
      contentType: 'application/json',
      data: JSON.stringify(obj)
    }).success(function() {
      if (/submits/.test(url)) {
        alert('感谢您的分享, 已提交至管理员审核, 审核通过后我们将通过邮件通知您');
      } else {
        alert('提交成功, 感谢您的反馈');
      }
      form.trigger("reset");
      $('.popup').hide();
    }).error(function (xhr) {
      if (xhr.status < 500) {
        alert('提交失败: ' + xhr.responseJSON && xhr.responseJSON.message);
      } else {
        alert('提交失败, 网络错误, 请稍后再试');
      }
    });
    return false;
  }
}

function init() {
  var engine = $.cookie('engine');
  if (!engine) {
    engine = 'google';
    saveEngine(engine)
  }
  $('input[name="engine"][value="' + engine + '"]').prop('checked',true);

  var bgColor = $.cookie('bgcolor');
  if (!bgColor) {
    bgColor = '#b9887d';
    saveBgColor(bgColor);
  }
  setBgColor(bgColor);
}
function saveEngine(engine) {
  engine = $(this).attr('value') || engine;
  $.cookie('engine', engine, { expires: 365, path: '/' });
}
function saveBgColor(color) {
  $.cookie('bgcolor', color, { expires: 365, path: '/' });
}
