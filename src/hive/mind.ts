import {HiveTyrant} from "./tyrant";
export class HiveMind {
    
    public static operate():void {
        this.orderMemories();
        this.checkBeacons();
        this.scanWorld();

        this.delegate();
    }

    private static delegate():void {
        _.forEach(Game.rooms, function(room: Room) {
            var tyrant = new HiveTyrant(room);
            tyrant.operate();
        });
    }

    private static orderMemories():void {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        for (var roomName in Memory.rooms) {
            if (!Memory.rooms[roomName].profit) {
                Memory.rooms[roomName].profit = 0;
            }
        }
    }

    private static checkBeacons():void {
        for (var flagName in Game.flags) {
            var flag = Game.flags[flagName];
            if (!flag.memory.sources) {
                flag.memory.sources = flag.room.find(FIND_SOURCES).length;
            }
        }
    }

    private static scanWorld():void {
        for (var roomName in Game.rooms) {
            var room:Room = Game.rooms[roomName];
            if (room) {
                this.scanRoom(room);
            }
        }
    }

    private static scanRoom(room:Room):void {
        var hostileCreeps = room.find(FIND_HOSTILE_CREEPS, {filter: o => o.owner.username == 'Invader'});
        if (hostileCreeps.length > 0) {
            room.memory.secure = false;
            var defended = false;
            for (var flagName in Game.flags) {
                var flag = Game.flags[flagName];
                if (room == flag.room && flagName.indexOf('defender') >= 0) {
                    defended = true;
                    break;
                }
            }
            if (!defended && (!room.controller || room.controller.level < 4)) {
                console.log("The Hive Mind has Detected " + hostileCreeps.length + " invader threats in " + room.name + ".");
                var hostileCreature = hostileCreeps[0] as Creep;
                room.createFlag(hostileCreature.pos, 'E13N21_defender_' + Math.floor((Math.random() * 10000) + 100), COLOR_WHITE, COLOR_WHITE);
            }
        } else {
            room.memory.secure = true;
            for (var flagName in Game.flags) {
                var flag = Game.flags[flagName];
                if (flag.room && room.name == flag.room.name && flagName.indexOf('defender') >= 0 ) {
                    console.log("The Hive Mind has detected no more threats in " + flag.room.name);
                    flag.remove();
                    break;
                }
            }
        }
    }

}