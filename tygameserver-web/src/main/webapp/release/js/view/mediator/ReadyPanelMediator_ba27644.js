puremvc.define({name:"drawsomething.view.mediator.ReadyPanelMediator",parent:puremvc.Mediator},{listNotificationInterests:function(){return[drawsomething.AppConstants.BROADCAST_ROOMINFO,drawsomething.AppConstants.BROADCAST_JOIN,drawsomething.AppConstants.BROADCAST_READY,drawsomething.AppConstants.RECEIVE_REMOVE_PLAYER,drawsomething.AppConstants.GAME_OVER,drawsomething.AppConstants.CHANGE_OWNER]},onRegister:function(){this.setViewComponent(new drawsomething.view.component.ReadyPanel),this.viewComponent.addEventListener(drawsomething.view.event.AppEvents.READY,this),this.viewComponent.addEventListener(drawsomething.view.event.AppEvents.START_GAME,this),this.viewComponent.addEventListener(drawsomething.view.event.AppEvents.REMOVE_PLAYER,this)},handleEvent:function(e){switch(e.type){case drawsomething.view.event.AppEvents.READY:this.sendNotification(drawsomething.AppConstants.READY,e.msg);break;case drawsomething.view.event.AppEvents.START_GAME:this.sendNotification(drawsomething.AppConstants.START_GAME,e.msg);break;case drawsomething.view.event.AppEvents.REMOVE_PLAYER:this.sendNotification(drawsomething.AppConstants.REMOVE_PLAYER,e.msg)}},handleNotification:function(e){switch(e.getName()){case drawsomething.AppConstants.BROADCAST_ROOMINFO:this.viewComponent.show(),this.viewComponent.initRoom(e.getBody());break;case drawsomething.AppConstants.BROADCAST_JOIN:this.viewComponent.addPlayer(e.getBody());break;case drawsomething.AppConstants.BROADCAST_READY:this.viewComponent.updateReadyInfo(e.getBody());break;case drawsomething.AppConstants.RECEIVE_REMOVE_PLAYER:this.viewComponent.receiveRemovePlayer(e.getBody());break;case drawsomething.AppConstants.GAME_OVER:this.viewComponent.show();break;case drawsomething.AppConstants.CHANGE_OWNER:this.viewComponent.changeOwner(e.getBody())}}},{NAME:"ReadyPanelMediator"});