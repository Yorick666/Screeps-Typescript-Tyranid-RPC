import {HiveGuard} from "./guard";
import {Dominatrix} from "./dominatrix";
import {NornQueen} from "./queen";
import {DigestivePool} from "../RPC";

export class HiveTyrant {
    private room:Room;
    private guards:HiveGuard[];
    private dominatrix:Dominatrix;

    constructor(room:Room) {
        this.room = room;
        this.guards = [];

        let that = this;
        _.forEach(room.find(FIND_MY_STRUCTURES, {filter: s => s.structureType === STRUCTURE_TOWER}), function (tower:Tower) {
            that.guards.push(new HiveGuard(tower));
        });
        this.dominatrix = new Dominatrix(room);

        if (!room.memory.durability) {
            room.memory.durability = 25000;
        }
    }

    public operate() {
        this.buildRoom();
        this.delegate();
    }

    private delegate() {
        _.forEach(this.guards, function (guard:HiveGuard) {
            guard.operate();
        });

        this.dominatrix.operate();
    }

    private buildRoom() {
        if (!this.room.memory.buildTimer) {
            this.room.memory.buildTimer = 0;
        }
        if (!this.room.memory.roads) {
            this.room.memory.roads = [];
        }
        if (this.room.memory.buildTimer == 0) {
            this.buildInfrastructureAroundQueens()
            this.buildInfrastructureForDigestivePools();
            if(this.room.memory.roads['pools']){
                this.buildInfrastructureForTytant();
                this.room.memory.buildTimer = 100;
            }
        } else {
            this.room.memory.buildTimer--;
        }

        this.placeConstructionSites();

    }

    private placeConstructionSites() {
        let that = this;
        let sites:number = this.room.find(FIND_CONSTRUCTION_SITES).length;
        _.forEach(Game.flags, function (flag:Flag) {
            if (flag.room == that.room && flag.name.indexOf("Flag") > -1) {
                var loc = that.room.lookAt(flag);
                let viable:boolean = true;
                _.forEach(loc, function (lookObject) {
                    if (lookObject.type == "constructionSite" || lookObject.type == "structure") {
                        viable = false;
                        return;
                    }
                });
                if (viable && sites < 20) {
                    var response;
                    if (flag.color == COLOR_BROWN) {
                        response = flag.pos.createConstructionSite(STRUCTURE_ROAD);
                    }
                    if (response == 0) {
                        flag.remove();
                        sites++;
                    } else {
                        console.log("Error with site construction: " + response);
                    }
                }
                if (!viable) {
                    flag.remove();
                }
            }
        });
    }

    private buildInfrastructureForTytant() {
        if (!this.room.memory.roads['controller']) {
            let that = this;
            console.log('Constructing roads for optimal upgrading of Hive Tyrant.');
            _.forEach(this.room.find(FIND_MY_SPAWNS), function (queen:NornQueen) {
                let path = that.buildRoadBetween(queen.pos, that.room.controller.pos);
                // _.forEach(path, function(pos:RoomPosition){
                //     if (pos.inRangeTo(that.room.controller.pos,3)){
                //        
                //     }
                // });
            });
            this.room.memory.roads['controller'] = true;
        }
    }

    private buildInfrastructureAroundQueens() {
        if (!this.room.memory.roads['queens']) {
            let that = this;
            _.forEach(this.room.find(FIND_MY_SPAWNS), function (queen:NornQueen) {
                let x:number = queen.pos.x;
                let y:number = queen.pos.y;
                that.room.createFlag(x + 1, y, null, COLOR_BROWN);
                that.room.createFlag(x - 1, y, null, COLOR_BROWN);
                that.room.createFlag(x, y + 1, null, COLOR_BROWN);
                that.room.createFlag(x, y - 1, null, COLOR_BROWN);
            });
            this.room.memory.roads['queens'] = true;
        }
    }

    private buildInfrastructureForDigestivePools() {
        let that = this;
        let amountOfDigestivePools = this.room.find(FIND_SOURCES).length
        if (amountOfDigestivePools > this.room.find(FIND_STRUCTURES, {filter: s => s.structureType === STRUCTURE_CONTAINER}).length &&
            amountOfDigestivePools > this.room.find(FIND_CONSTRUCTION_SITES, {filter: s => s.structureType === STRUCTURE_CONTAINER}).length) {
            console.log('Constructing storage for optimal harvest of digestive pools.');

            _.forEach(this.room.find(FIND_MY_SPAWNS), function (queen:NornQueen) {
                _.forEach(that.room.find(FIND_SOURCES), function (digestivePool:DigestivePool) {
                    PathFinder.search(queen.pos, {pos: digestivePool.pos, range: 1}, {
                        plainCost: 1,
                        swampCost: 1
                    }).path.pop().createConstructionSite(STRUCTURE_CONTAINER);
                });
            });
        } else if (!this.room.memory.roads['pools']) {
            console.log('Constructing roads for optimal harvest of digestive pools.');
            _.forEach(this.room.find(FIND_MY_SPAWNS), function (queen:NornQueen) {
                _.forEach(that.room.find(FIND_CONSTRUCTION_SITES, {filter: s => s.structureType === STRUCTURE_CONTAINER}), function (site:ConstructionSite) {
                    that.buildRoadBetween(queen.pos, site.pos);
                });
            });
            this.room.memory.roads['pools'] = true;
        }
    }

    private buildRoadBetween(start:RoomPosition, end:RoomPosition):RoomPosition[] {
        let that = this;
        let pf = PathFinder.search(start, {pos: end, range: 1}, {plainCost: 1, swampCost: 1});
        let i:number = 0;
        _.forEach(pf.path, function (pos:RoomPosition) {
            that.room.createFlag(pos, null, COLOR_BROWN);
            // pos.createConstructionSite(STRUCTURE_ROAD);
            i++;
        });
        return pf.path;
    }
}