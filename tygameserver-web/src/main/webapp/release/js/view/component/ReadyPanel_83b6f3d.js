puremvc.define({name:"drawsomething.view.component.ReadyPanel",constructor:function(){var t=this;this.kickPlayerId,this.container=document.querySelector("#readyPanel"),this.$container=$("#readyPanel"),this.$container.find(".startBtn").click(function(){$(this).hasClass("gray")||t.startGame()}),this.$container.click(function(e){if($(e.target).hasClass("btn-ready"))t.setReady();else if($(e.target).hasClass("closeBtn")){var n=$(e.target).attr("data-avatarId");t.kickPlayerId=n;var i=t.getMember(t.members,n);null!=i&&t.$confirmPop.find(".nickName").html(i.name),t.$confirmPop.show()}}),this.$container.bind("countDown",function(){t.setReady()}),this.items=[],this.$confirmPop=this.$container.find(".confirmPop"),this.$confirmPop.find(".cancelBtn").click(function(){t.$confirmPop.hide()}),this.$confirmPop.find(".confirmBtn").click(function(){t.kickPlayer(t.kickPlayerId)})}},{addEventListener:function(t,e,n){drawsomething.view.event.AppEvents.addEventListener(this.container,t,e,n)},createEvent:function(t){return drawsomething.view.event.AppEvents.createEvent(t)},dispatchEvent:function(t){drawsomething.view.event.AppEvents.dispatchEvent(this.container,t)},initRoom:function(t){this.roominfo=t.roominfo,this.avatarId=t.avatarId,this.items=[];var e=t.info.members;this.members=e;for(var n=0;8>n;n++){var i=new drawsomething.view.component.PlayerItem(this.$container.find(".item").eq(n));e[n]?(i.setData(e[n],t.roominfo,t.avatarId),t.avatarId==e[n].avatarId&&t.avatarId!=t.roominfo.ownerId&&i.startCountDown()):i.setBlank(),this.items.push(i)}this.$container.find(".roomId").html("\u623f\u95f4\u53f7\uff1a"+t.info.id),this.updateStartBtn()},addPlayer:function(t){var e=t.member.position;this.items[e].setData(t.member.avatar,t.roominfo,t.avatarId),this.updateStartBtn()},getMember:function(t,e){for(var n in t)if(t[n].avatarId==e)return t[n];return null},updateReadyInfo:function(t){for(var e=t.info.avatar.avatarId,n=0;n<this.items.length;n++)this.items[n].avatarId==e&&this.items[n].ready();this.updateStartBtn()},changeOwner:function(t){for(var e=0;e<this.items.length;e++)null!=this.items[e].avatarId&&(this.items[e].avatarId==t&&(this.items[e].selfData.state="READY"),this.items[e].updateState());this.updateStartBtn()},updateMembers:function(){},startGame:function(){var t=this.createEvent(drawsomething.view.event.AppEvents.START_GAME);t.msg={},this.dispatchEvent(t)},setReady:function(){var t=this.createEvent(drawsomething.view.event.AppEvents.READY);t.msg={},this.dispatchEvent(t)},kickPlayer:function(t){var e=this.createEvent(drawsomething.view.event.AppEvents.REMOVE_PLAYER);e.msg={avatarId:t},this.dispatchEvent(e)},receiveRemovePlayer:function(t){for(var e=this.items.length-1;e>=0;e--)t.avatarId==this.items[e].avatarId&&this.items[e].remove();this.$container.find(".confirmPop").hide(),this.updateStartBtn()},updateStartBtn:function(){for(var t=0,e=0,n=0;n<this.items.length;n++)this.items[n].isReady&&t++,null!=this.items[n].avatarId&&e++;t>=2&&t==e?this.$container.find(".startBtn").removeClass("gray"):this.$container.find(".startBtn").addClass("gray"),this.roominfo.ownerId==this.avatarId?this.$container.find(".startBtn").show():this.$container.find(".startBtn").hide()},hide:function(){this.$container.hide()},show:function(){this.$container.show()}},{NAME:"ReadyPanel"});