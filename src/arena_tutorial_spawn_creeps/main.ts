import { Flag } from "arena";
import { getObjectsByPrototype } from "game";
import { MOVE } from "game/constants";
import { Creep, StructureSpawn } from "game/prototypes";

let creeps: Creep[] = []
let flags: Flag[]

export function loop() {
  if (!flags) {
    flags = getObjectsByPrototype(Flag)
  }
  if (creeps.length < 2) {
    const spawn = getObjectsByPrototype(StructureSpawn).find(spawn => spawn.my)
    const {object: creep, error } = spawn?.spawnCreep([MOVE]) || {}
    if (!creep || error) {
      console.log('spawnCreep:', error)
      return
    }
    (creep as any).target = flags.shift()
    creeps.push(creep)
  }

  creeps.forEach(creep => {
    if (!creep.exists) return

    creep.moveTo((creep as any).target)
  })
}
