import {HiveMind} from "./hive-mind";

/**
 * Singleton object.
 * Since singleton classes are considered anti-pattern in Typescript, we can effectively use namespaces.
 * Namespace's are like internal modules in your Typescript application. Since GameManager doesn't need multiple instances
 * we can use it as singleton.
 */
export namespace GameManager {

    /**
     * We can use variables in our namespaces in this way. Since GameManager is not class, but "module", we have to export the var, so we could use it.
     * @type {string}
     */
    export var sampleVariable: string = "This is public variable";

    export function globalBootstrap() {
        this.sampleVariable = "This is how you can use variables in GameManager";
    }

    export function loop() {
        HiveMind.orderMemories();
        HiveMind.checkBeacons();
        HiveMind.scanRooms();

    }

}