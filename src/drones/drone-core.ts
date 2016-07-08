export interface DroneCore {
    operate():void;
}

export class Drone implements DroneCore{

    get role():string {
        return this.drone.memory.role;
    }

    get ticksToLive():number{
        return this.drone.ticksToLive;
    }

    protected drone:Creep;
    protected originRoom:Room;
    protected targetRoom:Room;
    protected targetRoomName:string;

    constructor(drone:Creep) {
        this.drone = drone;
        this.originRoom = Game.rooms[drone.memory.originRoom];
        if (drone.memory.targetRoom) {
            let targetRoom = Game.rooms[drone.memory.targetRoom];
            if (targetRoom) {
                this.targetRoom = targetRoom;
            }
            this.targetRoomName = drone.memory.targetRoom;
        }
    }

    public operate():void {
        this.drone.say('No Logic!');
    }

    protected moveToTargetRoom() :boolean {
        if (this.targetRoomName) {
            if (this.targetRoom) {
                if (this.drone.room.name != this.drone.memory.targetRoom) {
                    this.drone.moveTo(new RoomPosition(25, 25, this.drone.memory.targetRoom));
                } else {
                    return true;
                }
            } else {
                this.drone.moveTo(new RoomPosition(25, 25, this.drone.memory.targetRoom));
            }
        } else {
            if (this.originRoom) {
                if (this.drone.room.name != this.drone.memory.originRoom) {
                    this.drone.moveTo(new RoomPosition(25, 25, this.drone.memory.originRoom));
                } else {
                    return true;
                }
            } else {
                this.drone.moveTo(new RoomPosition(25, 25, this.drone.memory.originRoom));
            }
        }
        return false;
    }
}