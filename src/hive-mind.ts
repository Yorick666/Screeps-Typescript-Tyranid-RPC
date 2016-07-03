export class HiveMind{

    // public setCreep(creep: Creep) {
    //     this.creep = creep;
    // }
    //
    // public tryHarvest(target: Source): number {
    //     return this.creep.harvest(target);
    // }

    public static orderMemories() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        for (var roomName in Memory.rooms){
            if (!Memory.rooms[roomName].profit) {
                Memory.rooms[roomName].profit = 0;
            }
        }
    }

    public static checkBeacons() {
        for (var flagName in Game.flags){
            var flag = Game.flags[flagName];
            if (!flag.memory.sources){
                flag.memory.sources = flag.room.find(FIND_SOURCES).length;
            }
        }
    }

    public static scanRooms() {
        for (var roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            if (room) {
                this.scanRoom(room);
            }
        }
    }

    private static scanRoom(room: Room) {
        var hostileCreeps = room.find(FIND_HOSTILE_CREEPS, {filter: o => o.owner.username == 'Invader'});
        if (hostileCreeps.length > 0) {
            room.memory.secure = false;
            var defended = false;
            for (var flagName in Game.flags){
                var flag = Game.flags[flagName];
                if (room == flag.room && flagName.indexOf('defender') >= 0){
                    defended = true;
                    break;
                }
            }
            if (!defended && room.name != 'E13N21'){
                console.log("The Hive Mind has Detected " + hostileCreeps.length + " invader threats in " + room.name + ".");
                var hostileCreature = hostileCreeps[0] as Creep;
                room.createFlag(hostileCreature.pos,'E13N21_defender_' + Math.floor((Math.random() * 10000) + 100), COLOR_WHITE, COLOR_WHITE);
            }
        } else {
            var flag = Game.flags[flagName];
            room.memory.secure = true;
            for (var flagName in Game.flags){
                var flag = Game.flags[flagName];
                if (flag.room && room.name == flag.room.name && flagName.indexOf('defender')){
                    console.log("The Hive Mind has detected no more threats in " + flag.room.name);
                    flag.remove();
                    break;
                }
            }
        }
    }

}