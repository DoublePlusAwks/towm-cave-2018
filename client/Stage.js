import Chance from 'chance';
const chance = Chance();

class Stage {
  constructor({ time, inStages, outStages, ...info }) {
    this.time = time;
    this.inProcesses = inStages;
    this.outProcesses = outStages;
    this.info = info;
  }

  process = (amnt) => {
    const { info } = this;
    const processingCosts = { cost: 0, time: 0 };
    for (var i = 0; i < amnt; i++) {
      processingCosts.cost += info.cost;
      processingCosts.time += this._sample();
    }
    return processingCosts;
  }

  _sample = () => {
    const time = this.time;
    switch(time.type) {
      case 'DETERMINISTIC':
        return time.mean;
      case 'NORMAL':
        return chance.normal({ mean: time.mean, dev: time.dev });
      case 'DISCRETE':
        return parseFloat(chance.weighted(Object.keys(time.pmf), Object.values(time.pmf)));
      default:
        return -1;
    }
  }
}

export default Stage;
