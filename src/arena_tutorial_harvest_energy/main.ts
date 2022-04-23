import { getObjectsByPrototype } from "game";
import { RESOURCE_ENERGY } from "game/constants";
import { Creep, Source, StructureSpawn } from "game/prototypes";
import { runElseMove } from "tool";

export function loop() {
  const creeps = getObjectsByPrototype(Creep)
  const sources = getObjectsByPrototype(Source)
  creeps.forEach(creep => {
    if (!creep.store.getFreeCapacity()) {
      const spawn = getObjectsByPrototype(StructureSpawn).find(v => v.my)
      if (!spawn) return
      runElseMove(creep, creep.transfer, spawn, RESOURCE_ENERGY)
    }
    else {
      const csource = creep.findClosestByPath(sources)
      if (!csource) return
      runElseMove(creep, creep.harvest, csource)
    }
  })
}
