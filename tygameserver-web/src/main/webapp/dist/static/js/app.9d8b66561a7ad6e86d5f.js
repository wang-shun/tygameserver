webpackJsonp([1,0],[function(t,e,a){"use strict";function s(t){return t&&t.__esModule?t:{default:t}}var o=a(34),n=s(o),r=a(19),i=(s(r),a(33)),l=s(i),d=a(20),c=s(d),u=a(21),h=s(u),m=a(24),p=s(m),f=a(23),v=s(f),_=a(22),g=s(_),y=a(1),C=s(y);n.default.use(l.default);var b=[{path:"/",component:c.default},{path:"/create",component:h.default},{path:"/room",component:v.default},{path:"/draw",component:g.default}],w=new l.default({routes:b});C.default.router=w,C.default.rootVue=new n.default({el:"#app",router:w,template:"<Root/>",components:{Root:p.default}}),console.log(C.default.rootVue)},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={rootVue:null,connectData:null,socket:null,router:null,roomId:0,avatarId:0,player:{roleName:""},count:0,ownerName:"",state:0,maxSize:0,members:{},groupmsgs:[],painterId:0,border:null,hint:{hint1:"",hint2:""},answerList:[],connectSocket:function(t){var e=this;this.connectData=t,this.socket=new WebSocket("ws://"+this.connectData.ip+":"+this.connectData.port+"/websocket"),this.socket.onopen=function(t){console.log("Client open a message",t.data),e.router.push("create")},this.socket.onmessage=function(a){if(console.log("Client received a message",a.data),t=JSON.parse(a.data),1==t.content.code){if("/room/create"==t.rpcMethodName.toLowerCase()&&(console.log(t.content.payload),e.roomId=t.content.payload,e.router.push("room")),"/room/join"==t.rpcMethodName.toLowerCase()&&(console.log(t.content.payload),e.roomId=t.content.payload,e.router.push("room")),"/room/info"==t.rpcMethodName.toLowerCase()&&console.log(t.content.payload),"/room/broadcast/roominfo"==t.rpcMethodName.toLowerCase()&&(console.log(t.content.payload),e.ownerName=t.content.payload.ownerName,e.members=t.content.payload.members),"/avatar/ready"==t.rpcMethodName.toLowerCase()&&(e.state=1),"/room/chat"==t.rpcMethodName.toLowerCase()&&(console.log(t.content.payload),e.groupmsgs.push({msg:t.content.payload.msg,from:t.content.source.avatarName})),"/guess/create"==t.rpcMethodName.toLowerCase(),"/room/broadcast/startgame"==t.rpcMethodName.toLowerCase()&&(e.painterId=t.content.payload,e.router.push("draw")),"/room/broadcast/drawgame"==t.rpcMethodName.toLowerCase()){var s=t.content.payload;1==s.type?e.border.drawing(s.drawInfo):2==s.type&&e.border.clear()}"/room/broadcast/drawquestion"==t.rpcMethodName.toLowerCase()&&(e.hint=t.content.payload),"/room/broadcast/answer"==t.rpcMethodName.toLowerCase()&&e.answerList.push(t.content.payload)}else console.log(t.content.payload)},this.socket.onerror=function(t){console.log("Client notified socket has error",t.data)},this.socket.onclose=function(t){console.log("Client notified socket has closed",t.data)}},createRoom:function(){console.log("createRoom");var t={rpcMethod:"/room/create",params:{gameId:this.player.gameId,maxSize:10},gameId:this.player.gameId,uuid:this.player.uuid};this.socket.send(window.JSON.stringify(t))},joinRoom:function(){console.log("joinRoom");var t={rpcMethod:"/room/join",params:{roomId:this.roomId},gameId:this.player.gameId,uuid:this.player.uuid};this.socket.send(window.JSON.stringify(t))},ready:function(){console.log("ready");var t={rpcMethod:"/avatar/ready",params:{},gameId:this.player.gameId,uuid:this.player.uuid};this.socket.send(window.JSON.stringify(t))},sendMsg:function(t){console.log("sendMsg");var t={rpcMethod:"/room/chat",params:{roomId:this.roomId,msg:t},gameId:this.player.gameId,uuid:this.player.uuid};this.socket.send(window.JSON.stringify(t))},startGame:function(){console.log("startGame");var t={rpcMethod:"/guess/create",params:{roomId:this.roomId},gameId:this.player.gameId,uuid:this.player.uuid};this.socket.send(window.JSON.stringify(t))},sendDrawingInfo:function(t){var e={rpcMethod:"/guess/draw",params:{roomId:this.roomId,content:t},gameId:this.player.gameId,uuid:this.player.uuid};this.socket.send(window.JSON.stringify(e))},sendQuestion:function(t){var e={rpcMethod:"/guess/question",params:{roomId:this.roomId,answer:t.word,hint1:t.hint1,hint2:t.hint2},gameId:this.player.gameId,uuid:this.player.uuid};this.socket.send(window.JSON.stringify(e))},sendAnswer:function(t){var e={rpcMethod:"/guess/answer",params:{roomId:this.roomId,answer:t},gameId:this.player.gameId,uuid:this.player.uuid};this.socket.send(window.JSON.stringify(e))}}},,function(t,e,a){t.exports=a.p+"static/img/header.4e46059.jpg"},function(t,e,a){"use strict";function s(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=a(25),n=(s(o),a(2)),r=s(n);a(11),e.default={name:"app",data:function(){return{roomList:{},userName:"未知",signupName:"",sessionId:"未知",msgList:[],sendChatMsg:"",playerList:[],playerSelected:"",roomId:"未知",members:[],groupmsgs:[],sendPrivateMsg:"",uuid:"",roomSelected:"-1"}},components:{},created:function(){},methods:{connectSocket:function(){var t=this;r.default.getJSON("http://littlegame.tianyu.163.com/master/app?gameId=1&callback=?&uuid="+t.uuid,function(e){i=new WebSocket("ws://"+e.ip+":"+e.port+"/websocket"),i.onopen=function(t){console.log("Client open a message",t.data)},i.onmessage=function(a){console.log("Client received a message",a.data),e=JSON.parse(a.data),1==e.content.code?("/player/reg"==e.rpcMethodName.toLowerCase()&&(t.sessionId=e.content.payload.sessionId.toString(),t.userName=e.content.payload.roleName),"/player/login"==e.rpcMethodName.toLowerCase()&&(t.sessionId=e.content.payload.sessionId,t.userName=e.content.payload.roleName),"/player/chat"==e.rpcMethodName.toLowerCase()&&t.msgList.push(e.content.source.playerName+" "+e.content.payload.msg),"/player/list"==e.rpcMethodName.toLowerCase()&&(console.log(e.content.payload),t.playerList=e.content.payload),"/room/create"==e.rpcMethodName.toLowerCase()&&(console.log(e.content.payload),t.roomId=e.content.payload,alert("创建房间"+e.content.payload)),"/room/join"==e.rpcMethodName.toLowerCase()&&(console.log(e.content.payload),t.roomId=e.content.payload,alert("加入房间"+e.content.payload)),"/room/info"==e.rpcMethodName.toLowerCase()&&(console.log(e.content.payload),t.members=e.content.payload.members),"/room/chat"==e.rpcMethodName.toLowerCase()&&(console.log(e.content.payload),t.groupmsgs.push(e.content.payload)),"/room/list"==e.rpcMethodName.toLowerCase()&&(console.log(e.content.payload),t.roomList=e.content.payload)):(console.log(e.content.payload),alert(e.message))},i.onerror=function(t){console.log("Client notified socket has error",t.data)},i.onclose=function(t){console.log("Client notified socket has closed",t.data)}})},registerBtnHandle:function(){console.log("注册用户");var t={rpcMethod:"/player/reg",params:[this.signupName.trim(),this.uuid]};i.send(window.JSON.stringify(t))},loginBtnHandle:function(){var t={rpcMethod:"/player/login",params:[this.signupName.trim()],sessionId:(0,r.default)("#name").val().trim()};i.send(window.JSON.stringify(t))},refreshHandle:function(){var t={rpcMethod:"/player/list",sessionId:this.sessionId};i.send(window.JSON.stringify(t))},sendMsgHandle:function(){var t={rpcMethod:"/player/chat",params:[parseInt(this.playerSelected),this.sendPrivateMsg],sessionId:this.sessionId};i.send(window.JSON.stringify(t))},cBtnHandle:function(){console.log("创建房间");var t={rpcMethod:"/room/create",params:[1,10],sessionId:this.sessionId};i.send(window.JSON.stringify(t))},addRoomBtnHandle:function(){if(this.roomSelected!=-1){var t={rpcMethod:"/room/join",params:[parseInt(this.roomSelected)],sessionId:this.sessionId};i.send(window.JSON.stringify(t))}},gBtnHandle:function(){if(this.roomSelected!=-1){var t={rpcMethod:"/room/chat",params:[parseInt(this.roomSelected),this.sendChatMsg.trim()],sessionId:this.sessionId};i.send(window.JSON.stringify(t))}},roomListBtnHandle:function(){var t={rpcMethod:"/room/list",sessionId:this.sessionId};i.send(window.JSON.stringify(t))}}};var i},function(t,e,a){"use strict";function s(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=a(2),n=s(o),r=a(1),i=s(r);e.default={data:function(){return{selected:0,roomId:0,playerList:[{uuid:"10001",roleName:"wwt",avatarImg:"http://img1.360buyimg.com/cms/s244x244_jfs/t1024/361/1267066337/54518/1274eb9a/55973d01N0c07b1af.jpg",gameId:1}],player:{roleName:"",avatarImg:"",uuid:"",gameId:1}}},methods:{connectServer:function(){var t=this.player,e=this;n.default.getJSON("http://littlegame.tianyu.163.com/master/init?callback=?&uuid="+t.uuid+"&roleName="+t.roleName+"&avatarImg="+encodeURIComponent(t.avatarImg)+"&gameId="+t.gameId+"&roomId="+this.roomId,function(a){i.default.roomId=e.roomId,i.default.player=t,i.default.avatarId=a.avatarId,i.default.connectSocket(a)})}}}},function(t,e,a){"use strict";function s(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=a(1),n=s(o);e.default={data:function(){return{sData:n.default}},created:function(){n.default.socket||n.default.router.push("/")},methods:{confirmHandle:function(){0==this.sData.roomId?n.default.createRoom():n.default.joinRoom()}}}},function(t,e,a){"use strict";function s(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=a(2),n=(s(o),a(1)),r=s(n);e.default={data:function(){return{oldPt:null,oldMidPt:null,isDrawing:!1,stage:null,drawingCanvas:null,type:1,selectedColor:1,selectedBrush:1,colors:["","#000000","#b91428","#1361c1","#057e1f","#c36909","#f3de2f"],brushes:[,2,5,10,20,30],sData:r.default,answer:"",question:{word:"",hint1:"",hint2:""}}},created:function(){r.default.socket||r.default.router.push("/")},mounted:function(){this.stage=new createjs.Stage("board"),createjs.Ticker.setFPS(24),this.drawingCanvas=new createjs.Shape,this.stage.addChild(this.drawingCanvas),r.default.painterId==r.default.avatarId&&(this.stage.addEventListener("stagemousedown",this.handleMouseDown),this.stage.addEventListener("stagemouseup",this.handleMouseUp)),this.drawingCanvas.cache(0,0,900,600),r.default.border=this},methods:{handleMouseDown:function(){this.oldPt=new createjs.Point(this.stage.mouseX,this.stage.mouseY),this.oldMidPt=this.oldPt,this.isDrawing=!0,this.stage.addEventListener("stagemousemove",this.handleMouseMove)},handleMouseUp:function(){this.isDrawing=!1,this.stage.removeEventListener("stagemousemove",this.handleMouseMove)},handleMouseMove:function(){if(this.isDrawing){var t=new createjs.Point(this.oldPt.x+this.stage.mouseX>>1,this.oldPt.y+this.stage.mouseY>>1),e=this.colors[this.selectedColor],a=this.brushes[this.selectedBrush];this.drawingCanvas.graphics.setStrokeStyle(a,"round","round").beginStroke(e).moveTo(t.x,t.y).curveTo(this.oldPt.x,this.oldPt.y,this.oldMidPt.x,this.oldMidPt.y),this.drawingCanvas.updateCache(2==this.type?"destination-out":"source-over"),this.drawingCanvas.graphics.clear();var s={brush:a,color:e,mtx:t.x,mty:t.y,ctOldx:this.oldPt.x,ctOldy:this.oldPt.y,ctOldMidx:this.oldMidPt.x,ctOldMidy:this.oldMidPt.y,type:this.type};this.oldPt.x=this.stage.mouseX,this.oldPt.y=this.stage.mouseY,this.oldMidPt.x=t.x,this.oldMidPt.y=t.y,this.stage.update(),r.default.sendDrawingInfo({type:1,drawInfo:s})}},selectColor:function(t){this.selectedColor=t},selectBrush:function(t){this.selectedBrush=t},changeType:function(t){this.type=t},clearStage:function(){this.stage.clear(),this.drawingCanvas.cache(0,0,900,600),r.default.painterId==r.default.avatarId&&r.default.sendDrawingInfo({type:2})},clear:function(){r.default.painterId!=r.default.avatarId&&(this.stage.clear(),this.drawingCanvas.cache(0,0,900,600))},drawing:function(t){console.log(t),r.default.painterId!=r.default.avatarId&&(this.drawingCanvas.graphics.setStrokeStyle(t.brush,"round","round").beginStroke(t.color).moveTo(t.mtx,t.mty).curveTo(t.ctOldx,t.ctOldy,t.ctOldMidx,t.ctOldMidy),this.drawingCanvas.updateCache(2==t.type?"destination-out":"source-over"),this.drawingCanvas.graphics.clear(),this.stage.update())},sendQuestion:function(){r.default.sendQuestion(this.question)},sendAnswer:function(){r.default.sendAnswer(this.answer)}}}},function(t,e,a){"use strict";function s(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=a(1),n=s(o);e.default={data:function(){return{sData:n.default,chatMsg:""}},created:function(){n.default.socket||n.default.router.push("/")},methods:{ready:function(){n.default.ready()},sendMsg:function(){n.default.sendMsg(this.chatMsg),this.chatMsg=""},startGame:function(){n.default.startGame()}}}},function(t,e){"use strict"},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"hello",data:function(){return{msg:"Welcome to Your Vue.js App"}}}},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},,function(t,e,a){var s,o;a(12),s=a(4);var n=a(26);o=s=s||{},"object"!=typeof s.default&&"function"!=typeof s.default||(o=s=s.default),"function"==typeof o&&(o=o.options),o.render=n.render,o.staticRenderFns=n.staticRenderFns,o._scopeId="data-v-2fe46973",t.exports=s},function(t,e,a){var s,o;a(14),s=a(5);var n=a(28);o=s=s||{},"object"!=typeof s.default&&"function"!=typeof s.default||(o=s=s.default),"function"==typeof o&&(o=o.options),o.render=n.render,o.staticRenderFns=n.staticRenderFns,o._scopeId="data-v-5ff0a288",t.exports=s},function(t,e,a){var s,o;a(15),s=a(6);var n=a(29);o=s=s||{},"object"!=typeof s.default&&"function"!=typeof s.default||(o=s=s.default),"function"==typeof o&&(o=o.options),o.render=n.render,o.staticRenderFns=n.staticRenderFns,o._scopeId="data-v-65757e1a",t.exports=s},function(t,e,a){var s,o;a(13),s=a(7);var n=a(27);o=s=s||{},"object"!=typeof s.default&&"function"!=typeof s.default||(o=s=s.default),"function"==typeof o&&(o=o.options),o.render=n.render,o.staticRenderFns=n.staticRenderFns,o._scopeId="data-v-58640fe2",t.exports=s},function(t,e,a){var s,o;a(17),s=a(8);var n=a(31);o=s=s||{},"object"!=typeof s.default&&"function"!=typeof s.default||(o=s=s.default),"function"==typeof o&&(o=o.options),o.render=n.render,o.staticRenderFns=n.staticRenderFns,o._scopeId="data-v-7f58bff9",t.exports=s},function(t,e,a){var s,o;s=a(9);var n=a(32);o=s=s||{},"object"!=typeof s.default&&"function"!=typeof s.default||(o=s=s.default),"function"==typeof o&&(o=o.options),o.render=n.render,o.staticRenderFns=n.staticRenderFns,t.exports=s},function(t,e,a){var s,o;a(16),s=a(10);var n=a(30);o=s=s||{},"object"!=typeof s.default&&"function"!=typeof s.default||(o=s=s.default),"function"==typeof o&&(o=o.options),o.render=n.render,o.staticRenderFns=n.staticRenderFns,o._scopeId="data-v-697e5dea",t.exports=s},function(t,e){t.exports={render:function(){var t=this;return t._h("div",{attrs:{id:"app"}},[t._h("router-view")," ",t._h("div",{staticClass:"container"},[t._m(0)," ",t._h("div",{staticClass:"form-inline row"},[t._h("div",{staticClass:"form-group col-md-2"},[t._m(1)," ",t._h("label",{attrs:{id:"name2"}},[t._s(t.userName)])])," ",t._h("div",{staticClass:"form-group  col-md-2"},[t._m(2)," ",t._h("label",{attrs:{id:"sId"}},[t._s(t.sessionId)])])," ",t._h("div",{staticClass:"form-group  col-md-2"},[t._m(3)," ",t._h("label",{attrs:{id:"roomId"}},[t._s(t.roomId)])])])," ",t._h("div",{staticClass:"form-inline"},[t._h("div",{staticClass:"form-group   col-md-4"},[t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.uuid,expression:"uuid"}],staticClass:"form-control",attrs:{id:"uuid",type:"text",placeholder:"UUID"},domProps:{value:t._s(t.uuid)},on:{input:function(e){e.target.composing||(t.uuid=e.target.value)}}})," ",t._h("button",{staticClass:"btn btn-primary",attrs:{id:"loadBtn"},on:{click:t.connectSocket}},["UUID"])])," ",t._h("div",{staticClass:"form-group"},[t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.signupName,expression:"signupName"}],staticClass:"form-control",attrs:{id:"name",type:"text"},domProps:{value:t._s(t.signupName)},on:{input:function(e){e.target.composing||(t.signupName=e.target.value)}}})," ",t._h("button",{staticClass:"btn btn-primary",attrs:{id:"registerBtn"},on:{click:t.registerBtnHandle}},["注册"])," ",t._h("button",{staticClass:"btn btn-primary",attrs:{id:"loginBtn"},on:{click:t.loginBtnHandle}},["登陆"])," ",t._h("button",{staticClass:"btn btn-primary",attrs:{id:"cBtn"},on:{click:t.cBtnHandle}},["创建房间"])])])," ",t._h("div",{staticClass:"form-inline"},[t._h("div",{staticClass:"form-group"},[t._h("select",{directives:[{name:"model",rawName:"v-model",value:t.roomSelected,expression:"roomSelected"}],attrs:{id:"roomList"},on:{change:function(e){t.roomSelected=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){var e="_value"in t?t._value:t.value;return e})[0]}}},[t._m(4)," ",t._l(t.roomList,function(e){return t._h("option",{domProps:{value:e.id}},[t._s(e.id)])})])," ",t._h("button",{staticClass:"btn btn-primary",attrs:{id:"addRoomBtn"},on:{click:t.addRoomBtnHandle}},["加入"])," ",t._h("button",{staticClass:"btn btn-primary",attrs:{id:"roomListBtn"},on:{click:t.roomListBtnHandle}},["刷新"])])])," ",t._h("div",{staticClass:"row"},[t._h("div",{staticClass:"col-md-2"},[t._m(5)," ",t._h("table",{staticClass:"table"},[t._m(6)," ",t._h("tbody",[t._l(t.members,function(e){return t._h("tr",[t._h("th",[t._s(e.name)])])})])])])," "," "," ",t._h("div",{staticClass:"col-md-10"},[t._m(7)," ",t._h("div",{staticClass:"chatCnt"},[t._h("ul",[t._l(t.groupmsgs,function(e){return t._h("li",[t._s(e.msg)])})])])," ",t._h("div",{staticClass:"row"},[t._h("div",{staticClass:"col-md-10"},[t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.sendChatMsg,expression:"sendChatMsg"}],staticClass:"form-control",attrs:{id:"groupMsg",type:"text",placeholder:"发送消息"},domProps:{value:t._s(t.sendChatMsg)},on:{input:function(e){e.target.composing||(t.sendChatMsg=e.target.value)}}})])," ",t._h("div",{staticClass:"col-md-2 sendBtnCnt"},[t._h("button",{staticClass:"btn btn-primary sendBtn",attrs:{id:"gBtn"},on:{click:t.gBtnHandle}},["发送消息"])])])])," "])," "," ",t._h("div",[t._m(8)," ",t._h("div",{staticClass:"msgCnt"},[t._h("ul",[t._l(t.msgList,function(e){return t._h("li",[t._s(e)])})])])])," "," ",t._h("div",[t._h("div",{staticClass:"row"},[t._h("div",{staticClass:"col-md-2"},[t._h("select",{directives:[{name:"model",rawName:"v-model",value:t.playerSelected,expression:"playerSelected"}],attrs:{id:"playerList"},on:{change:function(e){t.playerSelected=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){var e="_value"in t?t._value:t.value;return e})[0]}}},[t._l(t.playerList,function(e){return t._h("option",{domProps:{value:e.id}},[t._s(e.name)])})])," ",t._h("button",{staticClass:"btn btn-primary",attrs:{id:"refresh"},on:{click:t.refreshHandle}},["刷新"])])," ",t._h("div",{staticClass:"col-md-10"},[t._h("div",{staticClass:"col-md-8"},[t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.sendPrivateMsg,expression:"sendPrivateMsg"}],staticClass:"form-control",attrs:{id:"msg",type:"text"},domProps:{value:t._s(t.sendPrivateMsg)},on:{input:function(e){e.target.composing||(t.sendPrivateMsg=e.target.value)}}})])," ",t._h("div",[t._h("button",{staticClass:"btn btn-primary col-md-4",attrs:{id:"sendMsg"},on:{click:t.sendMsgHandle}},["发送消息"])])])])])])])},staticRenderFns:[function(){var t=this;return t._h("h1",["littlegame"])},function(){var t=this;return t._h("label",["用户名:"])},function(){var t=this;return t._h("label",["sessionId:"])},function(){var t=this;return t._h("label",["房号:"])},function(){var t=this;return t._h("option",{attrs:{value:"-1"}},["请选择房间"])},function(){var t=this;return t._h("h2",["成员列表"])},function(){var t=this;return t._h("thead",[t._h("tr",[t._h("th",["成员列表"])])])},function(){var t=this;return t._h("h2",["群聊"])},function(){var t=this;return t._h("h2",["消息列表"])}]}},function(t,e,a){t.exports={render:function(){var t=this;return t._h("div",[t._m(0)," ",t._h("div",{staticClass:"toolsCnt"},[t.sData.painterId!=t.sData.avatarId?t._h("div",{staticClass:"form-inline hint"},[t._m(1)," ",t._h("label",[t._s(t.sData.hint.hint1)])," ",t._m(2)," ",t._h("label",[t._s(t.sData.hint.hint2)])]):t._e()," ",t.sData.painterId==t.sData.avatarId?t._h("div",{staticClass:"form-inline hint"},[t._m(3)," ",t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.question.word,expression:"question.word"}],staticClass:"form-control",attrs:{type:"text",placeholder:"请输入名称"},domProps:{value:t._s(t.question.word)},on:{input:function(e){e.target.composing||(t.question.word=e.target.value)}}})," ",t._m(4)," ",t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.question.hint1,expression:"question.hint1"}],staticClass:"form-control",attrs:{type:"text",placeholder:"提示一"},domProps:{value:t._s(t.question.hint1)},on:{input:function(e){e.target.composing||(t.question.hint1=e.target.value)}}})," ",t._m(5)," ",t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.question.hint2,expression:"question.hint2"}],staticClass:"form-control",attrs:{type:"text",placeholder:"提示二"},domProps:{value:t._s(t.question.hint2)},on:{input:function(e){e.target.composing||(t.question.hint2=e.target.value)}}})," ",t._h("button",{staticClass:"btn btn-default",on:{click:t.sendQuestion}},["提交"])]):t._e()," ",t.sData.painterId==t.sData.avatarId?t._h("div",{staticClass:"panel panel-default"},[t._m(6)," ",t._h("div",{staticClass:"panel-body"},[t._h("div",{staticClass:"colorCnt"},[t._m(7)," ",t._h("div",{staticClass:"color"},[t._l(6,function(e){return t._h("span",{class:"color-"+e+" "+(e==t.selectedColor?"active":""),on:{click:function(a){t.selectColor(e)}}})})])])," ",t._h("div",{staticClass:"brushCnt"},[t._m(8)," ",t._h("div",{staticClass:"brush"},[t._l(5,function(e){return t._h("span",{class:"brush-"+e+" "+(e==t.selectedBrush?"active":""),on:{click:function(a){t.selectBrush(e)}}})})])])," ",t._h("div",{staticClass:"typeCnt"},[t._h("a",{staticClass:"btn btn-default",class:1==t.type?"active":"",attrs:{role:"button"},on:{click:function(e){t.changeType(1)}}},["笔刷"])," ",t._h("a",{staticClass:"btn btn-default",class:2==t.type?"active":"",attrs:{role:"button"},on:{click:function(e){t.changeType(2)}}},["橡皮"])," ",t._h("a",{staticClass:"btn btn-default",attrs:{role:"button"},on:{click:t.clearStage}},["清空画板"])])])]):t._e()])," ",t._h("div",{staticClass:"answerCnt"},[t._l(t.sData.answerList,function(e){return t._h("p",{staticClass:"answer"},["\n            "+t._s(e.answer)+"\n        "])})])," ",t._h("div",{staticClass:"sendAnswerCnt"},[t._h("div",{staticClass:"row"},[t._h("div",{staticClass:"col-md-8"},[t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.answer,expression:"answer"}],staticClass:"form-control",attrs:{type:"text",placeholder:"输入名称"},domProps:{value:t._s(t.answer)},on:{input:function(e){e.target.composing||(t.answer=e.target.value)}}})])," ",t._h("button",{staticClass:"btn btn-default",on:{click:t.sendAnswer}},["回答"])])])," ",t._h("div",{staticClass:"members"},[t._l(t.sData.members,function(e){return t._h("div",{staticClass:"member"},[t._m(9,!0)," ",t._h("span",{staticClass:"label label-success"},[t._s(e.name)])," ",e.avatarId==t.sData.ownerName?t._h("span",{staticClass:"label label-danger"},["房主"]):t._e()])})])])},staticRenderFns:[function(){var t=this;return t._h("div",{staticClass:"cnt"},[t._h("canvas",{attrs:{id:"board",width:"900",height:"600"}})])},function(){var t=this;return t._h("label",["提示一："])},function(){var t=this;return t._h("label",["提示二:"])},function(){var t=this;return t._h("label",["名称："])},function(){var t=this;return t._h("label",["提示一："])},function(){var t=this;return t._h("label",["提示二"])},function(){var t=this;return t._h("div",{staticClass:"panel-heading"},[t._h("h3",{staticClass:"panel-title"},["工具栏"])])},function(){var t=this;return t._h("span",{staticClass:"txt"},["颜色："])},function(){var t=this;return t._h("span",{staticClass:"txt"},["笔刷："])},function(){var t=this;return t._h("img",{staticClass:"headImg",attrs:{width:"40",heigth:"40",src:a(3)}})}]}},function(t,e){t.exports={render:function(){var t=this;return t._h("div",[t._h("div",{staticClass:"panel panel-default"},[t._m(0)," ",t._h("div",{staticClass:"panel-body"},[t._h("div",{staticClass:"form-horizontal"},[t._h("div",{staticClass:"form-group"},[t._m(1)," ",t._h("div",{staticClass:"col-md-10"},[t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.player.roleName,expression:"player.roleName"}],staticClass:"form-control",attrs:{type:"text"},domProps:{value:t._s(t.player.roleName)},on:{input:function(e){e.target.composing||(t.player.roleName=e.target.value)}}})])])," ",t._h("div",{staticClass:"form-group"},[t._m(2)," ",t._h("div",{staticClass:"col-md-10"},[t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.player.uuid,expression:"player.uuid"}],staticClass:"form-control",attrs:{type:"text"},domProps:{value:t._s(t.player.uuid)},on:{input:function(e){e.target.composing||(t.player.uuid=e.target.value)}}})])])," ",t._h("div",{staticClass:"form-group"},[t._m(3)," ",t._h("div",{staticClass:"col-md-10"},[t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.player.avatarImg,expression:"player.avatarImg"}],staticClass:"form-control",attrs:{type:"text"},domProps:{value:t._s(t.player.avatarImg)},on:{input:function(e){e.target.composing||(t.player.avatarImg=e.target.value)}}})])])," ",t._h("div",{staticClass:"form-group"},[t._m(4)," ",t._h("div",{staticClass:"col-sm-10"},[t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.roomId,expression:"roomId"}],staticClass:"form-control",attrs:{type:"text"},domProps:{value:t._s(t.roomId)},on:{input:function(e){e.target.composing||(t.roomId=e.target.value)}}})])])," ",t._h("div",{staticClass:"btncnt form-inline"},[t._h("button",{staticClass:"btn btn-success",on:{click:t.connectServer}},["连接服务器"])])])])])])},staticRenderFns:[function(){var t=this;return t._h("div",{staticClass:"panel-heading"},[t._h("h3",{staticClass:"panel-title"},["连接服务器"])])},function(){var t=this;return t._h("label",{staticClass:"col-md-2 control-label"},["玩家名字"])},function(){var t=this;return t._h("label",{staticClass:"col-md-2 control-label"},["uuid"])},function(){var t=this;return t._h("label",{staticClass:"col-md-2 control-label"},["头像"])},function(){var t=this;return t._h("label",{staticClass:"col-sm-2 control-label",attrs:{for:"inputPassword3"}},["房间号"])}]}},function(t,e){t.exports={render:function(){var t=this;return t._h("div",[t._h("div",{staticClass:"panel panel-default"},[t._m(0)," ",t._h("div",{staticClass:"panel-body"},[t._h("div",{staticClass:"t"},[0==t.sData.roomId?t._h("p",["是否要创建房间"]):t._e()," ",0!=t.sData.roomId?t._h("p",["是否要加入房间"+t._s(t.sData.roomId)]):t._e()])," ",t._h("div",{staticClass:"btncnt form-inline"},[t._h("button",{staticClass:"btn btn-success",on:{click:t.confirmHandle}},["确认"])])])])])},staticRenderFns:[function(){var t=this;return t._h("div",{staticClass:"panel-heading"},[t._h("h3",{staticClass:"panel-title"},["连接服务器"])])}]}},function(t,e){t.exports={render:function(){var t=this;return t._h("div",{staticClass:"hello"},[t._h("h1",[t._s(t.msg)])," ",t._m(0)," ",t._m(1)," ",t._m(2)," ",t._m(3)])},staticRenderFns:[function(){var t=this;return t._h("h2",["Essential Links"])},function(){var t=this;return t._h("ul",[t._h("li",[t._h("a",{attrs:{href:"https://vuejs.org",target:"_blank"}},["Core Docs"])])," ",t._h("li",[t._h("a",{attrs:{href:"https://forum.vuejs.org",target:"_blank"}},["Forum"])])," ",t._h("li",[t._h("a",{attrs:{href:"https://gitter.im/vuejs/vue",target:"_blank"}},["Gitter Chat"])])," ",t._h("li",[t._h("a",{attrs:{href:"https://twitter.com/vuejs",target:"_blank"}},["Twitter"])])," ",t._h("br")," ",t._h("li",[t._h("a",{attrs:{href:"http://vuejs-templates.github.io/webpack/",target:"_blank"}},["Docs for This Template"])])])},function(){var t=this;return t._h("h2",["Ecosystem"])},function(){var t=this;return t._h("ul",[t._h("li",[t._h("a",{attrs:{href:"http://router.vuejs.org/",target:"_blank"}},["vue-router"])])," ",t._h("li",[t._h("a",{attrs:{href:"http://vuex.vuejs.org/",target:"_blank"}},["vuex"])])," ",t._h("li",[t._h("a",{attrs:{href:"http://vue-loader.vuejs.org/",target:"_blank"}},["vue-loader"])])," ",t._h("li",[t._h("a",{attrs:{href:"https://github.com/vuejs/awesome-vue",target:"_blank"}},["awesome-vue"])])])}]}},function(t,e,a){t.exports={render:function(){var t=this;return t._h("div",[t._h("h1",["天谕你画我猜("+t._s(t.sData.roomId)+")"])," ",t._h("div",{staticClass:"container"},[t._h("div",{staticClass:"cnt row"},[t._l(t.sData.members,function(e,a){return t._h("div",{staticClass:"item col-md-3"},[t._m(0,!0)," ",t._h("button",{staticClass:"btn btn-default readyBtn"},[t._s(1==e.state?"已准备":"准备")])," ",t._h("div",{staticClass:"txtCnt"},[e.avatarId==t.sData.ownerName?t._h("span",{staticClass:"label label-info"},["房主"]):t._e()," ",t._h("label",["昵称："+t._s(e.name)])," "])])})])," ",t._h("div",{staticClass:"btnCnt"},[t.sData.avatarId==t.sData.ownerName?t._h("button",{staticClass:"btn btn-default btn-lg",on:{click:t.startGame}},["游戏开启"]):t._e()," ",t.sData.avatarId!=t.sData.ownerName&&0==t.sData.state?t._h("button",{staticClass:"btn btn-default btn-lg",on:{click:t.ready}},["准备"]):t._e()," ",t.sData.avatarId!=t.sData.ownerName&&1==t.sData.state?t._h("button",{staticClass:"btn btn-default btn-lg"},["已准备"]):t._e()])," ",t._h("div",{staticClass:"chatCnt row"},[t._h("div",{staticClass:"col-md-8"},[t._h("div",{staticClass:"msgCnt"},[t._l(t.sData.groupmsgs,function(e){return t._h("p",{staticClass:"line"},[t._h("span",[t._s(e.from)+"："]),t._h("span",{staticClass:"label label-info"},[t._s(e.msg)])])})])," ",t._h("div",{staticClass:"row"},[t._h("div",{staticClass:"col-md-10"},[t._h("input",{directives:[{name:"model",rawName:"v-model",value:t.chatMsg,expression:"chatMsg"}],staticClass:"form-control",attrs:{type:"text",placeholder:"请输入文字"},domProps:{value:t._s(t.chatMsg)},on:{input:function(e){e.target.composing||(t.chatMsg=e.target.value)}}})])," ",t._h("div",{staticClass:"col-md-2"},[t._h("button",{staticClass:"btn btn-success",on:{click:t.sendMsg}},["发送"])])])])," ",t._m(1)])])])},staticRenderFns:[function(){var t=this;return t._h("img",{staticClass:"img-rounded",attrs:{src:a(3)}})},function(){var t=this;return t._h("div",{staticClass:"col-md-4"},[t._h("div",{staticClass:"playerList"})])}]}},function(t,e){t.exports={render:function(){var t=this;return t._h("div",[t._h("router-view")])},staticRenderFns:[]}}]);
//# sourceMappingURL=app.9d8b66561a7ad6e86d5f.js.map