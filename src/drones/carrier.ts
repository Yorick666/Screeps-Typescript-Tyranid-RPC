import {Drone} from "./drone-core";
import {Biomass} from "../RPC";
export class Carrier extends Drone {

    constructor(drone:Creep) {
        super(drone);
    }

    public operate() {

        if (!this.drone.memory.collecting && this.drone.carry.energy === 0) {
            this.drone.memory.collecting = true;
        }
        if (this.drone.memory.collecting && this.drone.carry.energy === this.drone.carryCapacity) {
            this.drone.memory.collecting = false;
        }

        if (this.drone.memory.collecting) {
            var droppedBiomass;
            if (!this.drone.memory.droppedBiomass) {
                var droppedBiomasses = this.drone.room.find(FIND_DROPPED_RESOURCES, {filter: o => o.resourceType === RESOURCE_ENERGY && o.amount >= 50});
                let closestDroppedBiomass = this.drone.pos.findClosestByPath(droppedBiomasses as any) as Biomass;
                if (closestDroppedBiomass) {
                    this.drone.memory.droppedBiomass = closestDroppedBiomass.id;
                    droppedBiomass = closestDroppedBiomass;
                }
            }
            else {
                droppedBiomass = Game.getObjectById(this.drone.memory.droppedBiomass);
                if (!droppedBiomass) this.drone.memory.droppedBiomass = false;
            }
            if (droppedBiomass) {
                if (!this.drone.pos.isNearTo(droppedBiomass)) {
                    this.drone.moveTo(droppedBiomass);
                }
                this.drone.pickup(droppedBiomass);
            } else {
                let storage = this.drone.room.find(FIND_STRUCTURES, {
                    filter: s =>
                        (s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER)
                });
                let closestEnergyTank:any = this.drone.pos.findClosestByPath(storage as any);
                if (closestEnergyTank) {
                    this.drone.moveTo(closestEnergyTank);
                    if (this.drone.pos.isNearTo(closestEnergyTank)) closestEnergyTank.transfer(this.drone, RESOURCE_ENERGY);
                }
            }
        } else {
            if (this.drone.memory.deliveryTarget) {
                let deliveryTarget:any = Game.getObjectById(this.drone.memory.deliveryTarget);
                if (!deliveryTarget) {
                    this.drone.memory.deliveryTarget = false;
                } else if (deliveryTarget.structureType === STRUCTURE_CONTAINER || deliveryTarget.structureType === STRUCTURE_STORAGE) {
                    if (!deliveryTarget || _.sum(deliveryTarget.store) === deliveryTarget.storeCapacity) this.drone.memory.deliveryTarget = false;
                }
                else {
                    if (!deliveryTarget || deliveryTarget.energy === deliveryTarget.energyCapacity) this.drone.memory.deliveryTarget = false;
                }
            }

            if (!this.drone.memory.deliveryTarget) {
                let possibleTargets = [
                    {
                        find: FIND_MY_STRUCTURES,
                        filter: o => (o.structureType === STRUCTURE_SPAWN || o.structureType === STRUCTURE_EXTENSION) && o.energy < o.energyCapacity
                    },
                    {
                        find: FIND_MY_STRUCTURES,
                        filter: o => o.structureType === STRUCTURE_TOWER && o.energy < o.energyCapacity * 0.75
                    },
                    {
                        find: FIND_MY_STRUCTURES,
                        filter: o => o.structureType === STRUCTURE_LAB && o.energy < o.energyCapacity
                    },
                    {
                        find: FIND_MY_STRUCTURES,
                        filter: o => o.structureType === STRUCTURE_TERMINAL && o.energy < o.energyCapacity * 0.1
                    },
                    {
                        find: FIND_MY_STRUCTURES,
                        filter: o => (o.structureType === STRUCTURE_STORAGE) && _.sum(o.store) !== o.storeCapacity
                    },
                    {
                        find: FIND_MY_STRUCTURES,
                        filter: o => (o.structureType === STRUCTURE_CONTAINER) && _.sum(o.store) !== o.storeCapacity
                    },
                    {find: FIND_MY_CREEPS, filter: o => o.memory.role == "builder"},
                ];

                let target;
                _.forEach(possibleTargets, o => {
                    target = this.drone.pos.findClosestByPath(this.drone.room.find(o.find, {filter: o.filter}) as any);
                    if (target) return false;
                });

                if (target) {
                    this.drone.memory.deliveryTarget = target.id;
                }
            }

            if (this.drone.memory.deliveryTarget) {
                let deliveryTarget : any = Game.getObjectById(this.drone.memory.deliveryTarget);
                if (!this.drone.pos.isNearTo(deliveryTarget)) {
                    if (this.moveToTargetRoom()) {
                        this.drone.moveTo(deliveryTarget);
                    }
                } else {
                    this.drone.transfer(deliveryTarget, RESOURCE_ENERGY);
                    delete this.drone.memory.deliveryTarget;
                }
            }
        }
    }
}