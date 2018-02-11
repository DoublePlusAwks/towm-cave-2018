import Chance from 'chance';
import Stage from './Stage';
import * as cerealData from '../data/Cereal/data.json';
import * as aircraftData from '../data/Aircraft/data.json';

chance = Chance();

class Runner {
  constructor() {
    this.data = cerealData.default;
    this.sinks = {};
    for (let sink of this._getSinks()) {
      const demand = this.data[sink].demand;
      this.sinks[sink] = Math.max(0, Math.round(chance.normal({ mean: demand.avg, dev: demand.dev })));
    }
    this.sources = this._getSources();
    this.amnts = this._getAmnts(this.sinks);
    this.stages = {};
    for (let [key, value] of Object.entries(this.data)) {
      this.stages[key] = new Stage(value);
    }
  }

  _getSinks = () => {
    const { data } = this;
    return Object.keys(data).filter(key => data[key].outStages.length === 0);
  }

  _getSources = () => {
    const { data } = this;
    return Object.keys(data).filter(key => data[key].inStages.length === 0);
  }

  _getAmnts = (sinks) => {
    const { data } = this;
    const amnts = {};
    for (let [key, demand] of Object.entries(sinks)) {
      amnts[key] = {};
      let inStages = data[key].inStages;
      for (let i = 0; i < inStages.length; i++) {
        const curr = inStages[i];
        if (amnts[key][curr]) {
          amnts[key][curr] += demand;
        }
        else {
          amnts[key][curr] = demand;
        }
        inStages.push(...data[curr].inStages);
      }
    }
    return amnts;
  }

  run = () => {
    const { amnts, stages } = this;
    const sim = {};
    for (let [sink, stgs] of Object.entries(amnts)) {
      sim[sink] = { costs: {}, times: {} };
      for (let [stageKey, amnt] of Object.entries(stgs)) {
        const processingCosts = stages[stageKey].process(amnt);
        sim[sink].costs[stageKey] = processingCosts.cost;
        sim[sink].times[stageKey] = processingCosts.time;
      }
    }
    console.log(sim);
    return sim;
  }
}

export default Runner;
