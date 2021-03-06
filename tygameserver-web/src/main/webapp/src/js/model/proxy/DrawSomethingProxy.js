puremvc.define({
		name:'drawsomething.model.proxy.DrawSomethingProxy',
		parent:puremvc.Proxy
	},
	{	
		SYSTEM:0,
		GUESS:1,//你画我猜ID
		rolesList:[],//游戏角色列表
		gbId:'',//选择角色gbId
		roleName:'',//角色昵称
		avatarImg:'',
		socket:null,
		connectData:null,
		roomId:0,//房间号
		roominfo:null,
		avatarId:0,//我是谁
		gameInfo:null,
		player:{
			roleName:''
		},
		count:0,
		ownerName:'',
		hint:{
			hint1:'',
			hint2:''
		},
		questions:[],
		answerList:[],
		answerInfo:null,//答案
		gameState:0,
		selfName:'',
		likeCount:0,
		unlikeCount:0,
		token:"",
		host:'http://littlegame.tianyu.163.com:8090',
		onRegister:function(){
			this.getLoginStatus();
		},
		getRoleList:function(){
			var _this=this;
			$.getJSON(this.host+"/master/avatar/roles?callback=?&moduleId="+this.GUESS,function(msg){
				if(msg.code==1){
					_this.rolesList=[];
					for(var i in msg.payload) {
				        var serverName=i;
				        for(var j in msg.payload[i]){
				        	var info=msg.payload[i][j];
				        	_this.rolesList.push({
				        		serverName:serverName,
				        		gbId:info.gbId,
				        		playerName:info.playerName,
				        		school:info.school,
				        		level:info.level
				        	})
				        }
				    }

				}
				_this.sendNotification(drawsomething.AppConstants.GET_ROLELIST_SUCCESS,{rolesList:_this.rolesList})
				if(_this.rolesList.length==0){
					_this.sendNotification(drawsomething.AppConstants.SHOW_ALERT,{txt:"你还没有天谕游戏角色？创建一个角色就可以玩你画我猜啦",code:0});
				}
			})
		},
		getConnectData:function(){
			var _this=this;
			$.getJSON(this.host+"/master/init?callback=?&uuid="+encodeURIComponent(this.gbId)+"&roleName="+encodeURIComponent(this.roleName)+"&avatarImg="+encodeURIComponent(this.avatarImg)+"&moduleId="+this.GUESS+"&roomId="+this.roomId, function(msg){
                _this.token=msg.payload.token;
                _this.connectSocket(msg.payload);
                _this.avatarId=msg.payload.avatarId;
                
            })
		},
		getLoginStatus:function(){
			var _this=this;			
			$.getJSON(this.host+"/master/isLogin?callback=?&moduleId="+this.GUESS,function(msg){
				if(msg.code==1){
					_this.sendNotification(drawsomething.AppConstants.URS_LOGIN_SUCCESS,{});
				}else{
					_this.sendNotification(drawsomething.AppConstants.URS_UNLOGIN,{});
				}
			})
		},
		roleConfirm:function(data){
			this.gbId=data.gbId;
			this.roleName=data.roleName;
		},
		setRoomId:function(data){
			this.roomId=data.roomId;
			if(this.socket==null){
				this.getConnectData();
			}
			
		},
		connectSocket:function(data){
			var _this=this;
			this.connectData=data;
			this.socket=new WebSocket('ws://'+this.connectData.ip+':'+this.connectData.port+'/ws?token='+_this.token);
			this.socket.onopen=function(event){
				console.log("Client open a message",event.data);
				if(_this.roomId==0){
					_this.createRoom();
				}else{
					_this.joinRoom();
				}
			}

			this.socket.onmessage=function(event){
				data=JSON.parse(event.data);

				if(data.rpcMethod.toLowerCase()!="/room/broadcast/drawgame"&&data.rpcMethod.toLowerCase()!="/room/broadcast/guess/countdown"){
					console.log("Client received a message",event.data);
				}				

				if(data.content.code==1){
					if(data.rpcMethod.toLowerCase() == "/room/create"){
	                    _this.roomId=data.content.payload;			
	                }

	                if(data.rpcMethod.toLowerCase() == "/room/join"){
	                    _this.roominfo=data.content.payload;
	                    _this.sendNotification(drawsomething.AppConstants.BROADCAST_ROOMINFO,{info:data.content.payload,roominfo:_this.roominfo,avatarId:_this.avatarId});
	                }

	                if(data.rpcMethod.toLowerCase() == "/room/info"){

	                }

	                if(data.rpcMethod.toLowerCase() == "/room/broadcast/info"){
	                    _this.ownerName = data.content.payload.ownerName;
	                    _this.members = data.content.payload.members;
	                    _this.roominfo=data.content.payload;
	                    _this.sendNotification(drawsomething.AppConstants.BROADCAST_ROOMINFO,{info:data.content.payload,roominfo:_this.roominfo,avatarId:_this.avatarId});
	                }

	                if(data.rpcMethod.toLowerCase() == "/room/broadcast/join"){
                  		if(data.content.payload.avatar.avatarId==_this.avatarId){
                  			//加入房间的玩家自己的join信息不处理，包含在roominfo里面了
                  			return;
                  		}
                  		var position=data.content.payload.position;
                  		_this.roominfo.members[position]=data.content.payload.avatar
                  		_this.sendNotification(drawsomething.AppConstants.BROADCAST_JOIN,{member:data.content.payload,roominfo:_this.roominfo,avatarId:_this.avatarId});
	                }

	                if(data.rpcMethod.toLowerCase() == "/room/broadcast/ready"){
	                	_this.sendNotification(drawsomething.AppConstants.BROADCAST_READY,{
	                		info:data.content.payload
	                	})
                  		console.log(data.content.payload);	
	                }

	                // if(data.rpcMethod.toLowerCase() == "/room/broadcast/remove"){
                 //  		console.log(data.content.payload);	
	                // }
	                
	                //开启游戏
	                if(data.rpcMethod.toLowerCase() == "/room/broadcast/guess/start"){
	                	console.log(data.content.payload);	
	                	_this.gameInfo=data.content.payload;    
	                	_this.sendNotification(drawsomething.AppConstants.GAME_STARTING,{
	                		gameInfo:_this.gameInfo,avatarId:_this.avatarId,roominfo:_this.roominfo
	                	})
	                }

	                //问题答案
	                if(data.rpcMethod.toLowerCase() == "/room/private/guess/quesion"){
	                	console.log(data.content.payload);	
	                	_this.answerInfo=data.content.payload;
	                	_this.sendNotification(drawsomething.AppConstants.ANSWER_INFO,data.content.payload);
	                }	     

	                // 被房主踢出去
	                if(data.rpcMethod.toLowerCase() == "/room/private/remove"){
	                	_this.sendNotification(drawsomething.AppConstants.SHOW_ALERT,{code:1,txt:"你被房主请出了房间，去其他房间看看吧"});
	                }           

	                if(data.rpcMethod.toLowerCase() == "/avatar/ready"){
	                    self.state=1;
	                }

	                if(data.rpcMethod.toLowerCase() == "/room/chat"){
	                    self.groupmsgs.push({msg:data.content.payload.msg,from:data.content.source.avatarName});
	                }

	                if(data.rpcMethod.toLowerCase() ==  "/guess/create"){
                    
                	}

                	if(data.rpcMethod.toLowerCase() ==  "/guess/answer"){

                	}                	

                	if(data.rpcMethod.toLowerCase() == "/room/private/startgame"){
	                    self.questions = data.content.payload;
	                }

	                //踢出成员
	                if(data.rpcMethod.toLowerCase() == "/room/broadcast/remove"){
	                    var avatarId=data.content.payload;
	                    var members=_this.roominfo.members;
	                    for(var i in members){
	                    	if(avatarId==members[i].avatarId){
								delete members[i];				
							}
	                    }

	                    _this.sendNotification(drawsomething.AppConstants.RECEIVE_REMOVE_PLAYER,{avatarId:avatarId});
	                    
	                }

	                if(data.rpcMethod.toLowerCase() == "/room/broadcast/drawgame"){
	                    var info=data.content.payload;
	                    _this.sendNotification(drawsomething.AppConstants.DRAWING_HANDLE,info);
	                    
	                }

	                if(data.rpcMethod.toLowerCase() == "/room/broadcast/drawquestion"){
	                    self.hint=data.content.payload;
	                    self.gameState=data.content.payload.gameState;
	                }

	                //玩家退出
	                if(data.rpcMethod.toLowerCase() == "/room/broadcast/guess/exit"){
	                	var avatarId=data.content.payload;
	                	var members=_this.roominfo.members;
	                	var name;
	                	for(var i in members){
	                		if(avatarId==members[i].avatarId){
	                			name=members[i].name;
								delete members[i];				
							}
	                	}
	                	_this.sendNotification(drawsomething.AppConstants.RECEIVE_REMOVE_PLAYER,{avatarId:avatarId});
	                	_this.sendNotification(drawsomething.AppConstants.RECEIVE_NOTICE,name+"离开了房间");
	                }

	                //聊天消息
	                if(data.rpcMethod.toLowerCase() == "/room/broadcast/guess/answer"){
	                    // data.content.payload.name = getName(data.content.payload.avatarId);
	                    var answer=data.content.payload.fAnswer;
	                    answer.isCorrect=data.content.payload.isCorrect;
	                    _this.answerList.push(answer);
	                    _this.sendNotification(drawsomething.AppConstants.RECEIVE_MSG,answer);
	                    if(data.content.payload.info&&data.content.payload.info.scores){
	                    	_this.sendNotification(drawsomething.AppConstants.RECEIVE_SCORES,{
	                    		scores:data.content.payload.info.scores,
	                    		members:_this.roominfo.members
	                    	});
	                    }
	                    
	                }

	                //提示1
	                if(data.rpcMethod.toLowerCase()=="/room/broadcast/guess/hint1"){

	                	_this.sendNotification(drawsomething.AppConstants.RECEIVE_HINT,{type:1,hint:data.content.message});
	                }

	                //提示2
	                if(data.rpcMethod.toLowerCase()=="/room/broadcast/guess/hint2"){
	                	_this.sendNotification(drawsomething.AppConstants.RECEIVE_HINT,{type:2,hint:data.content.message});
	                }

	                if(data.rpcMethod.toLowerCase()=="/room/broadcast/guess/countdown"){
	                	var left=data.content.payload;
	                	_this.sendNotification(drawsomething.AppConstants.COUNTDOWN,left);
	                }

	                if(data.rpcMethod.toLowerCase()=="/room/broadcast/guess/incountdown"){
	                	var left=data.content.payload;
	                	_this.sendNotification(drawsomething.AppConstants.ICOUNTDOWN,left);
	                }

	                //一轮结束
	                if(data.rpcMethod.toLowerCase()=="/room/broadcast/guess/roundover"){
	                	var roundInfo=data.content.payload;	   
	                	_this.sendNotification(drawsomething.AppConstants.ROUND_OVER,roundInfo);
	                }

	                if(data.rpcMethod.toLowerCase()=="/room/broadcast/guess/like"){
	                	_this.likeCount++;
	                	_this.sendNotification(drawsomething.AppConstants.RECEIVE_LIKE_INFO,{like:_this.likeCount,unlike:_this.unlikeCount});
	                	_this.sendNotification(drawsomething.AppConstants.RECEIVE_SCORES,{
                    		scores:data.content.payload.scores,
                    		members:_this.roominfo.members
                    	});
	                }

	                if(data.rpcMethod.toLowerCase()=="/room/broadcast/guess/unlike"){
	                	_this.unlikeCount++;
	                	_this.sendNotification(drawsomething.AppConstants.RECEIVE_LIKE_INFO,{like:_this.likeCount,unlike:_this.unlikeCount});
	                }
	                
	                if(data.rpcMethod.toLowerCase()=="/room/broadcast/guess/running"){
	                	var roundInfo=data.content.payload;
	                	_this.gameInfo.drawerId=roundInfo.drawerId;
	                	_this.sendNotification(drawsomething.AppConstants.GAME_STARTING,{
	                		gameInfo:_this.gameInfo,avatarId:_this.avatarId,roominfo:_this.roominfo
	                	})
	                	_this.likeCount=0;
	                	_this.unlikeCount=0;
	                }
	                //大轮游戏结束
	                if(data.rpcMethod.toLowerCase()=="/room/broadcast/guess/gameover"){
	                	_this.sendNotification(drawsomething.AppConstants.GAME_OVER);
	                	_this.sendNotification(drawsomething.AppConstants.BROADCAST_ROOMINFO,{info:_this.roominfo,roominfo:_this.roominfo,avatarId:_this.avatarId});
	                }
	                
	                // 更换房主
	                if(data.rpcMethod.toLowerCase()=="/room/broadcast/changeowner"){
	                	var avatarId = data.content.payload;
	                	_this.roominfo.ownerId=avatarId;
	                	_this.sendNotification(drawsomething.AppConstants.CHANGE_OWNER,avatarId);             	
	                }
	                
	                if(data.rpcMethod.toLowerCase() == "/room/broadcast/correct"){
	                    var answer = data.content.payload;
	                    answer.name = getName(answer.avatarId);
	                    answer.correct = true;
	                    self.answerList.push(answer);
	                    self.border.showWinner(answer.name);
	                    // alert(answer.avatarId+"回答正确！");
	                }


				}else{
					console.log(data.content.payload);
					if(data.content.code==2){
						alert("开启游戏失败！");
						return;
					}
					if(data.content.code==3){
						alert("非法操作！");
						return;
					}
					if(data.content.code==4){
						alert("没有登录！");
						return;
					}
					if(data.content.code==10001){
						alert("已经加入房间!");
						return;
					}
					if(data.content.code==10002){
						alert("加入房间失败!");
						return;
					}
					if(data.content.code==10003){
						alert("超过房间最大人数!");
						return;
					}
					if(data.content.code==10004){
						alert("创建房间失败！");
						return;
					}
					if(data.content.code==10005){
						alert("游戏已经开始，无法删除！");
						return;
					}
					if(data.content.code==10006){
						alert("房主才能删除！");
						return;
					}
					if(data.content.code==10007){
						alert("房间不存在！");
						return;
					}
					if(data.content.code==10008){
						alert("房间已满！");
						return;
					}
					if(data.content.code==10009){
						alert("加入房间状态不对！");
						return;
					}
					if(data.content.code==10010){
						alert("房间状态不对, 无法开启游戏！");
						return;
					}
					if(data.content.code==20001){
						alert("不在答题时间！");
						return;
					}
					if(data.content.code==20002){
						alert("你是画家！");
						return;
					}
				}	


			}

			this.socket.onerror=function(event){
				console.log("Client notified socket has error",event.data);
			}

			this.socket.onclose=function(event){
				console.log("Client notified socket has closed",event.data);
				// window.location.reload();
			}

		},
		createRoom:function(){
			console.log('createRoom');
			var msg={
				rpcMethod:"/room/create",
				params:{
					maxSize:8
				},
				moduleId:this.GUESS,
				uuid:this.gbId
			}
			this.socket.send(JSON.stringify(msg));
		},
		joinRoom:function(){
			console.log("joinRoom");
			var msg={
				rpcMethod:"/room/join",
				params:{
					roomId:this.roomId
				},
				moduleId:this.GUESS,
				uuid:this.gbId
			}
			this.socket.send(JSON.stringify(msg));
		},
		removePlayer:function(avatarInfo){
			var msg={
				rpcMethod:"/room/remove",
				params:{
					avatarId:avatarInfo.avatarId
				},
				moduleId:this.GUESS,
				uuid:this.gbId
			}
			this.socket.send(JSON.stringify(msg));
		},
		ready:function(){
			console.log("ready");
			var msg={
				rpcMethod:"/avatar/ready",
				params:{

				},
				moduleId:this.GUESS,
				uuid:this.gbId
			}
			this.socket.send(window.JSON.stringify(msg));
		},
		startGame:function(){
			console.log('startGame')
	        var msg = {
	            rpcMethod:"/guess/start", 
	            params:{
	                roomId:this.roomId
	            },
	            moduleId:this.GUESS,
	            uuid:this.gbId
	        };
	        this.socket.send(window.JSON.stringify(msg));
		},
		sendDrawingInfo:function(info){
			var msg = {
           		rpcMethod:"/guess/draw", 
	            params:{
	                roomId:this.roomId,
	                content:info
	            },
	            moduleId:this.GUESS,
	            uuid:this.gbId
	        };
	        this.socket.send(window.JSON.stringify(msg));
		},
		sendQuestion:function(){
			var msg = {
	            rpcMethod:"/guess/question", 
	            params:{
	                roomId:this.roomId,
	                answer:info.answer,
	                hint1:info.hint1,
	                hint2:info.hint2
	            },
	            moduleId:this.GUESS,
	            uuid:this.player.uuid
	        };
	        this.socket.send(window.JSON.stringify(msg));
		},
		sendAnswer:function(message){
			var msg = {
            	rpcMethod:"/guess/answer", 
	            params:{
	                roomId:this.roomId,
	                answer:message.text
	            },
	            moduleId:this.GUESS,
	            uuid:this.gbId
	        };
	        this.socket.send(window.JSON.stringify(msg));
		},
		like:function(){
			var msg = {
            	rpcMethod:"/guess/like", 
	            params:{
	                roomId:this.roomId
	            },
	            moduleId:this.GUESS,
	            uuid:this.gbId
	        };
	        this.socket.send(window.JSON.stringify(msg));
		},
		unlike:function(){
			var msg = {
            	rpcMethod:"/guess/unlike", 
	            params:{
	                roomId:this.roomId
	            },
	            moduleId:this.GUESS,
	            uuid:this.gbId
	        };
	        this.socket.send(window.JSON.stringify(msg));
		}

	},
	{
		NAME:'DrawSomethingProxy'
	}
)