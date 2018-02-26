var urlPrefix=UrlPrefix;define("editor_drop_paste",["jquery.ui.widget","fileupload"],function(){function Process(editor){var id="__mcenew"+(new Date).getTime();var str='<div contenteditable="false" id="'+id+'" class="leanote-image-container">'+'<img class="loader" src="/images/ajax-loader.gif">'+'<div class="progress">'+'<div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="2" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">'+"0%"+"</div>"+"</div>"+"</div>";this.containerStr=str;editor.insertContent(str);var container=$("#"+id);this.container=container;this.id=id;this.processBar=container.find(".progress-bar")}Process.prototype.update=function(process){var me=this;process=Math.ceil(process*100);if(process>=100){process=99}process+="%";$("#"+me.id+" .progress-bar").html(process).css("width",process)};Process.prototype.replace=function(src){var me=this;getImageSize(src,function(){$("#"+me.id).replaceWith('<img src="'+src+'" />')})};Process.prototype.remove=function(){var me=this;$("#"+me.id).remove()};function getImageSize(url,callback){var img=document.createElement("img");function done(width,height){img.parentNode.removeChild(img);callback({width:width,height:height})}img.onload=function(){done(img.clientWidth,img.clientHeight)};img.onerror=function(){done()};img.src=url;var style=img.style;style.visibility="hidden";style.position="fixed";style.bottom=style.left=0;style.width=style.height="auto";document.body.appendChild(img)}var i=1;function insertImage(data){var editor=tinymce.activeEditor;var dom=editor.dom;var renderImage=function(data2){var d={};var imgElm;d.id="__mcenew"+i++;d.src="http://leanote.com/images/loading-24.gif";imgElm=dom.createHTML("img",d);tinymce.activeEditor.insertContent(imgElm);imgElm=dom.get(d.id);function callback(wh){dom.setAttrib(imgElm,"src",data2.src);if(data2.title){dom.setAttrib(imgElm,"title",data2.title)}dom.setAttrib(imgElm,"id",null)}getImageSize(data.src,callback)};var fileId="";fileIds=data.src.split("fileId=");if(fileIds.length==2&&fileIds[1].length=="53aecf8a8a039a43c8036282".length){fileId=fileIds[1]}if(fileId){var curNote=Note.getCurNote();if(curNote&&curNote.UserId!=UserInfo.UserId){(function(data){ajaxPost("/file/copyImage",{userId:UserInfo.UserId,fileId:fileId,toUserId:curNote.UserId},function(re){if(reIsOk(re)&&re.Id){var urlPrefix=window.location.protocol+"//"+window.location.host;data.src=urlPrefix+"/file/outputImage?fileId="+re.Id}renderImage(data)})})(data)}else{renderImage(data)}}else{renderImage(data)}}var initUploader=function(){var ul=$("#upload ul");$("#drop a").click(function(){$(this).parent().find("input").click()});$("#upload").fileupload({dataType:"json",pasteZone:"",acceptFileTypes:/(\.|\/)(gif|jpg|jpeg|png|jpe)$/i,maxFileSize:21e4,dropZone:$("#drop"),formData:function(form){return[{name:"albumId",value:""}]},add:function(e,data){var tpl=$('<li><div class="alert alert-info"><img class="loader" src="/tinymce/plugins/leaui_image/public/images/ajax-loader.gif"> <a class="close" data-dismiss="alert">×</a></div></li>');tpl.find("div").append(data.files[0].name+" <small>[<i>"+formatFileSize(data.files[0].size)+"</i>]</small>");data.context=tpl.appendTo(ul);var jqXHR=data.submit()},done:function(e,data){if(data.result.Ok==true){data.context.remove();var data2={src:urlPrefix+"/file/outputImage?fileId="+data.result.Id};insertImage(data2)}else{data.context.empty();var tpl=$('<li><div class="alert alert-danger"><a class="close" data-dismiss="alert">×</a></div></li>');tpl.find("div").append("<b>Error:</b> "+data.files[0].name+" <small>[<i>"+formatFileSize(data.files[0].size)+"</i>]</small> "+data.result.Msg);data.context.append(tpl);setTimeout(function(tpl){return function(){tpl.remove()}}(tpl),2e3)}$("#uploadMsg").scrollTop(1e3)},fail:function(e,data){data.context.empty();var tpl=$('<li><div class="alert alert-danger"><a class="close" data-dismiss="alert">×</a></div></li>');tpl.find("div").append("<b>Error:</b> "+data.files[0].name+" <small>[<i>"+formatFileSize(data.files[0].size)+"</i>]</small> "+data.errorThrown);data.context.append(tpl);setTimeout(function(tpl){return function(){tpl.remove()}}(tpl),2e3);$("#uploadMsg").scrollTop(1e3)}});$(document).on("drop dragover",function(e){e.preventDefault()});function formatFileSize(bytes){if(typeof bytes!=="number"){return""}if(bytes>=1e9){return(bytes/1e9).toFixed(2)+" GB"}if(bytes>=1e6){return(bytes/1e6).toFixed(2)+" MB"}return(bytes/1e3).toFixed(2)+" KB"}function showUpload(){$("#upload").css("z-index",12);var top=+$("#mceToolbar").css("height").slice(0,-2);$("#upload").css("top",top-8);$("#upload").show()}function hideUpload(){$("#upload").css("z-index",0).css("top","auto").hide()}$(document).bind("dragover",function(e){var dropZone=$("#drop"),timeout=window.dropZoneTimeout;if(!timeout){dropZone.addClass("in");showUpload()}else{clearTimeout(timeout)}var found=false,node=e.target;do{if(node===dropZone[0]){found=true;break}node=node.parentNode}while(node!=null);if(found){dropZone.addClass("hover")}else{dropZone.removeClass("hover")}window.dropZoneTimeout=setTimeout(function(){window.dropZoneTimeout=null;dropZone.removeClass("in hover");hideUpload()},100)})};var pasteImageInit=function(){var dom,editor;$("#editorContent").fileupload({dataType:"json",pasteZone:$("#editorContent"),dropZone:"",maxFileSize:21e4,url:"/file/pasteImage",paramName:"file",formData:function(form){return[{name:"from",value:"pasteImage"},{name:"noteId",value:Note.curNoteId}]},progress:function(e,data){data.process.update(data.loaded/data.total)},add:function(e,data){var note=Note.getCurNote();if(!note||note.IsNew){alert("This note hasn't saved, please save it firstly!");return}editor=tinymce.EditorManager.activeEditor;var process=new Process(editor);data.process=process;var jqXHR=data.submit()},done:function(e,data){if(data.result.Ok==true){var re=data.result;var urlPrefix=UrlPrefix;var src=urlPrefix+"/file/outputImage?fileId="+re.Id;data.process.replace(src)}else{data.process.remove()}},fail:function(e,data){data.process.remove()}})};initUploader();pasteImageInit()});