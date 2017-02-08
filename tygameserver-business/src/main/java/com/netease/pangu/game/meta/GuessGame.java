package com.netease.pangu.game.meta;

import io.netty.util.HashedWheelTimer;
import org.springframework.data.annotation.Transient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class GuessGame {
    private long gameId;
    private long roomId;
    private long startTime;
    private long endTime;
    private long nextStartTime;
    private long drawerId;
    private Question question;
    private List<Guess> answers;
    private boolean isFirstGuessed;
    private Map<Long, Integer> scores;
    private Map<Long, List<RULE>> operations;
    private GuessGameState state;
    private int round;

    @Transient
    private HashedWheelTimer timer;

    public GuessGame() {
        this.answers = new ArrayList<Guess>();
        this.operations = new HashMap<Long, List<RULE>>();
        this.timer = new HashedWheelTimer(1, TimeUnit.SECONDS);
    }

    public long getRoomId() {
        return roomId;
    }

    public void setRoomId(long roomId) {
        this.roomId = roomId;
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    public long getDrawerId() {
        return drawerId;
    }

    public void setDrawerId(long drawerId) {
        this.drawerId = drawerId;
    }

    public long getEndTime() {
        return endTime;
    }

    public void setEndTime(long endTime) {
        this.endTime = endTime;
    }

    public long getGameId() {
        return gameId;
    }

    public void setGameId(long gameId) {
        this.gameId = gameId;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public List<Guess> getAnswers() {
        return answers;
    }

    public void addAnswer(Guess guess) {
        this.answers.add(guess);
    }

    public GuessGameState getState() {
        return state;
    }

    public void setState(GuessGameState state) {
        this.state = state;
    }

    public int getRound() {
        return round;
    }

    public void setRound(int round) {
        this.round = round;
    }

    public Map<Long, List<RULE>> getOperations() {
        return operations;
    }

    public Map<Long, Integer> getScores() {
        return scores;
    }

    public boolean isFirstGuessed() {
        return isFirstGuessed;
    }

    public void setFirstGuessed(boolean firstGuessed) {
        isFirstGuessed = firstGuessed;
    }

    public HashedWheelTimer getTimer() {
        return timer;
    }

    public long getNextStartTime() {
        return nextStartTime;
    }

    public void setNextStartTime(long nextStartTime) {
        this.nextStartTime = nextStartTime;
    }

    public enum RULE {
        FIRST_GUESSED(1, "猜题人：首个猜到答案"),
        GUESSED(2, "猜题人：猜到答案"),
        LIKE(3, "画题人：绘画被点赞"),
        UNLIKE(4, "不喜欢"),
        BE_GUESSED(5, "画题人：每次作品被别人"),
        EXIT(6, "中途离开");

        private int id;
        private String desc;
        private RULE(int id, String desc){
            this.id = id;
            this.desc = desc;
        }
    }

    public static class Question {
        private long avatarId;
        private String hint1;
        private String hint2;
        private String answer;
        private Object draw;

        public long getAvatarId() {
            return avatarId;
        }

        public void setAvatarId(long avatarId) {
            this.avatarId = avatarId;
        }

        public String getHint1() {
            return hint1;
        }

        public void setHint1(String hint1) {
            this.hint1 = hint1;
        }

        public String getHint2() {
            return hint2;
        }

        public void setHint2(String hint2) {
            this.hint2 = hint2;
        }

        public String getAnswer() {
            return answer;
        }

        public void setAnswer(String answer) {
            this.answer = answer;
        }

        public Object getDraw() {
            return draw;
        }

        public void setDraw(Object draw) {
            this.draw = draw;
        }
    }

    public static class Guess {
        private long avatarId;
        private String answer;
        private long time;
        public Guess(){

        }

        public Guess(Guess guess){
            this.setAnswer(guess.getAnswer());
            this.setAvatarId(guess.getAvatarId());
            this.setTime(guess.getTime());
        }
        public long getAvatarId() {
            return avatarId;
        }

        public void setAvatarId(long avatarId) {
            this.avatarId = avatarId;
        }

        public String getAnswer() {
            return answer;
        }

        public void setAnswer(String answer) {
            this.answer = answer;
        }

        public long getTime() {
            return time;
        }

        public void setTime(long time) {
            this.time = time;
        }
    }

    public static class GameRound{
        private int round;
        private int ownerId;
        private long startTime;
        private long endTime;
        private long nextStartTime;
        private long drawerId;
        private Question question;
        private List<Guess> answers;
        private boolean isFirstGuessed;
        private Map<Long, Integer> scores;
        private Map<Long, List<RULE>> operations;

        public GameRound(GuessGame game, int ownerId){
            this.setOwnerId(ownerId);
            this.setRound(game.getRound());
            this.setStartTime(game.getStartTime());
            this.setEndTime(game.getEndTime());
            this.setNextStartTime(game.getNextStartTime());
            this.setDrawerId(game.getDrawerId());
            this.setQuestion(game.getQuestion());
            this.setAnswers(game.getAnswers());
            this.setFirstGuessed(game.isFirstGuessed());
            this.setScores(game.getScores());
            this.setOperations(game.getOperations());
        }

        public int getOwnerId() {
            return ownerId;
        }

        public void setOwnerId(int ownerId) {
            this.ownerId = ownerId;
        }


        public int getRound() {
            return round;
        }

        public void setRound(int round) {
            this.round = round;
        }

        public long getStartTime() {
            return startTime;
        }

        public void setStartTime(long startTime) {
            this.startTime = startTime;
        }

        public long getEndTime() {
            return endTime;
        }

        public void setEndTime(long endTime) {
            this.endTime = endTime;
        }

        public long getNextStartTime() {
            return nextStartTime;
        }

        public void setNextStartTime(long nextStartTime) {
            this.nextStartTime = nextStartTime;
        }

        public long getDrawerId() {
            return drawerId;
        }

        public void setDrawerId(long drawerId) {
            this.drawerId = drawerId;
        }

        public Question getQuestion() {
            return question;
        }

        public void setQuestion(Question question) {
            this.question = question;
        }

        public List<Guess> getAnswers() {
            return answers;
        }

        public void setAnswers(List<Guess> answers) {
            this.answers = answers;
        }

        public boolean isFirstGuessed() {
            return isFirstGuessed;
        }

        public void setFirstGuessed(boolean firstGuessed) {
            isFirstGuessed = firstGuessed;
        }

        public Map<Long, Integer> getScores() {
            return scores;
        }

        public void setScores(Map<Long, Integer> scores) {
            this.scores = scores;
        }

        public Map<Long, List<RULE>> getOperations() {
            return operations;
        }

        public void setOperations(Map<Long, List<RULE>> operations) {
            this.operations = operations;
        }
    }
}
