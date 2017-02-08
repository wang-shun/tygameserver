puremvc.define({
		name:'drawsomething.view.component.ReadyPanel',
		constructor:function(event){
			var _this=this;
			this.container=$('#readyPanel');
			this.container.find(".startBtn").click(function(){
				_this.startGame();
			})
			this.container.click(function(e){
				if($(e.target).hasClass("btn-ready")){
					_this.setReady();
				}else if($(e.target).hasClass("closeBtn")){
					_this.kickPlayer();
				}
			})
		}
	},
	{
		addEventListener:function(type,listener,useCapture){
			drawsomething.view.event.AppEvents.addEventListener(this.container,type,listener,useCapture);
		},
		createEvent:function(eventName){
			return drawsomething.view.event.AppEvents.createEvent(eventName);
		},
		dispatchEvent:function(event){
			drawsomething.view.event.AppEvents.dispatchEvent(this.container,event);
		},
		updateMembers:function(){
			
		},
		startGame:function(){
			console.log("startGame")
		},
		setReady:function(){
			console.log("准备")
		},
		kickPlayer:function(){
			console.log("踢人")
		},
		hide:function(){
			this.container.hide();
		},
		show:function(){
			this.container.show();
		}
	},
	{
		NAME:'ReadyPanel'
	}
)