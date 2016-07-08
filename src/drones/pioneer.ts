import {Drone} from "./drone-core";
import {DigestivePool} from "../RPC";
export class Pioneer extends Drone {
    public operate() {
        if (this.drone.memory.storing && this.drone.carry.energy == 0) {
            this.drone.memory.storing = false;
            let digestivePool:any = this.drone.pos.findClosestByPath(FIND_SOURCES);
            this.drone.memory.source = digestivePool.id;
        }

        if (!this.drone.memory.storing && this.drone.carry.energy == this.drone.carryCapacity) {
            this.drone.memory.storing = true;
        }

        if (!this.drone.memory.storing) {
            if (!this.drone.memory.source) {
                let digestivePool:any = this.drone.pos.findClosestByPath(FIND_SOURCES);
                this.drone.memory.source = digestivePool.id;
            }
            if (this.drone.harvest(Game.getObjectById(this.drone.memory.source) as DigestivePool) == ERR_NOT_IN_RANGE) {
                this.drone.moveTo(Game.getObjectById(this.drone.memory.source) as DigestivePool);
            }
        }
        else {
            var targets = this.drone.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (this.drone.transfer(targets[0] as Spawn | Extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.drone.moveTo(targets[0] as Spawn | Extension);
                }
            } else {
                var result = this.drone.upgradeController(this.drone.room.controller);
                if (result == ERR_NOT_IN_RANGE) {
                    this.drone.moveTo(this.drone.room.controller);
                }
            }
        }
    }
}