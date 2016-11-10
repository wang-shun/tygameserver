package com.netease.pangu.game.dao.impl;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import com.mongodb.WriteResult;
import com.netease.pangu.game.dao.AbstractMongoDao;
import com.netease.pangu.game.dao.AvatarDao;
import com.netease.pangu.game.meta.Avatar;

@Component
public class AvatarDaoImpl extends AbstractMongoDao<Avatar> implements AvatarDao<Avatar> {
	@Override
	public Avatar getAvatarByAvatarId(long id){
		Query query = new Query(Criteria.where("avatarId").is(id));
		return this.findOne(query, Avatar.class);
	}
	
	@Override
	public Avatar getAvatarByUUID(long gameId, String uuid){
		Criteria criteria = Criteria.where("uuid").is(uuid);
		criteria.andOperator(Criteria.where("gameId").is(gameId));
		Query query = new Query(criteria);
		return this.findOne(query, Avatar.class);
	}
	

	@Override
	public boolean insertAvatar(Avatar avatar) {
		try{
			this.insert(avatar);
		}catch(Exception e){
			return false;
		}
		return true;
	}

	@Override
	public boolean removeAvatar(Avatar avatar) {
		WriteResult result = this.remove(avatar);
		return result.getN() > 0;
	}
	
	public boolean removeAvatarByAvatarId(Avatar avatar) {
		Query query = new Query(Criteria.where("avatarId").is(avatar.getAvatarId()));
		WriteResult result = this.getMongoTemplate().remove(query, Avatar.class);
		return result.getN() > 0;
	}

	@Override
	public boolean saveAvatar(Avatar avatar) {
		try{
			this.save(avatar);
			
		}catch(Exception e){
			return false;
		}
		return true;
	}
}