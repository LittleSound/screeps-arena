import { getObjectsByPrototype } from "game";
import { ATTACK, CARRY, MOVE, TOUGH, WORK } from "game/constants";
import { Creep, Source, StructureSpawn } from "game/prototypes";
import { attackProg, workerProg, run } from "tool";

let spawn: StructureSpawn
let workers: Creep[] = []
let attackers: Creep[] = []
let veins: Source[] = []

export function loop() {
  if (!spawn) spawn = getObjectsByPrototype(StructureSpawn).find(v => v.my) as any
  if (!veins.length) veins = getObjectsByPrototype(Source) as any

  const enemys = getObjectsByPrototype(Creep).filter(v => !v.my)

  const flag = {
    x: 7, y: 7
  }

  run(() => {
    if (spawn) {
      if (workers.length < 3) {
        const worker = spawn.spawnCreep([WORK, CARRY, MOVE])?.object
        if (!worker) return
        workers.push(worker)
      }
      else if (attackers.length < 10) {
        const attacker = spawn.spawnCreep([ATTACK, TOUGH, MOVE, MOVE])?.object
        if (!attacker) return
        attackers.push(attacker)
      }
    }
  })

  console.log('农民，在岗', workers.length, workers.filter(v => v.exists).length)

  workers.forEach(creep => {
    if (!creep.exists) return
    const vein = creep.findClosestByPath(veins)
    if (!vein) return console.log('❌ 没有找到矿脉')
    console.log('👷‍♀️ 挖矿中')
    workerProg(creep, spawn, vein)
  })

  attackers.forEach(creep => {
    if (!creep.exists) return
    if (!enemys || enemys.length === 0) return console.log('❌ 没有敌人')
    const enemy = creep.findClosestByPath(enemys)
    if (!enemy) {
      creep.moveTo(flag)
      return console.log('🔫 前往集结点')
    }
    console.log('🔫 进攻中')
    attackProg(creep, [], [enemy])
  })
}
