import { Flag } from "arena";
import { getObjectsByPrototype } from "game";
import { Creep } from "game/prototypes";

export function loop():void {
  const creeps = getObjectsByPrototype(Creep)
  const flags = getObjectsByPrototype(Flag)

  creeps.forEach(creep => {
    const cflag = creep.findClosestByPath(flags)
    if (!cflag) return
    creep.moveTo(cflag)
  })
}
