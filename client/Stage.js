import Chance from 'chance';
const chance = Chance();

class Stage {
  constructor({ time, inStages, outStages, ...info }) {
    this.time = time;
    this.inProcesses = inStages;
    this.outProcesses = outStages;
    this.info = info;
  }

  process = (prev, amnt) => {
    const next = prev;
    const { info } = this;
    for (var i = 0; i < amnt; i++) {
      next.cost += info.cost;
      next.time += this._sample();
    }
    return next;
  }

  _sample = () => {
    const time = this.time;
    switch(time.type) {
      case 'DETERMINISTIC':
        return time.mean;
      case 'NORMAL':
        return chance.normal({ mean: time.mean, dev: time.dev });
      case 'DIST':
        return chance.weighted(Object.keys(time.pmf), Object.values(time.pmf));
      default:
        return 0;
    }
  }
}

export default Stage;
