package com.netease.pangu.game.meta;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Map;

/**
 * Created by huangc on 2017/2/8.
 */
@Document(collection = "guessgame_info")
public class GuessGameInfo {

    @Field("_id")
    private ObjectId id;
    private long creatorId;
    private long creatorName;

    private Map<Integer, GuessGame.GameRound> infos;

    public ObjectId getId() {
        return id;
    }
    public void setId(ObjectId id) {
        this.id = id;
    }

    public Map<Integer, GuessGame.GameRound> getInfos() {
        return infos;
    }

    public void setInfos(Map<Integer, GuessGame.GameRound> infos) {
        this.infos = infos;
    }
}
