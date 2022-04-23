import {getObjectsByPrototype} from 'game/utils';
import {Creep} from 'game/prototypes';
import {Flag} from 'arena/prototypes';

export function loop() {
    var enemyFlag = getObjectsByPrototype(Flag).find(object => !object.my);
    var myCreeps = getObjectsByPrototype(Creep).filter(object => object.my);

    if (!enemyFlag) {
      console.log('❌ 找不到旗帜')
      return
    }

    for(var creep of myCreeps) {
        creep.moveTo(enemyFlag)
    }
}
