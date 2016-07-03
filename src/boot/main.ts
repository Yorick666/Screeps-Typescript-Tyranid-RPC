/// <reference path="../_reference.ts" />
import {GameManager} from './../game-manager';
declare var module: any;

GameManager.globalBootstrap();
module.exports.loop = function() {

    GameManager.loop();

};