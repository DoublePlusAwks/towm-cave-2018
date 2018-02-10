import * as chance from 'chance';

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
      next.cost += info.stageCost;
      next.time += this._sample();
    }
    return next;
  }

  _sample = () => {
    const time = this.time;
    switch(time.type) {
      case 'DET':
        return time.avg;
      case 'NORM':
        return chance.normal({ mean: time.mean, dev: time.dev });
      case 'DISC':
        return chance.weighted(Object.keys(time.pmf), Object.values(time.pmf));
      default:
        return 0;
    }
  }
}

export default Stage;
