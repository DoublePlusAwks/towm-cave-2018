import Chance from 'chance';
import Stage from './Stage';
import * as cerealData from '../data/Cereal/data.json';
import * as aircraftData from '../data/Aircraft/data.json';

chance = Chance();

class Runner {
  constructor() {
    this.data = aircraftData.default;
    this.sinks = {};
    for (let sink of this._getSinks()) {
      const demand = this.data[sink].demand;
      this.sinks[sink] = Math.max(0, Math.round(chance.normal({ mean: demand.avg, dev: demand.dev })));
    }
    this.sources = this._getSources();
    this.amnts = this._getAmnts(this.sinks);
  }

  _getSinks = () => {
    const { data } = this;
    return Object.keys(data).filter(key => data[key].outStages.length === 0);
  }

  _getAmnts = (sinks) => {
    const { data } = this;
    const amnts = {};
    for (let [key, demand] of Object.entries(sinks)) {
      // console.log(data[key]);
      let inStages = data[key].inStages;
      for (let i = 0; i < inStages.length; i++) {
        const curr = inStages[i];
        if (amnts[curr]) {
          amnts[curr] += demand;
        }
        else {
          amnts[curr] = demand;
        }
        inStages.push(...data[curr].inStages);
      }
    }
    return amnts;
  }

  _getSources = () => {
    const { data } = this;
    return Object.keys(data).filter(key => data[key].inStages.length === 0);
  }

  run = () => {
    
  }
}

export default Runner;
