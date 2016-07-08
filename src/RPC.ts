export class Biomass implements Energy {
    prototype:Energy;
    amount:number;
    id:string;
    pos:RoomPosition;
    room:Room;
}

export class DigestivePool implements Source{
    private source:Source;

    get pos():RoomPosition {
        return this.source.pos;
    }
    get ticksToRegeneration():number {
        return this.source.ticksToRegeneration;
    }
    get room():Room {
        return this.source.room;
    }
    get id():string {
        return this.source.id;
    }
    get energyCapacity():number {
        return this.source.energyCapacity;
    }
    get energy():number {
        return this.source.energy;
    }
    get prototype():Source {
        return this.source;
    }

    constructor(source: Source){
        this.source = source;
    }
}