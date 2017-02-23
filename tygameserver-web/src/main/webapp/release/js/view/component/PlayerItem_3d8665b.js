puremvc.define({name:"drawsomething.view.component.PlayerItem",constructor:function(t){this.$container=t;var i=$("#playerItems-template").html();this.template=Handlebars.compile(i),this.isReady=!1}},{setBlank:function(){this.avatarId=null;var t=this.template({});this.el=$(t),this.$container.empty(),this.$container.append(this.el),this.$container.find(".name").hide(),this.$container.find(".head").hide(),this.$container.find(".closeBtn").hide()},setData:function(t,i,e){var n=this;this.selfData=t,this.roomInfo=i,this.avatarId=t.avatarId,this.userAvatarId=e;var s=this.template(t);this.el=$(s),this.$container.append(this.el),this.updateState(),this.$container.find(".btn-ready").click(function(){n.el.find(".countDown").hide(),n.isReady=!0})},startCountDown:function(){function t(){e--,i.el.find(".second").html(e),e>0?setTimeout(t,1e3):i.isReady||(i.el.trigger("countDown"),i.el.find(".countDown").hide())}this.el.find(".countDown").show();var i=this,e=10;t()},updateState:function(){this.el.find(".closeBtn").show(),this.userAvatarId==this.selfData.avatarId?"READY"==this.selfData.state?(this.el.find(".btn-already").css({display:"block"}),this.isReady=!0):this.el.find(".btn-ready").css({display:"block"}):"READY"==this.selfData.state?(this.el.find(".btn-already").css({display:"block"}),this.isReady=!0):this.el.find(".btn-unready").css({display:"block"}),this.userAvatarId!=this.roomInfo.ownerId&&this.el.find(".closeBtn").hide(),this.selfData.avatarId==this.roomInfo.ownerId&&(this.el.find(".ownerIcon").css({display:"block"}),this.el.find(".closeBtn").hide())},ready:function(){this.el.find(".btn-unready").css({display:"none"}),this.el.find(".btn-ready").css({display:"none"}),this.el.find(".btn-already").css({display:"block"}),this.isReady=!0},remove:function(){this.el.find(".btn-ready").unbind("click"),this.el.remove()}},{NAME:"PlayerItem"});