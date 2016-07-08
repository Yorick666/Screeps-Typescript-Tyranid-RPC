import {HiveMind} from "./hive/mind";
export namespace GameManager {
    export var sampleVariable:string = "This is public variable";

    export function globalBootstrap() {
        this.sampleVariable = "This is how you can use variables in GameManager";
    }

    export function loop() {
        HiveMind.operate();
    }

}