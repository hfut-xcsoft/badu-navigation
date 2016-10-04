function menuDelegate(e){var t=$(e.target);t.is("li")&&($(this).children(".active").removeClass("active"),$("#"+$(this).data("active")).removeClass("active"),t.addClass("active"),$("#"+t.data("target")).addClass("active"),$(this).data("active",t.data("target")),setIconAndDescription(t.data("category"),t.data("icon-url"),t.data("description")))}function linkHoverDelegate(e){var t=$(e.target);t.is("a")&&setIconAndDescription(t.data("category"),t.data("icon-url"),t.data("description"))}function linkOutDelegate(e){var t=$(this).parent().find("ul .active").first();setIconAndDescription(t.data("category"),t.data("icon-url"),t.data("description"))}function setIconAndDescription(e,t,n){var a=$("#link-info-"+e);t&&a.find(".icon img").first().attr("src",t),a.children(".description").first().text(n)}function linkClickDelegate(e){var t=$(e.target);t.is("a")&&$.post("api/statistics?type=click&id="+t.data("id")).error(function(){})}function setBgColor(e){Modernizr.csstransitions?$("#background").css("background-color",e):$("#background").clearQueue().animate({backgroundColor:e},{duration:3e3,easing:"swing"})}function colorOpen(e){Modernizr.csstransitions||$(".bg-color").clearQueue().animate({marginLeft:"18px",marginBottom:"18px"},{duration:500,easing:"swing"})}function colorClose(e){Modernizr.csstransitions||$(".bg-color").clearQueue().animate({marginLeft:"-18px",marginBottom:"-18px"},{duration:500,easing:"swing"})}function colorDelegate(e){var t=$(e.target);if(t.is("a")){var n=t.data("color");setBgColor(n),saveBgColor(n)}}function searchInputHandle(e){13===e.keyCode&&search()}function search(){var e,t=$('input[name="engine"]:checked').val(),n=$("#search-input").val();switch(t){case"google":e="https://letsgg.tk/search?q="+encodeURIComponent(n);break;case"bing":e="https://cn.bing.com/search?q="+encodeURIComponent(n);break;case"sogou":e="https://www.sogou.com/web?query="+encodeURIComponent(n);break;case"baidu":e="https://www.baidu.com/s?wd="+encodeURIComponent(n);break;case"wikipedia":e=n?"https://w.hancel.net/w/index.php?search="+encodeURIComponent(n):"https://w.hancel.net";break;default:return}window.open(e,"_blank")}function handleShare(){var e=$(this),t=$("#recommend").toggle().find("form").first();t.trigger("reset"),t.find('input[name="category"]').val(e.data("category"))}function popup(e){switch(e){case"submit":return void $("#recommend").toggle();case"feedback":return void $("#feedback").toggle()}}function closepop(){$(".popup").each(function(){$(this).css("display","none")})}function arrayToObject(e){for(var t={},n=0;n<e.length;n++){if(!e[n].value)return!1;t[e[n].name]=e[n].value}return t}function handleForm(e){return function(t){t.preventDefault(),t.stopPropagation();var n=$(this),a=n.serializeArray(),o=arrayToObject(a);return o?($.ajax({type:"POST",url:e,contentType:"application/json",data:JSON.stringify(o)}).success(function(){/submits/.test(e)?alert("感谢您的分享, 已提交至管理员审核, 审核通过后我们将通过邮件通知您"):alert("提交成功, 感谢您的反馈"),n.trigger("reset"),$(".popup").hide()}).error(function(e){e.status<500?alert("提交失败: "+e.responseJSON&&e.responseJSON.message):alert("提交失败, 网络错误, 请稍后再试")}),!1):(alert("请将表单填写完整"),!1)}}function init(){var e=$.cookie("engine");e||(e="google",saveEngine(e)),$('input[name="engine"][value="'+e+'"]').prop("checked",!0);var t=$.cookie("bgcolor");t||(t="#b9887d",saveBgColor(t)),setBgColor(t)}function saveEngine(e){e=$(this).attr("value")||e,$.cookie("engine",e,{expires:365,path:"/"})}function saveBgColor(e){$.cookie("bgcolor",e,{expires:365,path:"/"})}$(function(){init(),$("#engines input").click(saveEngine),$(".second-classes").mouseover(menuDelegate),$(".share").click(handleShare),$(".link-page").mouseover(linkHoverDelegate),$(".link-page").mouseleave(linkOutDelegate),$(".link-page").click(linkClickDelegate),$("#ctrl-panel").hover(colorOpen,colorClose),$("#ctrl-panel").click(colorDelegate),$("#search-input").on("keypress",searchInputHandle),$("#search-button").click(search),$("#recommend-form").submit(handleForm("api/submits")),$("#feedback-form").submit(handleForm("api/feedbacks"))});