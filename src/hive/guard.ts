export class HiveGuard {
    private guard:Tower;
    private closestHostileCreep:Creep;

    constructor(guard:Tower) {
        this.guard = guard;
        this.closestHostileCreep = guard.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep;
    }

    public operate() {
        if (!this.attack()) {
            this.repair();
        }
    }

    private attack():boolean {
        if (!this.closestHostileCreep) {
            return false;
        }
        this.guard.attack(this.closestHostileCreep);
        return true;
    }

    private repair() {
        this.repairIfCritical(STRUCTURE_RAMPART, RAMPART_DECAY_AMOUNT + 1);
        this.repairIfCritical(STRUCTURE_ROAD, ROAD_DECAY_AMOUNT + 1);
        this.repairIfCritical(STRUCTURE_WALL, 1);
    }

    private repairIfCritical(structureType:string, criticalLimit:number) {
        var closestTargetInCriticalState = this.guard.pos.findClosestByRange(FIND_STRUCTURES, {filter: e => e.structureType === structureType && e.hits <= criticalLimit}) as Structure;
        if (closestTargetInCriticalState) {
            this.guard.repair(closestTargetInCriticalState);
        }
    }
}