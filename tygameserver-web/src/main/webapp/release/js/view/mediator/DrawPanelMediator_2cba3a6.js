puremvc.define({name:"drawsomething.view.mediator.DrawPanelMediator",parent:puremvc.Mediator},{listNotificationInterests:function(){return[drawsomething.AppConstants.GAME_STARTING,drawsomething.AppConstants.DRAWING_HANDLE,drawsomething.AppConstants.ANSWER_INFO,drawsomething.AppConstants.RECEIVE_MSG,drawsomething.AppConstants.RECEIVE_HINT,drawsomething.AppConstants.ROUND_OVER,drawsomething.AppConstants.COUNTDOWN,drawsomething.AppConstants.RECEIVE_SCORES,drawsomething.AppConstants.RECEIVE_LIKE_INFO,drawsomething.AppConstants.GAME_OVER]},onRegister:function(){this.setViewComponent(new drawsomething.view.component.DrawPanel),this.viewComponent.addEventListener(drawsomething.view.event.AppEvents.SEND_MSG,this),this.viewComponent.addEventListener(drawsomething.view.event.AppEvents.DRAWING,this),this.viewComponent.addEventListener(drawsomething.view.event.AppEvents.DELETE,this),this.viewComponent.addEventListener(drawsomething.view.event.AppEvents.LIKE,this),this.viewComponent.addEventListener(drawsomething.view.event.AppEvents.UNLIKE,this),this.viewComponent.addEventListener(drawsomething.view.event.AppEvents.SEND_POS),this.startTimer()},startTimer:function(){function e(){t.sendPos(),setTimeout(function(){e()},1e3/n)}var t=this,n=10;e()},handleEvent:function(e){switch(e.type){case drawsomething.view.event.AppEvents.SEND_MSG:this.sendNotification(drawsomething.AppConstants.SEND_MSG,e.msg);break;case drawsomething.view.event.AppEvents.DRAWING:this.sendNotification(drawsomething.AppConstants.DRAWING,e.msg);break;case drawsomething.view.event.AppEvents.DELETE:this.sendNotification(drawsomething.AppConstants.DRAWING,e.msg);break;case drawsomething.view.event.AppEvents.LIKE:this.sendNotification(drawsomething.AppConstants.SEND_LIKE,e.msg);break;case drawsomething.view.event.AppEvents.UNLIKE:this.sendNotification(drawsomething.AppConstants.SEND_UNLIKE,e.msg);break;case drawsomething.view.event.AppEvents.SEND_POS:}},sendPos:function(){if(this.viewComponent.isDrawer&&this.viewComponent.sendPosArray.length>0){var e=this.viewComponent.sendPosArray.slice();this.viewComponent.sendPosArray=[],this.sendNotification(drawsomething.AppConstants.DRAWING,{list:e})}},handleNotification:function(e){switch(e.getName()){case drawsomething.AppConstants.GAME_STARTING:this.viewComponent.show(),this.viewComponent.roundStart(e.getBody());break;case drawsomething.AppConstants.DRAWING_HANDLE:this.viewComponent.receivePos(e.getBody());break;case drawsomething.AppConstants.ANSWER_INFO:this.viewComponent.updateAnswerInfo(e.getBody());break;case drawsomething.AppConstants.RECEIVE_MSG:this.viewComponent.receiveMsg(e.getBody());break;case drawsomething.AppConstants.RECEIVE_HINT:this.viewComponent.receiveHint(e.getBody());break;case drawsomething.AppConstants.ROUND_OVER:this.viewComponent.roundOver(e.getBody());break;case drawsomething.AppConstants.COUNTDOWN:this.viewComponent.updateCountDown(e.getBody());break;case drawsomething.AppConstants.RECEIVE_SCORES:this.viewComponent.receiveScores(e.getBody());break;case drawsomething.AppConstants.RECEIVE_LIKE_INFO:this.viewComponent.receiveLikeInfo(e.getBody());break;case drawsomething.AppConstants.GAME_OVER:this.viewComponent.isDrawer=!1,this.viewComponent.hide()}}},{NAME:"DrawPanelMediator"});