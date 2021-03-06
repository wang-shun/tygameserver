package com.netease.pangu.game.service;

import com.netease.pangu.game.common.meta.AvatarSession;
import com.netease.pangu.game.common.meta.AvatarStatus;
import com.netease.pangu.game.common.meta.GameRoom;
import com.netease.pangu.game.common.meta.GameRoom.RoomType;
import com.netease.pangu.game.common.meta.RoomStatus;
import com.netease.pangu.game.meta.Avatar;
import com.netease.pangu.game.service.AbstractAvatarSessionService.SessionCallable;
import com.netease.pangu.game.util.NettyHttpUtil;
import com.netease.pangu.game.util.ReturnUtils;
import com.netease.pangu.game.util.ReturnUtils.GameResult;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class RoomService {
    private final static Logger logger = Logger.getLogger(RoomService.class);
    @Resource
    private AvatarSessionService avatarSessionService;
    @Resource
    private UniqueIDGeneratorService uniqueIdGeneratorService;
    @Resource
    private RoomAllocationService roomAllocationService;

    private final ConcurrentMap<Long, GameRoom> rooms = new ConcurrentHashMap<Long, GameRoom>();
    private final ConcurrentMap<Long, Set<Long>> gameIdRefRoom = new ConcurrentHashMap<Long, Set<Long>>();

    public boolean remove(long roomId) {
        GameRoom room = rooms.remove(roomId);
        if (room != null) {
            Set<Long> refRooms = gameIdRefRoom.get(room.getGameId());
            if (refRooms != null) {
                gameIdRefRoom.get(room.getGameId()).remove(roomId);
            }
            roomAllocationService.returnRoom(room.getGameId(), roomId);
            return true;
        }
        return false;
    }

    public GameRoom getGameRoom(long roomId) {
        return rooms.get(roomId);
    }

    public Map<Long, GameRoom> getRooms() {
        return Collections.unmodifiableMap(rooms);
    }

    public Long generateRoomId(long gameId, String server) {
        return roomAllocationService.borrowRoom(gameId, server);
    }

    public boolean isReady(long roomId) {
        GameRoom room = getGameRoom(roomId);
        Map<Integer, Long> avatarIds = room.getSessionIds();
        Map<Long, AvatarSession<Avatar>> sessionsMap = avatarSessionService.getAvatarSessions(Arrays.asList(room.getSessionIds().values().toArray(new Long[0])));
        if (sessionsMap.values().size() < 2) {
            return false;
        }
        for (AvatarSession<Avatar> session : sessionsMap.values()) {
            if (session.getAvatarStatus() != AvatarStatus.READY) {
                return false;
            }
        }
        return true;
    }

    public Map<Long, AvatarSession<Avatar>> getMembers(long roomId) {
        GameRoom room = getGameRoom(roomId);
        return avatarSessionService.getAvatarSessions(Arrays.asList(room.getSessionIds().values().toArray(new Long[0])));
    }


    /**
     * @param gameId
     * @param avatarId
     * @param maxSize
     * @return roomId
     */
    public long createRoom(final long gameId, final long avatarId, final int maxSize) {
        return avatarSessionService.updateAvatarSession(avatarId, new SessionCallable<Long, Avatar>() {
            @Override
            public Long call(AvatarSession<Avatar> playerSession) {
                if (playerSession.getRoomId() == 0) {
                    Long roomId = generateRoomId(gameId, playerSession.getServer());
                    if (roomId != null) {
                        GameRoom room = new GameRoom();
                        room.setId(roomId);
                        room.setGameId(gameId);
                        room.setOwnerId(avatarId);
                        room.setSessionIds(new HashMap<Integer, Long>());
                        room.setStatus(RoomStatus.IDLE);
                        room.setMaxSize(maxSize);
                        room.getSessionIds().put(0, avatarId);

                        playerSession.setRoomId(roomId);
                        rooms.put(roomId, room);
                        gameIdRefRoom.putIfAbsent(gameId, new HashSet<Long>());
                        gameIdRefRoom.get(gameId).add(roomId);
                        return roomId;
                    }
                }
                return -1L;
            }
        });
    }

    public boolean canJoin(long roomId) {
        GameRoom room = getGameRoom(roomId);
        return room != null && room.getStatus() == RoomStatus.IDLE
                && room.getSessionIds().size() < room.getMaxSize() ? true : false;
    }

    public void setRoomState(long roomId, RoomStatus status, AvatarStatus avatarStatus, AvatarStatus ownerStatus) {
        final GameRoom room = getGameRoom(roomId);
        synchronized (room) {
            Map<Integer, Long> sessionIds = room.getSessionIds();
            Map<Long, AvatarSession<Avatar>> sessionMap = avatarSessionService.getAvatarSessions(Arrays.asList(sessionIds.values().toArray(new Long[0])));
            for (AvatarSession<Avatar> session : sessionMap.values()) {
                avatarSessionService.updateAvatarSession(session.getAvatarId(), new SessionCallable<Void, Avatar>() {
                    @Override
                    public Void call(AvatarSession<Avatar> playerSession) {
                        if (playerSession.getAvatarId() == room.getOwnerId()) {
                            playerSession.setAvatarStatus(ownerStatus);
                        } else {
                            playerSession.setAvatarStatus(avatarStatus);
                        }
                        return null;
                    }

                    ;
                });

            }
            room.setStatus(status);
        }
    }

    /**
     * @param avatarId
     * @param roomId
     * @return
     */
    public int joinRoom(final long avatarId, final long roomId) {
        return avatarSessionService.updateAvatarSession(avatarId, new SessionCallable<Integer, Avatar>() {
            @Override
            public Integer call(AvatarSession<Avatar> playerSession) {
                int pos = -1;
                if (playerSession.getRoomId() == 0) {
                    GameRoom room = getGameRoom(roomId);

                    if (canJoin(roomId) && !room.getSessionIds().containsValue(avatarId)) {
                        playerSession.setRoomId(roomId);
                        for (int i = 0; i < room.getMaxSize(); i++) {
                            if (room.getSessionIds().get(i) == null) {
                                room.getSessionIds().put(i, avatarId);
                                playerSession.setPosition(i);
                                pos = i;
                                break;
                            }
                        }
                        roomAllocationService.setRoomWithAvatarId(room.getGameId(), avatarId, roomId);

                    }
                }
                return pos;
            }
        });
    }

    public boolean isRoomOwner(long roomId, long avatarId) {
        GameRoom room = getGameRoom(roomId);
        return room != null && room.getOwnerId() == avatarId;
    }

    public int joinRandomRoom(final long avatarId) {
        List<Long> gameRooms = new ArrayList<Long>();
        for (GameRoom room : rooms.values()) {
            if (room.getType() == RoomType.PUBLIC && canJoin(room.getId())) {
                gameRooms.add(room.getId());
            }
        }
        Random random = new Random(System.currentTimeMillis());
        long roomId = gameRooms.get(random.nextInt(gameRooms.size()));
        return joinRoom(avatarId, roomId);
    }

    /**
     * @param avatarId
     * @return
     */
    public boolean exitRoom(final long avatarId) {
        return avatarSessionService.updateAvatarSession(avatarId, new SessionCallable<Boolean, Avatar>() {
            @Override
            public Boolean call(AvatarSession<Avatar> playerSession) {
                if (playerSession.getRoomId() > 0) {
                    GameRoom room = getGameRoom(playerSession.getRoomId());
                    room.getSessionIds().values().remove(avatarId);
                    roomAllocationService.deleteRoomByAvatarId(room.getGameId(), avatarId);
                    Map<String, Object> ret = new HashMap<String, Object>();
                    ret.put("exit", avatarId);
                    if (room.getSessionIds().size() > 0) {
                        if (room.getOwnerId() == avatarId) {
                            long owner = room.getSessionIds().values().toArray(new Long[0])[0];
                            room.setOwnerId(owner);
                            avatarSessionService.updateAvatarSession(owner, new SessionCallable<Void, Avatar>() {
                                @Override
                                public Void call(AvatarSession<Avatar> playerSession) {
                                    playerSession.setAvatarStatus(AvatarStatus.READY);
                                    return null;
                                }
                            });
                            broadcast(RoomBroadcastApi.ROOM_CHANGE_OWNER, room.getId(), ReturnUtils.succ(owner));
                            ret.put("owner", owner);
                        }
                    } else {
                        room.setOwnerId(0L);
                        room.setStatus(RoomStatus.CLOSING);
                        remove(room.getId());
                        logger.info(String.format("%d room destroyed", room.getId()));
                    }
                    playerSession.setRoomId(0L);
                    playerSession.setAvatarStatus(AvatarStatus.IDLE);
                    return true;
                }
                return false;
            }
        });
    }

    public void broadcast(String path, long roomId, Object msg) {
        GameRoom room = getGameRoom(roomId);
        if (room != null) {
            Map<Long, AvatarSession<Avatar>> sessionMap = avatarSessionService.getAvatarSessions(Arrays.asList(room.getSessionIds().values().toArray(new Long[0])));
            for (AvatarSession<Avatar> session : sessionMap.values()) {
                if (session.getChannel() != null && session.getChannel().isActive()) {
                    NettyHttpUtil.sendWsResponse(RoomBroadcastApi.ROOM_BROADCAST + path, session.getChannel(), msg);
                }
            }
        }
    }

    public void chatTo(String path, long roomId, List<Long> avatarIds, Object msg) {
        GameRoom room = getGameRoom(roomId);
        if (room != null) {
            Map<Long, AvatarSession<Avatar>> sessionMap = avatarSessionService.getAvatarSessions(Arrays.asList(room.getSessionIds().values().toArray(new Long[0])));
            for (Long avatarId : avatarIds) {
                AvatarSession<Avatar> session = sessionMap.get(avatarId);
                if (session != null && session.getChannel() != null && session.getChannel().isActive()) {
                    NettyHttpUtil.sendWsResponse(RoomBroadcastApi.ROOM_PRIVATE + path, session.getChannel(), msg);
                }
            }
        }
    }

    public static class SimpleAvatar {
        private String name;
        private String uuid;
        private long gameId;
        private long avatarId;
        private String avatarImg;
        private long roomId;
        private long totalScore;
        private AvatarStatus state;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUuid() {
            return uuid;
        }

        public void setUuid(String uuid) {
            this.uuid = uuid;
        }

        public long getGameId() {
            return gameId;
        }

        public void setGameId(long gameId) {
            this.gameId = gameId;
        }

        public long getAvatarId() {
            return avatarId;
        }

        public void setAvatarId(long avatarId) {
            this.avatarId = avatarId;
        }

        public String getAvatarImg() {
            return avatarImg;
        }

        public void setAvatarImg(String avatarImg) {
            this.avatarImg = avatarImg;
        }

        public long getRoomId() {
            return roomId;
        }

        public void setRoomId(long roomId) {
            this.roomId = roomId;
        }

        public AvatarStatus getState() {
            return state;
        }

        public void setState(AvatarStatus state) {
            this.state = state;
        }

        public long getTotalScore() {
            return totalScore;
        }

        public void setTotalScore(long totalScore) {
            this.totalScore = totalScore;
        }

        public static SimpleAvatar create(AvatarSession<Avatar> session) {
            SimpleAvatar avatar = new SimpleAvatar();
            avatar.setAvatarId(session.getAvatarId());
            avatar.setName(session.getName());
            avatar.setAvatarImg(session.getAvatar().getAvatarImg());
            avatar.setRoomId(session.getRoomId());
            avatar.setState(session.getAvatarStatus());
            avatar.setUuid(session.getUuid());
            avatar.setGameId(session.getGameId());
            avatar.setTotalScore(session.getAvatar().getTotalScore());
            return avatar;
        }
    }

    public Map<String, Object> getRoomInfoMap(long roomId) {
        GameRoom room = getGameRoom(roomId);
        Map<String, Object> payload = new HashMap<String, Object>();
        Map<Long, AvatarSession<Avatar>> sessions = avatarSessionService.getAvatarSessions(Arrays.asList(room.getSessionIds().values().toArray(new Long[0])));
        SortedMap<Integer, SimpleAvatar> members = new TreeMap<Integer, SimpleAvatar>();
        for (Map.Entry<Integer, Long> entry : room.getSessionIds().entrySet()) {
            if (entry.getValue() != null) {
                members.put(entry.getKey(), SimpleAvatar.create(sessions.get(entry.getValue())));
            }
        }
        payload.put("members", members);
        payload.put("id", room.getId());
        payload.put("state", room.getStatus().ordinal());
        payload.put("maxSize", room.getMaxSize());
        payload.put("count", room.getSessionIds().size());
        AvatarSession<Avatar> session = avatarSessionService.getSession(room.getOwnerId());
        payload.put("ownerName", session.getName());
        payload.put("ownerId", room.getOwnerId());
        return payload;
    }

    public GameResult getRoomInfo(long roomId) {
        return ReturnUtils.succ(getRoomInfoMap(roomId));
    }

    public GameResult getMember(AvatarSession<Avatar> session) {
        return ReturnUtils.succ(getMemberMap(session));
    }

    public Map<String, Object> getMemberMap(AvatarSession<Avatar> session) {
        GameRoom room = getGameRoom(session.getRoomId());
        Map<String, Object> payload = new HashMap<String, Object>();
        payload.put("avatar", SimpleAvatar.create(session));
        payload.put("ownerId", room.getOwnerId());
        payload.put("id", room.getId());
        payload.put("state", room.getStatus().ordinal());
        payload.put("maxSize", room.getMaxSize());
        payload.put("count", room.getSessionIds().size());
        payload.put("avatarId", session.getAvatarId());
        payload.put("position", session.getPosition());
        return payload;
    }
}
