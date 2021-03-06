package com.netease.pangu.game.controller;

import com.netease.pangu.game.common.meta.GameConst;
import com.netease.pangu.game.http.annotation.HttpController;
import com.netease.pangu.game.http.annotation.HttpRequestMapping;
import com.netease.pangu.game.service.AuthService;
import com.netease.pangu.game.util.ReturnUtils;

import javax.annotation.Resource;

/**
 * Created by huangc on 2017/2/6.
 */

@HttpController(value = "/auth", moduleId = GameConst.SYSTEM)
public class AuthController {
    @Resource
    private AuthService authService;

    private final static long AUTH_TIME = 10 * 60 * 1000;

    @HttpRequestMapping("/generate")
    public String generateToken(String uuid) {
        long expireTime = System.currentTimeMillis() + AUTH_TIME;
        return authService.generateToken(uuid, expireTime);
    }


    @HttpRequestMapping("/validate")
    public ReturnUtils.GameResult validateToken(String token) {
        return authService.checkToken(token);
    }


}
