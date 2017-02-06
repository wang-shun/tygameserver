puremvc.define({
	name:'drawsomething.controller.command.SocketCommand',
	parent:puremvc.SimpleCommand
},
{
	execute:function(note){
		var proxy=this.facade.retrieveProxy(drawsomething.model.proxy.DrawSomethingProxy.NAME);
		switch(note.getName()){
			case drawsomething.AppConstants.CONNECT_SOCKET:
				console.log(note.getBody());
				proxy.getConnectData(note.getBody());
			break;
			case drawsomething.AppConstants.START_GAME:
				proxy.startGame();
			break;
			case drawsomething.AppConstants.GET_ROLELIST:
				proxy.getRoleList();
			break;
		}
	}
})