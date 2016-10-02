$(function () {
  init();
  $('#engines input').click(saveEngine);
  $('.second-classes').mouseover(menuDelegate);
  $('.link-page').mouseover(linkHoverDelegate);
  $('.link-page').click(linkClickDelegate);
  $('#ctrl-panel').click(colorDelegate);
  $('#search-input').on('keypress', searchInputHandle);
  $('#search-button').click(search);
  $('#recommend-form').submit(handleRecommend);
  $('#feedback-form').submit(handleFeedback);
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

function setIconAndDescription(category, icon, description) {
  var infoElem = $('#link-info-' + category);
  if (icon) {
    infoElem.children('.icon').first().attr('src', icon)
  }
  infoElem.children('.description').first().text(description);

}

function linkClickDelegate(e) {
  var $target = $(e.target);
  if (!$target.is('a')) {
    return;
  }
  $.post('api/statistics?type=click&id=' + $target.data('id')).error(console.log);
}

function setBgColor(color) {

  if (Modernizr.csstransitions) {
    $('#background').css('background-color', color);
  } else {
    $('#background').animate(
      { backgroundColor: color }, {
        duration: 3000,
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
  $.cookie('bgcolor', color, { expires: 7, path: '/' });
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

function handleRecommend(e) {
  e.preventDefault();
  e.stopPropagation();
  var form = $(this);
  var array = form.serializeArray();
  var obj = arrayToObject(array);
  if (!obj) {
    alert('请填写完整');
    return false;
  }
  $.ajax({
    type: 'POST',
    url: 'api/submits',
    contentType: 'application/json',
    data: JSON.stringify(obj)
  }).success(function() {
    alert('提交成功')
    form.trigger("reset");
  }).error(function (xhr) {
    if (xhr.status < 500) {
      alert('提交失败: ' + xhr.responseJSON && xhr.responseJSON.message);
    } else {
      alert('提交失败, 网络错误, 请稍后再试');
    }
  });
  return false;
}

function handleFeedback(e) {
  e.preventDefault();
  e.stopPropagation();
  var form = $(this);
  var array = form.serializeArray();
  var obj = arrayToObject(array);
  if (!obj) {
    alert('请填写完整');
    return false;
  }
  $.ajax({
    type: 'POST',
    url: 'api/feedbacks',
    contentType: 'application/json',
    data: JSON.stringify(obj)
  }).success(function() {
    alert('提交成功');
    form.trigger("reset");
  }).error(function (xhr) {
    if (xhr.status < 500) {
      alert('提交失败: ' + xhr.responseJSON && xhr.responseJSON.message);
    } else {
      alert('提交失败, 网络错误, 请稍后再试');
    }
  });
  return false;
}

function init() {
  var engine = $.cookie('engine');
  if (!engine) {
    engine = 'google';
    $.cookie('engine', engine, { expires: 7, path: '/' });
  }
  $('input[name="engine"][value="' + engine + '"]').prop('checked',true);

  var bgColor = $.cookie('bgcolor');
  if (!bgColor) {
    bgColor = '#b9887d';
    $.cookie('bgcolor', bgColor, { expires: 7, path: '/' });
  }
  setBgColor(bgColor);
}
function saveEngine() {
  var engine = $(this).attr('value');
  $.cookie('engine', engine, { expires: 7, path: '/' });
}
