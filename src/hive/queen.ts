import {Genus} from "../drones/genus";
export class NornQueen {
    get spawning():boolean {
        return !!this.spawn.spawning;
    }

    get pos():RoomPosition {
        return this.spawn.pos;
    }

    private spawn:Spawn;

    constructor(spawn:Spawn) {
        this.spawn = spawn;
    }

    public spawnDrone(role:string, target:string):boolean {
        let bodyparts = this.calculateParts(Genus[role] as string[]);
        if(this.spawn.canCreateCreep(bodyparts) === OK) {
            if (target) {
                console.log("Norn Queen " + this.spawn.name + ' is spawning ' + role + ' drone for ' + target + '.');
                this.spawn.createCreep(bodyparts, undefined, {role: role, originRoom: this.spawn.room.name, targetRoom: target});
            } else {
                console.log("Norn-Queen " + this.spawn.name + ' is spawning ' + role + ' drone.');
                this.spawn.createCreep(bodyparts, undefined, {role: role, originRoom: this.spawn.room.name});
            }
            this.spawn.room.memory.spawnTimer = 50;
            return true;
        }
        return false;
    }

    private calculateParts(genus:string[]):string[] {
        let cost:number = 0;
        let bodyParts = [];
        if (genus['onlyParts']) return genus['onlyParts'] as string[];

        if (genus['perfectParts'] && this.spawn.canCreateCreep(genus['perfectParts'] as string[]) === OK) return genus['perfectParts'] as string[];

        _.forEach(genus['requiredParts'], function(bodypart:string) {
            cost += BODYPART_COST[bodypart] as number;
            bodyParts.push(bodypart);
        });
        
        for (let i = 0; i < genus['optionalParts'].length; i++) {
            var newBodyparts = bodyParts.concat(genus['optionalParts'][i]);

            if (this.spawn.canCreateCreep(newBodyparts) != OK) {
                i = genus['optionalParts'].length;
            } else {
                bodyParts = newBodyparts;
            }
        }
        return bodyParts;
    }
}