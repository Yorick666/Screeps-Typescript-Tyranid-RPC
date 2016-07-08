import {Drone} from "./drone-core";
import {Biomass} from "../RPC";
export class Builder extends Drone {

    public operate() {
        if (this.drone.memory.building && this.drone.carry.energy == 0) {
            this.drone.memory.building = false;
        } else if (!this.drone.memory.building && this.drone.carry.energy == this.drone.carryCapacity) {
            this.drone.memory.building = true;
        }

        if (this.drone.memory.building) {
            var target:any = Game.getObjectById(this.drone.memory.target);
            if (!target) {
                this.getTarget();
                target = Game.getObjectById(this.drone.memory.target);
            }

            if (target) {
                if (!this.drone.pos.inRangeTo(target, 3)) {
                    this.drone.moveTo(target);
                }

                switch (this.drone.memory.mode) {
                    case 'repair':
                        this.drone.repair(target);
                        break;
                    case 'build':
                        this.drone.build(target);
                        break;
                    case 'strengthen':
                        this.drone.repair(target);
                        if (target.hits >= this.drone.room.memory.durability) {
                            delete this.drone.memory.target;
                        }
                }

                if (target.hits == target.hitsMax) {
                    delete this.drone.memory.target;
                }
            } else {
                delete this.drone.memory.target;
            }
        } else {
            var containers:any = Game.rooms[this.drone.room.name].find(FIND_STRUCTURES, {filter: s => (s.structureType === STRUCTURE_CONTAINER && _.sum(s.store) > 0)});
            var storage:any = this.drone.pos.findClosestByPath(containers);
            if (storage == null) {
                storage = this.drone.room.storage;
            }
            if (storage == null) {
                var droppedEnergy;
                if (!this.drone.memory.droppedEnergy) {
                    var droppedEnergies:any = this.drone.room.find(FIND_DROPPED_RESOURCES, {filter: o => o.resourceType === RESOURCE_ENERGY && o.amount >= 50});
                    let closestDroppedEnergy = this.drone.pos.findClosestByPath(droppedEnergies) as Biomass;
                    if (closestDroppedEnergy) {
                        this.drone.memory.droppedEnergy = closestDroppedEnergy.id;
                        droppedEnergy = closestDroppedEnergy;
                    }
                }
                else {
                    droppedEnergy = Game.getObjectById(this.drone.memory.droppedEnergy);
                    if (!droppedEnergy) this.drone.memory.droppedEnergy = false;
                }
                if (droppedEnergy) {
                    if (!this.drone.pos.isNearTo(droppedEnergy)) {
                        this.drone.moveTo(droppedEnergy);
                    }
                    this.drone.pickup(droppedEnergy);
                }
            } else {
                if (!this.drone.pos.isNearTo(storage)) {
                    this.drone.moveTo(storage);
                }
                if (this.drone.pos.isNearTo(storage)) {
                    storage.transfer(this.drone, RESOURCE_ENERGY);
                }
            }
        }
    }

    private  getTarget() {
        var structuresToRepair:any = this.drone.room.find(FIND_STRUCTURES,
            {
                filter: s => s.structureType !== STRUCTURE_WALL &&
                s.structureType !== STRUCTURE_RAMPART &&
                s.hits <= s.hitsMax * 0.75 &&
                s.hitsMax !== 0
            }
        );

        var closestStructureToRepair:any = this.drone.pos.findClosestByPath(structuresToRepair);

        if (closestStructureToRepair) {
            this.drone.memory.target = closestStructureToRepair.id;
            this.drone.memory.mode = 'repair';
            return;
        }

        var constructionSites:any = this.drone.room.find(FIND_CONSTRUCTION_SITES,
            {filter: s => s.structureType !== STRUCTURE_ROAD});
        var closestConstructionSite:any = this.drone.pos.findClosestByPath(constructionSites);

        if (closestConstructionSite) {
            this.drone.memory.target = closestConstructionSite.id;
            this.drone.memory.mode = 'build';
            return;
        }

        constructionSites = this.drone.room.find(FIND_CONSTRUCTION_SITES,
            {filter: s => s.structureType === STRUCTURE_ROAD});

        closestConstructionSite = this.drone.pos.findClosestByPath(constructionSites);

        if (closestConstructionSite) {
            this.drone.memory.target = closestConstructionSite.id;
            this.drone.memory.mode = 'build';
            return;
        }

        if (!this.drone.room.memory.durability) {
            this.drone.room.memory.durability = 25000;
        }

        var structuresToStrengthen:any = this.drone.room.find(FIND_STRUCTURES,
            {
                filter: s => (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) &&
                s.hits <= this.drone.room.memory.durability
            }
        );

        var closestStructureToStrengthen:any = this.drone.pos.findClosestByPath(structuresToStrengthen);

        if (closestStructureToStrengthen) {
            this.drone.memory.target = closestStructureToStrengthen.id;
            this.drone.memory.mode = 'strengthen';
            return;
        } else {
            structuresToStrengthen = this.drone.room.find(FIND_STRUCTURES,
                {
                    filter: s => s.structureType === STRUCTURE_WALL ||
                    s.structureType === STRUCTURE_RAMPART

                }
            );

            if (structuresToStrengthen.length && structuresToStrengthen.length < 1350000) {
                this.drone.room.memory.durability += 25000;
            }
        }
    }
}