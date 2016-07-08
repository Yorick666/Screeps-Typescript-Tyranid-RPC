export let Genus = {
    scout: {
        onlyParts: [MOVE]
    },
    pioneer: {
        onlyParts: [MOVE, WORK, CARRY]
    },
    remoteHarvester: {
        requiredParts: [MOVE, WORK, WORK],
        optionalParts: [MOVE, WORK, WORK],
        perfectParts: [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK]
    },
    harvester: {
        requiredParts: [MOVE, WORK, WORK],
        optionalParts: [MOVE, WORK, WORK],
        perfectParts: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK]
    },
    upgrader: {
        requiredParts: [MOVE, MOVE, CARRY, WORK],
        optionalParts: [WORK, MOVE, WORK, WORK],
        perfectParts: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]
    },
    carrier: {
        requiredParts: [MOVE, CARRY],
        optionalParts: [CARRY],
        perfectParts: [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY]
    },
    remoteCarrier: {
        optionalParts: [MOVE, CARRY, CARRY],
        perfectParts: [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY]
    },
    builder: {
        requiredParts: [MOVE, CARRY, WORK],
        optionalParts: [MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK],
        perfectParts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    remoteBuilder: {
        optionalParts: [MOVE, CARRY, MOVE, CARRY, WORK],
        perfectParts: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    },
    attacker: {
        optionalParts: [MOVE, ATTACK]
    },
    claimer: {
        onlyParts: [MOVE, MOVE, CLAIM, CLAIM]
    },
    remoteReserver: {
        onlyParts: [MOVE, MOVE, MOVE, MOVE, CLAIM, CLAIM]
    },
    tanker: {
        onlyParts: [TOUGH, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE]
    },
    dismantler: {
        optionalParts: [MOVE, WORK]
    },
    tankerHealer: {
        onlyParts: [
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
    },
    remoteDefender: {
        onlyParts: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK]
    },
};