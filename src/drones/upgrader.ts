import {Drone, DroneCore} from "./drone-core";
export class Upgrader extends Drone implements DroneCore {

    public operate() {
        if (!this.drone.memory.refilling && this.drone.carry.energy == 0) {
            this.drone.memory.refilling = true;
        }
        if (this.drone.memory.refilling && this.drone.carry.energy == this.drone.carryCapacity) {
            this.drone.memory.refilling = false;
        }

        if (this.drone.memory.refilling) {
            this.refill();
        } else {
            this.upgrade();
        }
    }

    private upgrade() {
        if (this.drone.upgradeController(this.drone.room.controller) === ERR_NOT_IN_RANGE) {
            this.drone.moveTo(this.drone.room.controller);
        }
    }

    private refill() {
        let storage:any = this.drone.pos.findInRange(FIND_STRUCTURES, 4,
            {filter: s => ( ( s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER ) && _.sum(s.store) > 0)}
        );
        if (storage.length > 0) {
            storage = this.drone.pos.findClosestByPath(storage as any);
            if (!this.drone.pos.isNearTo(storage)) {
                this.drone.moveTo(storage);
            }
            if (this.drone.pos.isNearTo(storage)) {
                storage.transfer(this.drone, RESOURCE_ENERGY);
            }
        } else {
            let droppedEnergies = this.drone.pos.findInRange(FIND_DROPPED_RESOURCES, 4, {filter: o => o.resourceType === RESOURCE_ENERGY && o.amount >= 50});
            if (droppedEnergies.length == 0) {
                droppedEnergies = this.drone.room.find(FIND_DROPPED_RESOURCES, {filter: o => o.resourceType === RESOURCE_ENERGY && o.amount >= 50});
            }
            let closestDroppedEnergy:any = this.drone.pos.findClosestByPath(droppedEnergies as any);
            if (closestDroppedEnergy) {
                if (this.drone.pickup(closestDroppedEnergy) === ERR_NOT_IN_RANGE) {
                    this.drone.moveTo(closestDroppedEnergy);
                }
            }
        }
    }
}