import { } from 'game/utils';
import { Creep, RoomPosition, Source, Structure, StructureConstant, StructureContainer, StructureSpawn } from 'game/prototypes';
import { ERR_NOT_IN_RANGE, ResourceConstant, RESOURCE_ENERGY } from 'game/constants';
import { ScoreCollector } from 'arena';
import { getObjectsByPrototype } from 'game';

export function findBodyPart(creep: Creep, part: string) {
  return creep.body.some(bodyPart => bodyPart.type == part)
}

// 近战程序
export function attackProg(creep: Creep, myCreeps: Creep[], enemyCreeps: Creep[]) {
  const enemyCreep = enemyCreeps[0]
  runElseMove(creep, creep.attack, enemyCreep)
}

// 远程程序
export function rangedAttackProg(creep: Creep, myCreeps: Creep[], enemyCreeps: Creep[]) {
  const enemyCreep = enemyCreeps[0]
  runElseMove(creep, creep.rangedAttack, enemyCreep)
}

// 奶妈程序
export function healProg(creep: Creep, myCreeps: Creep[], enemyCreeps: Creep[]) {
  const myCreep = myCreeps[0]
  runElseMove(creep, creep.heal, myCreep)
}

// 运行 func
export function run(func: (...p: any[]) => any) {
  return func()
}

// 搬运工
export function workCarryProg(creep: Creep, target: Creep | Structure<StructureConstant> | ScoreCollector, mine: ResourceConstant) {
  if (creep.store[RESOURCE_ENERGY] == 0) {
    const mineObjs = getObjectsByPrototype(StructureContainer)
    runElseMove(creep, creep.withdraw, mineObjs[0], mine)
  }
  else {
    runElseMove(creep, creep.transfer, target, mine)
  }
}

/** 矿工 */
export function workerProg(creep: Creep, spawn: StructureSpawn, vein: Source) {
  if (creep.store.getFreeCapacity()) {
    runElseMove(creep, creep.harvest, vein)
  } else {
    runElseMove(creep, creep.transfer, spawn, RESOURCE_ENERGY)
  }
}

/**
 * 运行 func，如果返回了“不在范围内”，就前往 target
 * @param creep 执行任务的爬
 * @param func 执行的操作
 * @param target 目标
 * @param args 执行操作所需的其它参数
 * @returns
 */
export function runElseMove<
  F extends (v: any, ...p: any[]) => any,
  P1 extends Parameters<F>[0],
  PS extends (F extends (v: any, ...p: infer P2) => any ? P2 : never),
>(creep: Creep, func: F, target: P1, ...args: PS) {
  if (func.call(creep, target, ...args) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target)
    return 1
  }
  return 0
}
