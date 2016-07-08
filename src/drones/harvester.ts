import {Drone} from "./drone-core";
export class Harvester extends Drone{

    public operate() {
        if (this.moveToTargetRoom()) {
            this.harvest();
        }
    }

    private harvest() {
        if(!this.drone.memory.digestivePool) {
            this.lookForDigestivePool();
        }

        let digestivePool : any = Game.getObjectById(this.drone.memory.digestivePool);
        if(digestivePool){
            if (this.drone.harvest(digestivePool) == ERR_NOT_IN_RANGE) {
                let containers = digestivePool.pos.findInRange(FIND_STRUCTURES,1,{filter: s => s.structureType == STRUCTURE_CONTAINER});
                if (containers.length > 0) {
                    this.drone.moveTo(containers[0]);
                } else {
                    this.drone.moveTo(digestivePool);
                }
            }

        }
    }

    private lookForDigestivePool(){
        let harvestersWithAssignedDigestivePool = _.filter(Game.creeps, c => c.memory.role === 'harvester' && c.memory.digestivePool);

        let unclaimedDigestivePools = this.drone.room.find(FIND_SOURCES);

        _.forEach(harvestersWithAssignedDigestivePool, function(c) {
            let digestivePool = Game.getObjectById(c.memory.digestivePool);
            _.pull(unclaimedDigestivePools, digestivePool);
        });

        let closestDigestivePool : any = this.drone.pos.findClosestByPath(unclaimedDigestivePools as any);
        if(closestDigestivePool){
            this.drone.memory.digestivePool = closestDigestivePool.id;
        }
    }
}