Notebook.curNotebookId="";Notebook.cache={};Notebook.notebooks=[];Notebook.notebookNavForListNote="";Notebook.notebookNavForNewNote="";Notebook.setCache=function(notebook){var notebookId=notebook.NotebookId;if(!notebookId){return}if(!Notebook.cache[notebookId]){Notebook.cache[notebookId]={}}$.extend(Notebook.cache[notebookId],notebook)};Notebook.getCurNotebookId=function(){return Notebook.curNotebookId};Notebook.getCurNotebook=function(){return Notebook.cache[Notebook.curNotebookId]};Notebook._updateNotebookNumberNotes=function(notebookId,n){var self=this;var notebook=self.getNotebook(notebookId);if(!notebook){return}notebook.NumberNotes+=n;if(notebook.NumberNotes<0){notebook.NumberNotes=0}$("#numberNotes_"+notebookId).html(notebook.NumberNotes)};Notebook.incrNotebookNumberNotes=function(notebookId){var self=this;self._updateNotebookNumberNotes(notebookId,1)};Notebook.minusNotebookNumberNotes=function(notebookId){var self=this;self._updateNotebookNumberNotes(notebookId,-1)};Notebook.getNotebook=function(notebookId){return Notebook.cache[notebookId]};Notebook.getNotebookTitle=function(notebookId){var notebook=Notebook.cache[notebookId];if(notebook){return notebook.Title}else{return"未知"}};Notebook.getTreeSetting=function(isSearch,isShare){var noSearch=!isSearch;var self=this;function addDiyDom(treeId,treeNode){var spaceWidth=5;var switchObj=$("#"+treeId+" #"+treeNode.tId+"_switch"),icoObj=$("#"+treeId+" #"+treeNode.tId+"_ico");switchObj.remove();icoObj.before(switchObj);if(!isShare){if(!Notebook.isAllNotebookId(treeNode.NotebookId)&&!Notebook.isTrashNotebookId(treeNode.NotebookId)){icoObj.after($('<span class="notebook-number-notes" id="numberNotes_'+treeNode.NotebookId+'">'+(treeNode.NumberNotes||0)+"</span>"));icoObj.after($('<span class="fa notebook-setting" title="setting"></span>'))}}else{if(!Share.isDefaultNotebookId(treeNode.NotebookId)){icoObj.after($('<span class="fa notebook-setting" title="setting"></span>'))}}if(treeNode.level>1){var spaceStr="<span style='display: inline-block;width:"+spaceWidth*treeNode.level+"px'></span>";switchObj.before(spaceStr)}}function beforeDrag(treeId,treeNodes){for(var i=0,l=treeNodes.length;i<l;i++){if(treeNodes[i].drag===false){return false}}return true}function beforeDrop(treeId,treeNodes,targetNode,moveType){return targetNode?targetNode.drop!==false:true}function onDrop(e,treeId,treeNodes,targetNode,moveType){var treeNode=treeNodes[0];if(!targetNode){return}var parentNode;var treeObj=self.tree;var ajaxData={curNotebookId:treeNode.NotebookId};if(moveType=="inner"){parentNode=targetNode}else{parentNode=targetNode.getParentNode()}if(!parentNode){var nodes=treeObj.getNodes()}else{ajaxData.parentNotebookId=parentNode.NotebookId;var nextLevel=parentNode.level+1;function filter(node){return node.level==nextLevel}var nodes=treeObj.getNodesByFilter(filter,false,parentNode)}ajaxData.siblings=[];for(var i in nodes){var notebookId=nodes[i].NotebookId;if(!Notebook.isAllNotebookId(notebookId)&&!Notebook.isTrashNotebookId(notebookId)){ajaxData.siblings.push(notebookId)}}ajaxPost("/notebook/dragNotebooks",{data:JSON.stringify(ajaxData)});setTimeout(function(){Notebook.changeNav()},100)}if(!isShare){var onClick=function(e,treeId,treeNode){var notebookId=treeNode.NotebookId;Notebook.changeNotebook(notebookId)};var onDblClick=function(e){var notebookId=$(e.target).attr("notebookId");if(!Notebook.isAllNotebookId(notebookId)&&!Notebook.isTrashNotebookId(notebookId)){self.updateNotebookTitle(e.target)}}}else{var onClick=function(e,treeId,treeNode){var notebookId=treeNode.NotebookId;var fromUserId=$(e.target).closest(".friend-notebooks").attr("fromUserId");Share.changeNotebook(fromUserId,notebookId)};var onDblClick=null}var setting={view:{showLine:false,showIcon:false,selectedMulti:false,dblClickExpand:false,addDiyDom:addDiyDom},data:{key:{name:"Title",children:"Subs"}},edit:{enable:true,showRemoveBtn:false,showRenameBtn:false,drag:{isMove:noSearch,prev:noSearch,inner:noSearch,next:noSearch}},callback:{beforeDrag:beforeDrag,beforeDrop:beforeDrop,onDrop:onDrop,onClick:onClick,onDblClick:onDblClick,beforeRename:function(treeId,treeNode,newName,isCancel){if(newName==""){if(treeNode.IsNew){self.tree.removeNode(treeNode);return true}return false}if(treeNode.Title==newName){return true}if(treeNode.IsNew){var parentNode=treeNode.getParentNode();var parentNotebookId=parentNode?parentNode.NotebookId:"";self.doAddNotebook(treeNode.NotebookId,newName,parentNotebookId)}else{self.doUpdateNotebookTitle(treeNode.NotebookId,newName)}return true}}};if(isSearch){}return setting};Notebook.allNotebookId="0";Notebook.trashNotebookId="-1";Notebook.curNotebookIsTrashOrAll=function(){return Notebook.curNotebookId==Notebook.trashNotebookId||Notebook.curNotebookId==Notebook.allNotebookId};Notebook.renderNotebooks=function(notebooks){var self=this;if(!notebooks||typeof notebooks!="object"||notebooks.length<0){notebooks=[]}for(var i=0,len=notebooks.length;i<len;++i){var notebook=notebooks[i];notebook.Title=trimTitle(notebook.Title)}notebooks=[{NotebookId:Notebook.allNotebookId,Title:getMsg("all"),drop:false,drag:false}].concat(notebooks);notebooks.push({NotebookId:Notebook.trashNotebookId,Title:getMsg("trash"),drop:false,drag:false});Notebook.notebooks=notebooks;self.tree=$.fn.zTree.init($("#notebookList"),self.getTreeSetting(),notebooks);var $notebookList=$("#notebookList");$notebookList.hover(function(){if(!$(this).hasClass("showIcon")){$(this).addClass("showIcon")}},function(){$(this).removeClass("showIcon")});if(!isEmpty(notebooks)){Notebook.curNotebookId=notebooks[0].NotebookId;self.cacheAllNotebooks(notebooks)}Notebook.renderNav();Notebook.changeNotebookNavForNewNote(notebooks[0].NotebookId)};Notebook.cacheAllNotebooks=function(notebooks){var self=this;for(var i in notebooks){var notebook=notebooks[i];Notebook.cache[notebook.NotebookId]=notebook;if(!isEmpty(notebook.Subs)){self.cacheAllNotebooks(notebook.Subs)}}};Notebook.expandNotebookTo=function(notebookId,userId){var me=this;var selected=false;var tree=me.tree;if(userId){tree=Share.trees[userId]}if(!tree){return}var curNode=tree.getNodeByTId(notebookId);if(!curNode){return}while(true){var pNode=curNode.getParentNode();if(pNode){tree.expandNode(pNode,true);if(!selected){Notebook.changeNotebookNav(notebookId);selected=true}curNode=pNode}else{if(!selected){Notebook.changeNotebookNav(notebookId)}break}}};Notebook.renderNav=function(nav){var self=this;self.changeNav()};Notebook.searchNotebookForAddNote=function(key){var self=this;if(key){var notebooks=self.tree.getNodesByParamFuzzy("Title",key);notebooks=notebooks||[];var notebooks2=[];for(var i in notebooks){var notebookId=notebooks[i].NotebookId;if(!self.isAllNotebookId(notebookId)&&!self.isTrashNotebookId(notebookId)){notebooks2.push(notebooks[i])}}if(isEmpty(notebooks2)){$("#notebookNavForNewNote").html("")}else{$("#notebookNavForNewNote").html(self.getChangedNotebooks(notebooks2))}}else{$("#notebookNavForNewNote").html(self.everNavForNewNote)}};Notebook.searchNotebookForList=function(key){var self=this;var $search=$("#notebookListForSearch");var $notebookList=$("#notebookList");if(key){$search.show();$notebookList.hide();var notebooks=self.tree.getNodesByParamFuzzy("Title",key);log("search");log(notebooks);if(isEmpty(notebooks)){$search.html("")}else{var setting=self.getTreeSetting(true);self.tree2=$.fn.zTree.init($search,setting,notebooks)}}else{self.tree2=null;$search.hide();$notebookList.show();$("#notebookNavForNewNote").html(self.everNavForNewNote)}};Notebook.getChangedNotebooks=function(notebooks){var self=this;var navForNewNote="";var len=notebooks.length;for(var i=0;i<len;++i){var notebook=notebooks[i];var classes="";if(!isEmpty(notebook.Subs)){classes="dropdown-submenu"}var eachForNew=tt('<li role="presentation" class="clearfix ?"><div class="new-note-left pull-left" title="为该笔记本新建笔记" href="#" notebookId="?">?</div><div title="为该笔记本新建markdown笔记" class="new-note-right pull-left" notebookId="?">M</div>',classes,notebook.NotebookId,notebook.Title,notebook.NotebookId);if(!isEmpty(notebook.Subs)){eachForNew+="<ul class='dropdown-menu'>";eachForNew+=self.getChangedNotebooks(notebook.Subs);eachForNew+="</ul>"}eachForNew+="</li>";navForNewNote+=eachForNew}return navForNewNote};Notebook.everNavForNewNote="";Notebook.everNotebooks=[];Notebook.changeNav=function(){var self=Notebook;var notebooks=Notebook.tree.getNodes();var pureNotebooks=notebooks.slice(1,-1);var html=self.getChangedNotebooks(pureNotebooks);self.everNavForNewNote=html;self.everNotebooks=pureNotebooks;$("#notebookNavForNewNote").html(html);var t1=(new Date).getTime();Note.initContextmenu();Share.initContextmenu(Note.notebooksCopy);var t2=(new Date).getTime();log(t2-t1)};Notebook.renderShareNotebooks=function(sharedUserInfos,shareNotebooks){if(isEmpty(sharedUserInfos)){return}if(!shareNotebooks||typeof shareNotebooks!="object"||shareNotebooks.length<0){return}var $shareNotebooks=$("#shareNotebooks");var user2ShareNotebooks={};for(var i in shareNotebooks){var userNotebooks=shareNotebooks[i];user2ShareNotebooks[userNotebooks.UserId]=userNotebooks}for(var i in sharedUserInfos){var userInfo=sharedUserInfos[i];var userNotebooks=user2ShareNotebooks[userInfo.UserId]||{ShareNotebooks:[]};userNotebooks.ShareNotebooks=[{NotebookId:"-2",Title:"默认共享"}].concat(userNotebooks.ShareNotebooks);var username=userInfo.Username||userInfo.Email;var header=tt('<div class="folderNote closed"><div class="folderHeader"><a><h1 title="? 的共享"><i class="fa fa-angle-right"></i>?</h1></a></div>',username,username);var body='<ul class="folderBody">';for(var j in userNotebooks.ShareNotebooks){var notebook=userNotebooks.ShareNotebooks[j];body+=tt('<li><a notebookId="?">?</a></li>',notebook.NotebookId,notebook.Title)}body+="</ul>";$shareNotebooks.append(header+body+"</div>")}};Notebook.selectNotebook=function(target){$(".notebook-item").removeClass("curSelectedNode");$(target).addClass("curSelectedNode")};Notebook.changeNotebookNavForNewNote=function(notebookId,title){if(!notebookId){var notebook=Notebook.notebooks[0];notebookId=notebook.NotebookId;title=notebook.Title}if(!title){var notebook=Notebook.cache[0];title=notebook.Title}if(!Notebook.isAllNotebookId(notebookId)&&!Notebook.isTrashNotebookId(notebookId)){$("#curNotebookForNewNote").html(title).attr("notebookId",notebookId)}else if(!$("#curNotebookForNewNote").attr("notebookId")){if(Notebook.notebooks.length>2){var notebook=Notebook.notebooks[1];notebookId=notebook.NotebookId;title=notebook.Title;Notebook.changeNotebookNavForNewNote(notebookId,title)}}};Notebook.toggleToMyNav=function(userId,notebookId){$("#sharedNotebookNavForListNav").hide();$("#myNotebookNavForListNav").show();$("#newMyNote").show();$("#newSharedNote").hide();$("#tagSearch").hide()};Notebook.changeNotebookNav=function(notebookId){Notebook.curNotebookId=notebookId;Notebook.toggleToMyNav();Notebook.selectNotebook($(tt('#notebook [notebookId="?"]',notebookId)));var notebook=Notebook.cache[notebookId];if(!notebook){return}$("#curNotebookForListNote").html(notebook.Title);Notebook.changeNotebookNavForNewNote(notebookId,notebook.Title)};Notebook.isAllNotebookId=function(notebookId){return notebookId==Notebook.allNotebookId};Notebook.isTrashNotebookId=function(notebookId){return notebookId==Notebook.trashNotebookId};Notebook.curActiveNotebookIsAll=function(){return Notebook.isAllNotebookId($("#notebookList .active").attr("notebookId"))};Notebook.changeNotebookSeq=1;Notebook.changeNotebook=function(notebookId,callback){var me=this;Notebook.changeNotebookNav(notebookId);Notebook.curNotebookId=notebookId;Note.curChangedSaveIt();Note.clearAll();var url="/note/listNotes/";var param={notebookId:notebookId};if(Notebook.isTrashNotebookId(notebookId)){url="/note/listTrashNotes";param={}}else if(Notebook.isAllNotebookId(notebookId)){param={};cacheNotes=Note.getNotesByNotebookId();if(!isEmpty(cacheNotes)){if(callback){callback(cacheNotes)}else{Note.renderNotesAndFirstOneContent(cacheNotes)}return}}else{cacheNotes=Note.getNotesByNotebookId(notebookId);var notebook=Notebook.cache[notebookId];var len=cacheNotes?cacheNotes.length:0;if(len==notebook.NumberNotes){if(callback){callback(cacheNotes)}else{Note.renderNotesAndFirstOneContent(cacheNotes)}return}else{Note.clearCacheByNotebookId(notebookId);log("数量不一致")}}me.showNoteAndEditorLoading();me.changeNotebookSeq++;(function(seq){ajaxGet(url,param,function(cacheNotes){if(seq!=me.changeNotebookSeq){log("notebook changed too fast!");log(cacheNotes);return}if(callback){callback(cacheNotes)}else{Note.renderNotesAndFirstOneContent(cacheNotes)}me.hideNoteAndEditorLoading()})})(me.changeNotebookSeq)};Notebook.showNoteAndEditorLoading=function(){$("#noteAndEditorMask").show()};Notebook.hideNoteAndEditorLoading=function(){$("#noteAndEditorMask").hide()};Notebook.isCurNotebook=function(notebookId){return $(tt('#notebookList [notebookId="?"], #shareNotebooks [notebookId="?"]',notebookId,notebookId)).attr("class")=="active"};Notebook.changeNotebookForNewNote=function(notebookId){if(Notebook.isTrashNotebookId(notebookId)||Notebook.isAllNotebookId(notebookId)){return}Notebook.changeNotebookNav(notebookId,true);Notebook.curNotebookId=notebookId;var url="/note/listNotes/";var param={notebookId:notebookId};ajaxGet(url,param,function(ret){Note.renderNotes(ret,true)})};Notebook.listNotebookShareUserInfo=function(target){var notebookId=$(target).attr("notebookId");showDialogRemote("/share/listNotebookShareUserInfo",{notebookId:notebookId})};Notebook.shareNotebooks=function(target){var title=$(target).text();showDialog("dialogShareNote",{title:"分享笔记本给好友-"+title});setTimeout(function(){$("#friendsEmail").focus()},500);var notebookId=$(target).attr("notebookId");shareNoteOrNotebook(notebookId,false)};Notebook.setNotebook2Blog=function(target){var notebookId=$(target).attr("notebookId");var notebook=Notebook.cache[notebookId];var isBlog=true;if(notebook.IsBlog!=undefined){isBlog=!notebook.IsBlog}if(Notebook.curNotebookId==notebookId){if(isBlog){$("#noteList .item-blog").show()}else{$("#noteList .item-blog").hide()}}else if(Notebook.curNotebookId==Notebook.allNotebookId){$("#noteItemList .item").each(function(){var noteId=$(this).attr("noteId");var note=Note.cache[noteId];if(note.NotebookId==notebookId){if(isBlog)$(this).find(".item-blog").show();else $(this).find(".item-blog").hide()}})}ajaxPost("/notebook/setNotebook2Blog",{notebookId:notebookId,isBlog:isBlog},function(ret){if(ret){Note.setAllNoteBlogStatus(notebookId,isBlog);Notebook.setCache({NotebookId:notebookId,IsBlog:isBlog})}})};Notebook.updateNotebookTitle=function(target){var self=Notebook;var notebookId=$(target).attr("notebookId");if(self.tree2){self.tree2.editName(self.tree2.getNodeByTId(notebookId))}else{self.tree.editName(self.tree.getNodeByTId(notebookId))}};Notebook.doUpdateNotebookTitle=function(notebookId,newTitle){var self=Notebook;ajaxPost("/notebook/updateNotebookTitle",{notebookId:notebookId,title:newTitle},function(ret){Notebook.cache[notebookId].Title=newTitle;Notebook.changeNav();if(self.tree2){var notebook=self.tree.getNodeByTId(notebookId);notebook.Title=newTitle;self.tree.updateNode(notebook)}})};Notebook.addNotebookSeq=1;Notebook.addNotebook=function(){var self=Notebook;if($("#myNotebooks").hasClass("closed")){$("#myNotebooks .folderHeader").trigger("click")}self.tree.addNodes(null,{Title:"",NotebookId:getObjectId(),IsNew:true},true,true)};Notebook.doAddNotebook=function(notebookId,title,parentNotebookId){var self=Notebook;ajaxPost("/notebook/addNotebook",{notebookId:notebookId,title:title,parentNotebookId:parentNotebookId},function(ret){if(ret.NotebookId){Notebook.cache[ret.NotebookId]=ret;var notebook=self.tree.getNodeByTId(notebookId);$.extend(notebook,ret);notebook.IsNew=false;Notebook.changeNotebook(notebookId);Notebook.changeNav()}})};Notebook.addChildNotebook=function(target){var self=Notebook;if($("#myNotebooks").hasClass("closed")){$("#myNotebooks .folderHeader").trigger("click")}var notebookId=$(target).attr("notebookId");self.tree.addNodes(self.tree.getNodeByTId(notebookId),{Title:"",NotebookId:getObjectId(),IsNew:true},false,true)};Notebook.deleteNotebook=function(target){var self=Notebook;var notebookId=$(target).attr("notebookId");if(!notebookId){return}ajaxGet("/notebook/deleteNotebook",{notebookId:notebookId},function(ret){if(ret.Ok){self.tree.removeNode(self.tree.getNodeByTId(notebookId));if(self.tree2){self.tree2.removeNode(self.tree2.getNodeByTId(notebookId))}delete Notebook.cache[notebookId];Notebook.changeNav()}else{alert(ret.Msg)}})};$(function(){$("#minNotebookList").on("click","li",function(){var notebookId=$(this).find("a").attr("notebookId");Notebook.changeNotebook(notebookId)});var notebookListMenu={width:180,items:[{text:getMsg("shareToFriends"),alias:"shareToFriends",icon:"",faIcon:"fa-share-square-o",action:Notebook.listNotebookShareUserInfo},{type:"splitLine"},{text:getMsg("publicAsBlog"),alias:"set2Blog",faIcon:"fa-bold",action:Notebook.setNotebook2Blog},{text:getMsg("cancelPublic"),alias:"unset2Blog",faIcon:"fa-undo",action:Notebook.setNotebook2Blog},{type:"splitLine"},{text:getMsg("addChildNotebook"),faIcon:"fa-sitemap",action:Notebook.addChildNotebook},{text:getMsg("rename"),faIcon:"fa-pencil",action:Notebook.updateNotebookTitle},{text:getMsg("delete"),icon:"",alias:"delete",faIcon:"fa-trash-o",action:Notebook.deleteNotebook}],onShow:applyrule,onContextMenu:beforeContextMenu,parent:"#notebookList ",children:"li a"};var notebookListMenu2={width:180,items:[{text:getMsg("shareToFriends"),alias:"shareToFriends",icon:"",faIcon:"fa-share-square-o",action:Notebook.listNotebookShareUserInfo},{type:"splitLine"},{text:getMsg("publicAsBlog"),alias:"set2Blog",faIcon:"fa-bold",action:Notebook.setNotebook2Blog},{text:getMsg("cancelPublic"),alias:"unset2Blog",faIcon:"fa-undo",action:Notebook.setNotebook2Blog},{type:"splitLine"},{text:getMsg("rename"),icon:"",action:Notebook.updateNotebookTitle},{text:getMsg("delete"),icon:"",alias:"delete",faIcon:"fa-trash-o",action:Notebook.deleteNotebook}],onShow:applyrule,onContextMenu:beforeContextMenu,parent:"#notebookListForSearch ",children:"li a"};function applyrule(menu){var notebookId=$(this).attr("notebookId");var notebook=Notebook.cache[notebookId];if(!notebook){return}var items=[];if(!notebook.IsBlog){items.push("unset2Blog")}else{items.push("set2Blog")}if(Note.notebookHasNotes(notebookId)){items.push("delete")}menu.applyrule({name:"target2",disable:true,items:items})}function beforeContextMenu(){var notebookId=$(this).attr("notebookId");return!Notebook.isTrashNotebookId(notebookId)&&!Notebook.isAllNotebookId(notebookId)}Notebook.contextmenu=$("#notebookList li a").contextmenu(notebookListMenu);Notebook.contextmenuSearch=$("#notebookListForSearch li a").contextmenu(notebookListMenu2);$("#addNotebookPlus").click(function(e){e.stopPropagation();Notebook.addNotebook()});$("#notebookList").on("click",".notebook-setting",function(e){e.preventDefault();e.stopPropagation();var $p=$(this).parent();Notebook.contextmenu.showMenu(e,$p)});$("#notebookListForSearch").on("click",".notebook-setting",function(e){e.preventDefault();e.stopPropagation();var $p=$(this).parent();Notebook.contextmenuSearch.showMenu(e,$p)})});