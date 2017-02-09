puremvc.define({
		name:'drawsomething.controller.command.PrepControllerCommand',
		parent:puremvc.SimpleCommand
	},
	{
		execute:function(){
			this.facade.registerCommand(drawsomething.AppConstants.CONNECT_SOCKET,drawsomething.controller.command.SocketCommand);
			this.facade.registerCommand(drawsomething.AppConstants.GET_ROLELIST,drawsomething.controller.command.SocketCommand);
			this.facade.registerCommand(drawsomething.AppConstants.CHECK_LOGIN,drawsomething.controller.command.SocketCommand);
			this.facade.registerCommand(drawsomething.AppConstants.ROLE_CONFIRM,drawsomething.controller.command.SocketCommand);
			this.facade.registerCommand(drawsomething.AppConstants.JOIN_ROOM,drawsomething.controller.command.SocketCommand);
			this.facade.registerCommand(drawsomething.AppConstants.CREATE_ROOM,drawsomething.controller.command.SocketCommand);
			this.facade.registerCommand(drawsomething.AppConstants.READY,drawsomething.controller.command.SocketCommand);
			this.facade.registerCommand(drawsomething.AppConstants.START_GAME,drawsomething.controller.command.SocketCommand);
			this.facade.registerCommand(drawsomething.AppConstants.DRAWING,drawsomething.controller.command.SocketCommand);
			this.facade.registerCommand(drawsomething.AppConstants.DELETE,drawsomething.controller.command.SocketCommand);
		}
	}
)