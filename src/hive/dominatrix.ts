import {CapillaryTower} from "./capillary-tower";
import {Drone} from "../drones/drone-core";
import {NornQueen} from "./queen";
import {Biomass, DigestivePool} from "../RPC";
import {Pioneer} from "../drones/pioneer";
import {Harvester} from "../drones/harvester";
import {Carrier} from "../drones/carrier";
import {Upgrader} from "../drones/upgrader";
import {Builder} from "../drones/builder";
export class Dominatrix {

    private level:number;
    private room:Room;
    private capillaryTower:CapillaryTower;
    private pools:DigestivePool[];
    private drones:Drone[];
    private queens:NornQueen[];
    private spawnPriority:string[];

    constructor(room:Room) {
        this.room = room;
        this.pools = [];
        this.drones = [];
        this.queens = [];

        let that = this;
        _.forEach(room.find(FIND_MY_CREEPS), function (creep:Creep) {
            switch (creep.memory.role){
                case "pioneer":
                    that.drones.push(new Pioneer(creep));
                    break;
                case "harvester":
                    that.drones.push(new Harvester(creep));
                    break;
                case "carrier":
                    that.drones.push(new Carrier(creep));
                    break;
                case "upgrader":
                    that.drones.push(new Upgrader(creep));
                    break;
                case "builder":
                    that.drones.push(new Builder(creep));
                    break;
                default:
                    creep.say("Unimplemented");
                    that.drones.push(new Drone(creep));
                    break;
            }
        });
        _.forEach(room.find(FIND_SOURCES), function (source:Source) {
            that.pools.push(new DigestivePool(source));
        });
        _.forEach(room.find(FIND_MY_SPAWNS), function (spawn:Spawn) {
            that.queens.push(new NornQueen(spawn));
        });

        if (room.controller) {
            this.level = room.controller.level;
            if (room.storage) {
                this.capillaryTower = new CapillaryTower(room.storage);
            }
        } else {
            this.level = 0;
        }
    }

    public operate() {
        if (this.level > 0) {
            this.generateSpawnPriority();
            this.requestDrones();
        }

        this.delegate();
    }

    private requestDrones() {
        var extensions = this.room.find(FIND_MY_STRUCTURES, {
            filter: function (e) {
                return e.structureType == STRUCTURE_EXTENSION && e.energy == e.energyCapacity;
            }
        });
        if (this.room.memory.spawnTimer == 0 || extensions.length >= 20 || this.room.energyAvailable == this.room.energyCapacityAvailable) {
            var dronesByRole = {};
            
            _.forEach(this.drones, function(drone:Drone){
                var creepRole = drone.role;
                if (!dronesByRole[creepRole]) {
                    dronesByRole[creepRole] = 0;
                }
                if (drone.ticksToLive > 10) {
                    dronesByRole[creepRole]++;
                }
            });

            var spawnOrder = [];
            if (!dronesByRole['pioneer'] && !dronesByRole['harvester'] && !dronesByRole['carrier']) {
                var energies = this.room.find(FIND_DROPPED_RESOURCES, {filter: o => o.resourceType === RESOURCE_ENERGY && o.amount >= 1000});
                if (energies.length > 0) {
                    spawnOrder.push({role: 'carrier', target: false});
                } else {
                    spawnOrder.push({role: 'pioneer', target: false});
                }
            }

            var spawnPriority = this.room.memory.spawnPriority;
            _.forEach(spawnPriority, function(creepRole : string){
                if (dronesByRole[creepRole] == 0 || !dronesByRole[creepRole]) {
                    dronesByRole[creepRole]--;
                    spawnOrder.push({role: creepRole, target: false});
                }
                dronesByRole[creepRole]--;
            });

            // for (var flagName in Game.flags){
            //     var flag = Game.flags[flagName];
            //     if (flagName.includes(this.room.name)){
            //         if (flag.room == undefined) {
            //             var scout = false;
            //             for (let creepName in Game.creeps){
            //                 let creep = Game.creeps[creepName];
            //                 let creepRole = creep.memory.role;
            //                 if(creepRole == 'scout'){
            //                     if (creep.memory.targetRoom != undefined && creep.memory.targetRoom == flagName) {
            //                         scout = true;
            //                         break;
            //                     } else if (creep.memory.targetRoom == undefined) {
            //                         scout = true;
            //                         creep.memory.targetRoom = flagName;
            //                         break;
            //                     }
            //                 }
            //             }
            //             if (!scout){
            //                 spawnOrder.push({ role: 'scout', target: flagName});
            //                 break;
            //             }
            //         } else if(this.room.memory.secure){
            //             var harvester = 0;
            //             var carrier = 0;
            //             var builder = 0;
            //             var defender = 0;
            //             var reserver = 0;
            //             var claimer = 0;
            //             for (let creepName in Game.creeps) {
            //                 let creep = Game.creeps[creepName];
            //                 let creepRole = creep.memory.role;
            //                 if(creepRole == 'remoteHarvester'){
            //                     if (creep.memory.targetRoom != undefined && creep.memory.targetRoom == flag.room.name) {
            //                         harvester++;
            //                     } else if (creep.memory.targetRoom == undefined) {
            //                         harvester++;
            //                         creep.memory.targetRoom = flag.room.name;
            //                     }
            //                 }
            //                 if(creepRole == 'remoteCarrier'){
            //                     if (creep.memory.targetRoom != undefined && creep.memory.targetRoom == flag.room.name) {
            //                         carrier++;
            //                     } else  if (creep.memory.targetRoom == undefined) {
            //                         carrier++;
            //                         creep.memory.targetRoom = flag.room.name;
            //                     }
            //                 }
            //                 if(creepRole == 'remoteDefender'){
            //                     if (creep.memory.targetRoom != undefined && creep.memory.targetRoom == flag.room.name) {
            //                         defender++;
            //                     } else  if (creep.memory.targetRoom == undefined) {
            //                         defender++;
            //                         creep.memory.targetRoom = flag.room.name;
            //                     }
            //                 }
            //                 if(creepRole == 'remoteReserver'){
            //                     if (creep.memory.targetRoom != undefined && creep.memory.targetRoom == flag.room.name) {
            //                         reserver++;
            //                     } else  if (creep.memory.targetRoom == undefined) {
            //                         reserver++;
            //                         creep.memory.targetRoom = flag.room.name;
            //                     }
            //                 }
            //                 if(creepRole == 'claimer'){
            //                     if (creep.memory.targetRoom != undefined && creep.memory.targetRoom == flag.room.name) {
            //                         claimer++;
            //                     } else  if (creep.memory.targetRoom == undefined) {
            //                         claimer++;
            //                         creep.memory.targetRoom = flag.room.name;
            //                     }
            //                 }
            //                 if(creepRole == 'remoteBuilder'){
            //                     if (creep.memory.targetRoom != undefined && creep.memory.targetRoom == flag.room.name) {
            //                         builder++;
            //                     } else  if (creep.memory.targetRoom == undefined) {
            //                         builder++;
            //                         creep.memory.targetRoom = flag.room.name;
            //                     }
            //                 }
            //             }
            //             var sources = flag.memory.sources;
            //             var amount = 1;
            //             if (flag.memory.amount == undefined) {
            //                 flag.memory.amount = amount;
            //             } else {
            //                 amount = flag.memory.amount;
            //             }
            //
            //             if (defender < amount && flagName.includes('defender')) {
            //                 while (defender < amount) {
            //                     spawnOrder.push({ role: 'remoteDefender', target: flag.room.name});
            //                     defender++;
            //                 }
            //             }
            //
            //             if (harvester < sources && flagName.includes('harvester')) {
            //                 while (harvester < sources) {
            //                     spawnOrder.push({ role: 'remoteHarvester', target: flag.room.name});
            //                     harvester++;
            //                 }
            //             }
            //
            //             if ( (carrier < sources || carrier < amount) && flagName.includes('carrier')) {
            //                 while (carrier < sources || carrier < amount) {
            //                     spawnOrder.push({ role: 'remoteCarrier', target: flag.room.name});
            //                     carrier++;
            //                 }
            //             }
            //
            //             if (builder < amount && flagName.includes('builder')) {
            //                 while (builder < amount) {
            //                     spawnOrder.push({ role: 'remoteBuilder', target: flag.room.name});
            //                     builder++;
            //                 }
            //             }
            //
            //             if (reserver < amount && flagName.includes('reserver')) {
            //                 while (reserver < amount) {
            //                     spawnOrder.push({ role: 'remoteReserver', target: flag.room.name});
            //                     reserver++;
            //                 }
            //             }
            //
            //             if (claimer < amount && flagName.includes('claimer')) {
            //                 while (claimer < amount) {
            //                     spawnOrder.push({ role: 'claimer', target: flag.room.name});
            //                     claimer++;
            //                 }
            //             }
            //         }
            //     }
            // }
            if (spawnOrder.length > 0) {
                let i = 0;
                _.forEach(this.queens, function(queen:NornQueen){
                    if (!queen.spawning && queen.spawnDrone(spawnOrder[i]['role'],spawnOrder[i]['target'])) {
                        i++;
                    }
                    if (spawnOrder.length == i) {
                        return;
                    }
                });
            }
        }
    }

    private delegate() {
        _.forEach(this.drones, function(drone:Drone){
            drone.operate();
        });
    }

    private generateSpawnPriorityBeta() {
        this.spawnPriority = [];

        let constructionSites = this.room.find(FIND_CONSTRUCTION_SITES);
        let progress:number = 0;
        let totalProgress:number = 0;
        _.forEach(constructionSites, function (site:ConstructionSite) {
            progress += site.progress;
            totalProgress += site.progressTotal;
        });
        let neededProgress:number = totalProgress - progress;

        let walls = this.room.find(FIND_STRUCTURES, {filter: s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART});
        let totalDurability:number = 0;
        let roomDurability:number = this.room.memory.durability;
        _.forEach(walls, function (structure:Wall | Rampart) {
            totalDurability += structure.hits;
        });
        let avgDurability:number = 0;

        if (walls.length > 0) {
            avgDurability = totalDurability / walls.length;
        }

        let avgNeededDurability = roomDurability - avgDurability;

        console.log("Needed Progess: " + neededProgress);
        console.log("Average Needed Durability: " + avgNeededDurability);
    }

    private generateSpawnPriority() {
        this.spawnPriority = [];
        let digestivePools = this.room.find(FIND_SOURCES);
        var i = 0;
        for (var digestivePool in digestivePools) {
            this.spawnPriority.push('harvester');
            if (i % 2 != 0) {
                this.spawnPriority.push('carrier');
            }
            i++;
        }

        this.spawnPriority.push('builder');

        let droppedBiomass = this.room.find(FIND_DROPPED_RESOURCES, {filter: o => o.resourceType === RESOURCE_ENERGY && o.amount >= 100});
        let totalDroppedBiomass:number = 0;

        _.forEach(droppedBiomass, function (biomass:Biomass) {
            totalDroppedBiomass += biomass.amount;
        });

        if (totalDroppedBiomass > 5000 && digestivePools.length > 1) {
            let count = 0;
            while (totalDroppedBiomass > 5000 && count < digestivePools.length) {
                this.spawnPriority.push('carrier');
                totalDroppedBiomass -= 5000;
                count++;
            }
        }

        for (var digestivePool in digestivePools) {
            this.spawnPriority.push('upgrader');
        }

        let constructionSites = this.room.find(FIND_CONSTRUCTION_SITES);

        if (constructionSites.length) {
            this.spawnPriority.push('builder');
        }

        if (this.capillaryTower) {
            this.spawnPriority.push('carrier');
            if (this.capillaryTower.biomass > 10000) {
                this.spawnPriority.push('upgrader');
            }

            if (this.capillaryTower.biomass > 20000) {
                this.spawnPriority.push('upgrader');
            }

            if (this.capillaryTower.biomass > 5000) {
                this.spawnPriority.push('builder');
            }

            if (this.capillaryTower.biomass > 15000) {
                this.spawnPriority.push('builder');
            }
        }
        this.room.memory.spawnPriority = this.spawnPriority;
    }
}