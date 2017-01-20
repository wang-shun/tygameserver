package com.netease.pangu.game.business.controller;

import com.netease.pangu.game.common.meta.*;
import com.netease.pangu.game.meta.Avatar;
import com.netease.pangu.game.meta.GuessGame;
import com.netease.pangu.game.meta.GuessGame.Guess;
import com.netease.pangu.game.meta.GuessGameState;
import com.netease.pangu.game.rpc.annotation.WsRpcCall;
import com.netease.pangu.game.rpc.annotation.WsRpcController;
import com.netease.pangu.game.service.AvatarService;
import com.netease.pangu.game.service.AvatarSessionService;
import com.netease.pangu.game.service.GuessGameService;
import com.netease.pangu.game.service.RoomService;
import com.netease.pangu.game.util.ReturnUtils;
import com.netease.pangu.game.util.ReturnUtils.GameResult;

import javax.annotation.Resource;
import java.util.Map;

@WsRpcController(value = "/guess", gameId = GameConst.GUESSS)
public class GuessGameController {
    public static final String START_GAME = "startGame";
    public static final String DRAW_GAME = "drawGame";
    public static final String QUESTION_GAME = "drawQuestion";

    @Resource
    private GuessGameService guessGameService;
    @Resource
    private AvatarService avatarService;
    @Resource
    private AvatarSessionService avatarSessionService;
    @Resource
    private RoomService roomService;

    @WsRpcCall("/start")
    public GameResult startGuessGame(long roomId, GameContext<AvatarSession<Avatar>> ctx) {
        if (roomService.isReady(roomId) && roomService.isRoomOwner(roomId, ctx.getSession().getAvatarId())) {
            roomService.setRoomState(roomId, RoomStatus.GAMEING);
            if (guessGameService.startGame(roomId)) {
                return ReturnUtils.succ("succ");
            } else {
                return ReturnUtils.failed("failed");
            }
        } else {
            return ReturnUtils.failed("room is not ready");
        }
    }

    @WsRpcCall("/draw")
    public GameResult draw(long roomId, Map<String, Object> content, GameContext<AvatarSession<Avatar>> ctx) {
        if (roomService.isReady(roomId) && guessGameService.isDrawer(roomId, ctx)) {
            GuessGame game = guessGameService.getGuessGame(roomId);
            if (game != null && ctx.getSession().getAvatarId() == game.getDrawerId()) {
                roomService.broadcast(DRAW_GAME, roomId, ReturnUtils.succ(content));
                return ReturnUtils.succ();
            } else {
                return ReturnUtils.failed("you are not drawer");
            }
        } else {
            return ReturnUtils.failed("room is not ready");
        }
    }

    @WsRpcCall("/exit")
    public GameResult exit(long roomId, GameContext<AvatarSession<Avatar>> ctx){
        GameRoom room = roomService.getGameRoom(roomId);
        if(room != null) {
            if (room.getStatus() == RoomStatus.GAMEING){

            }
        }
        return ReturnUtils.failed();
    }


    @WsRpcCall("/answer")
    public GameResult setAnswer(long roomId, String answer, GameContext<AvatarSession<Avatar>> ctx) {
        Guess guess = new Guess();
        guess.setAnswer(answer);
        guess.setTime(System.currentTimeMillis());
        guess.setAvatarId(ctx.getSession().getAvatarId());
        if (guessGameService.getGuessGameState(roomId) == GuessGameState.ROUND_GAMING) {
            if (!guessGameService.isDrawer(roomId, ctx)) {
                guessGameService.addGuessGameAnswer(roomId, guess);
                if (guessGameService.isCorrectAnswer(roomId, guess)) {
                    roomService.broadcast("correct", roomId, ReturnUtils.succ(guess));
                } else {
                    roomService.broadcast("answer", roomId, ReturnUtils.succ(guess));
                }
                return ReturnUtils.succ();
            } else {
                return ReturnUtils.failed("you are drawer");
            }
        } else {
            return ReturnUtils.failed("not in answer time");
        }
    }
}
