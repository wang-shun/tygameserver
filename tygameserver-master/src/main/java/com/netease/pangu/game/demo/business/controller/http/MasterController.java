package com.netease.pangu.game.demo.business.controller.http;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;

import com.netease.pangu.game.core.service.NodeScheduleService;
import com.netease.pangu.game.distribution.Node;
import com.netease.pangu.game.distribution.NodeManager;
import com.netease.pangu.game.http.annotation.HttpController;
import com.netease.pangu.game.http.annotation.HttpRequestMapping;
import com.netease.pangu.game.meta.Player;
import com.netease.pangu.game.rpc.annotation.WsRpcCall;
import com.netease.pangu.game.rpc.annotation.WsRpcController;
import com.netease.pangu.game.service.PlayerManager;
import com.netease.pangu.game.util.JsonUtil;

@WsRpcController("/master")
@HttpController("/master")
public class MasterController {
	@Resource NodeScheduleService appWorkerScheduleService;
	@Resource PlayerManager playerManager;
	@Resource NodeManager nodeManager;
	
	@WsRpcCall("/app")
	@HttpRequestMapping("/app")
	public String getNode(String uuid, String callback){
		Node node = null;
		Player player = playerManager.getPlayerByUUID(uuid);
		if(player != null){
			String server = player.getServer();
			if(StringUtils.isNotEmpty(server)){
				node = nodeManager.getNode(server);
			}else{
				node = appWorkerScheduleService.getNodeByScheduled();
			}
		}else{
			node = appWorkerScheduleService.getNodeByScheduled();
		}
		if(node != null){
			Map<String, Object> workerInfo = new HashMap<String, Object>();
			workerInfo.put("ip", node.getIp());
			workerInfo.put("port", node.getPort());
			workerInfo.put("name", node.getName());
			return callback + "(" + JsonUtil.toJson(workerInfo) + ")";
		}
		return  callback + "(" +null + ")";
	}
	
	@WsRpcCall("/player")
	@HttpRequestMapping("/player")
	public Map<String, Object> getPlayerByUUID(String uuid){
		Player player = playerManager.getPlayerByUUID(uuid);
		Map<String, Object> playerObj = new HashMap<String, Object>();
		playerObj.put("name", player.getName());
		playerObj.put("uuid", player.getUuid());
		playerObj.put("pId", player.getPid());
		playerObj.put("server", player.getServer());
		return playerObj;
	}
}