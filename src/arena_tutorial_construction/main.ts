import { createConstructionSite, getObjectsByPrototype } from "game";
import { BuildableStructure, RESOURCE_ENERGY } from "game/constants";
import { ConstructionSite, Creep, Source, Structure, StructureContainer, StructureSpawn, StructureTower } from "game/prototypes";
import { runElseMove } from "tool";

let constructionSite: ConstructionSite<BuildableStructure> | undefined

export function loop() {
  if (!constructionSite)
    constructionSite = createConstructionSite(50, 50, StructureTower as any).object as any
  const creeps = getObjectsByPrototype(Creep)
  const sources = getObjectsByPrototype(Source)
  creeps.forEach(creep => {
    if (creep.store.energy <= 0) {
      const container = getObjectsByPrototype(StructureContainer)[0]
      if (!container) return
      runElseMove(creep, creep.withdraw, container, RESOURCE_ENERGY)
    }
    else if(constructionSite) {
      if (constructionSite.progress === constructionSite.progressTotal) return
      runElseMove(creep, creep.build, constructionSite)
    } else {
      console.log('没有建筑工地！')
    }
  })
}
