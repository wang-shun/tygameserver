puremvc.define({name:"drawsomething.view.component.DrawPanel",constructor:function(){function e(e){t.el.find(".cursor").removeClass("cursor-1 cursor-2 cursor-3 cursor-4 cursor-5 cursor-6 cursor-7 cursor-8 cursor-9 cursor-10"),t.el.find(".cursor").addClass("cursor-"+e),t.selectedColor=e}var t=this;this.type=1,this.selectedColor=10,this.MAX_BRUSH=30,this.selectedBrush=1,this.colors=["","#ffffff","#322322","#bf5ebc","#6649b0","#3f71ae","#32c9e3","#9bea57","#eaca57","#e89054","#e85454"],this.brushes=[,2,5,10,20,30],this.container=document.querySelector("#drawPanel"),this.$container=$("#drawPanel"),this.stage=new createjs.Stage("drawingBoard"),this.drawingCanvas=new createjs.Shape,this.stage.addChild(this.drawingCanvas),this.stage.addEventListener("stagemousedown",function(){t.handleMouseDown(t)}),this.stage.addEventListener("stagemouseup",function(){t.handleMouseUp(t)}),this.drawingCanvas.cache(0,0,900,600),this.el=$("#drawPanel"),this.el.find(".colorcard").find(".circle").click(function(){var t=$(this).parent().index()+1;e(t)}),this.$container.find(".eraser").click(function(){t.type=2,t.$container.find(".pen").find(".selected").hide()}),this.$container.find(".pen").click(function(){t.type=1,$(this).find(".selected").show()}),this.$container.find(".delete").click(function(){t.dispatchDelete()}),this.$container.find(".sendBtn").click(function(){t.dispatchMsg()}),this.$container.find(".msgIpt").bind("keypress",function(e){"13"==e.keyCode&&t.dispatchMsg()}),$(document).bind("keypress",function(n){"119"==n.keyCode?t.selectedColor<10&&(t.selectedColor++,e(t.selectedColor)):"115"==n.keyCode?t.selectedColor>1&&(t.selectedColor--,e(t.selectedColor)):"97"==n.keyCode?t.$lineSet.find(".subtractBtn").click():"100"==n.keyCode&&t.$lineSet.find(".plusBtn").click()}),this.isDrawer=!1,this.countDown=60,this.$lineSet=this.$container.find(".lineSet"),this.initLineSet(),this.$endPop=this.$container.find(".endPop"),this.$endPop.find(".zanBtn").click(function(){t.sendLike()}),this.$endPop.find(".caiBtn").click(function(){t.sendUnlike()}),this.sendPosArray=[],this.receivePosArray=[],this.pane=$(".chatBox").jScrollPane({showArrows:!0,scrollbarWidth:15,arrowSize:16,autoReinitialise:!0,autoReinitialiseDelay:0,verticalDragMaxHeight:170}),this.paneApi=this.pane.data("jsp")}},{receivePos:function(e){this.receivePosArray=e.list,this.drawPos()},drawPos:function(){if(!this.isDrawer){for(var e=0;e<this.receivePosArray.length;e++)this.drawingHandle(this.receivePosArray[e]);this.receivePosArray=[]}},initLineSet:function(){function e(e){e=e>110?110:e,e=0>e?0:e,t.selectedBrush=2+t.MAX_BRUSH*e/110,s.css({left:e})}var t=this,n=!1,i=0,s=this.$lineSet.find(".circle");s.mousedown(function(){n=!0}),$(document).mousemove(function(s){n&&(i=s.pageX-t.$lineSet.find(".slidebar").offset().left,e(i))}).mouseup(function(){n=!1}),this.$lineSet.find(".subtractBtn").click(function(){i-=10,e(i)}),this.$lineSet.find(".plusBtn").click(function(){i+=10,e(i)})},addEventListener:function(e,t,n){drawsomething.view.event.AppEvents.addEventListener(this.container,e,t,n)},createEvent:function(e){return drawsomething.view.event.AppEvents.createEvent(e)},dispatchEvent:function(e){drawsomething.view.event.AppEvents.dispatchEvent(this.container,e)},dispatchMsg:function(){var e=this.$container.find(".msgIpt").val(),t=this.createEvent(drawsomething.view.event.AppEvents.SEND_MSG);t.msg={text:e},this.dispatchEvent(t),this.$container.find(".msgIpt").val("")},dispatchDelete:function(){this.stage.clear(),this.drawingCanvas.cache(0,0,900,600),this.sendPosArray.push({type:2,drawInfo:null})},handleMouseDown:function(e){e.oldPt=new createjs.Point(e.stage.mouseX,e.stage.mouseY),e.oldMidPt=e.oldPt,e.isDrawing=!0,e.stage.addEventListener("stagemousemove",function(){e.handleMouseMove(e)})},handleMouseUp:function(e){e.isDrawing=!1,e.stage.removeEventListener("stagemousemove",function(){e.handleMouseMove(e)})},handleMouseMove:function(e){if(e.isDrawer&&e.isDrawing){var t=new createjs.Point(e.oldPt.x+e.stage.mouseX>>1,e.oldPt.y+e.stage.mouseY>>1),n=e.colors[e.selectedColor],i=e.selectedBrush;e.drawingCanvas.graphics.setStrokeStyle(i,"round","round").beginStroke(n).moveTo(t.x,t.y).curveTo(e.oldPt.x,e.oldPt.y,e.oldMidPt.x,e.oldMidPt.y),e.drawingCanvas.updateCache(2==e.type?"destination-out":"source-over"),e.drawingCanvas.graphics.clear();var s={brush:i,color:n,mtx:t.x,mty:t.y,ctOldx:e.oldPt.x,ctOldy:e.oldPt.y,ctOldMidx:e.oldMidPt.x,ctOldMidy:e.oldMidPt.y,type:e.type};e.oldPt.x=e.stage.mouseX,e.oldPt.y=e.stage.mouseY,e.oldMidPt.x=t.x,e.oldMidPt.y=t.y,e.stage.update(),e.sendPosArray.push({type:1,drawInfo:s})}},drawingHandle:function(e){if(!this.isDrawer){var t=e.drawInfo;1==e.type?(this.drawingCanvas.graphics.setStrokeStyle(t.brush,"round","round").beginStroke(t.color).moveTo(t.mtx,t.mty).curveTo(t.ctOldx,t.ctOldy,t.ctOldMidx,t.ctOldMidy),this.drawingCanvas.updateCache(2==t.type?"destination-out":"source-over"),this.drawingCanvas.graphics.clear(),this.stage.update()):2==e.type&&(this.stage.clear(),this.drawingCanvas.cache(0,0,900,600))}},dispatchDrawing:function(e){var t=this.createEvent(drawsomething.view.event.AppEvents.DRAWING);t.msg=e,this.dispatchEvent(t)},roundStart:function(e){var t=e.gameInfo,n=e.avatarId;n==t.drawerId?(this.$container.find(".colorDisc").show(),this.$container.find(".tools").show(),this.$container.find(".iptCnt").hide(),this.isDrawer=!0):(this.$container.find(".colorDisc").hide(),this.$container.find(".tools").hide(),this.$container.find(".iptCnt").show(),this.isDrawer=!1);var i=$("#drawingPlayerItem-template").html(),s=Handlebars.compile(i),o=s({rolesList:e.roominfo.members});this.$container.find(".members").html(o);var a=this.getMember(e.roominfo.members,t.drawerId);a&&this.$container.find(".drawerName").html(a.name),this.stage.clear(),this.drawingCanvas.cache(0,0,900,600),this.$container.find(".item[data-avatarId="+t.drawerId+"]").addClass("active")},getMember:function(e,t){for(var n=0;n<e.length;n++)if(e[n].avatarId==t)return e[n];return null},updateAnswerInfo:function(e){this.$container.find(".answerTxt").html("\u4f5c\u54c1\uff1a"+e.answer)},receiveMsg:function(e){var t,n=this;e.isCorrect?(t='<p><span class="u-name">'+e.avatarName+"\uff1a</span>\u221a</p>",this.countDown-=5,this.countDown=this.countDown>0?this.countDown:0):t='<p><span class="u-name">'+e.avatarName+"\uff1a</span>"+e.answer+"</p>",this.$container.find(".chatBox").find(".content").append(t),setTimeout(function(){n.paneApi.scrollToBottom()},0)},receiveScores:function(e){var t=e.members,n=e.scores;for(var i in n){var s=i;this.getMember(t,s).localScore=n[i]}var o=$("#drawingPlayerItem-template").html(),a=Handlebars.compile(o),r=a({rolesList:t});this.$container.find(".members").html(r);var c,d=0;this.$container.find(".item").each(function(){$(this).attr("data-localScore")>d&&(d=$(this).attr("data-localScore"),c=$(this))}),this.$container.find(".icon").removeClass("active"),c.find(".icon").addClass("active")},receiveLikeInfo:function(e){this.$endPop.find(".zanBtn").html("("+e.like+")"),this.$endPop.find(".caiBtn").html("("+e.unlike+")")},receiveHint:function(e){1==e.type?this.$container.find(".hint1").html("\u63d0\u793a1\uff1a<span>"+e.hint+"</span>"):this.$container.find(".hint2").html("\u63d0\u793a2\uff1a<span>"+e.hint+"\u4e2a\u5b57</span>")},roundOver:function(e){function t(){s--,i.$endPop.find(".timeTips").html(s+"\u79d2\u540e\u81ea\u52a8\u5173\u95ed"),s>0?setTimeout(t,1e3):(i.$endPop.hide(),i.$container.find(".mask").hide())}this.isDrawer=!1;var n=this.stage.toDataURL();this.$endPop.find("img").attr("src",n);var i=this;this.$endPop.show(),this.$container.find(".mask").show(),this.$endPop.find(".title").html("\u7b54\u6848\uff1a"+e.answer);var s=6;t()},updateCountDown:function(e){this.$container.find(".roundCountDown").find(".num").html(e)},startCountdown:function(){function e(t){t.countDown--,t.countDown>0?(t.$container.find(".roundCountDown").html(t.countDown+"\u79d2"),setTimeout(function(){e(t)},1e3)):t.$container.find(".roundCountDown").html("\u6b64\u8f6e\u7ed3\u675f")}this.countDown=60,e(this)},sendLike:function(){var e=this.createEvent(drawsomething.view.event.AppEvents.LIKE);e.msg={},this.dispatchEvent(e)},sendUnlike:function(){var e=this.createEvent(drawsomething.view.event.AppEvents.UNLIKE);e.msg={},this.dispatchEvent(e)},show:function(){this.$container.show()},hide:function(){this.$container.hide()}},{NAME:"DrawPanel"});