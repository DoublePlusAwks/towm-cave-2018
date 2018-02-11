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

  _getTimeDists = (sinks, sources) => {
    const { data } = this;
    const times = {};

    for node_id in Object.entries(sinks) {
      _recTimeDists(sinks, sources, node_id, times);
    }
  }


  _recTimeDists = (sinks, sources, node_id, times) => {
    const {data} = this;

    let time = data[node_id][time];

    if (node_id in sources) {
      if (time[type] == "DETERMINISTIC") {
        times[node_id] = {'mean': time[mean],
                          'dev': 0};
      }
      else {
        times[node_id] = {'mean': time[mean],
                          'dev': time[dev]};
      }
      return times[node_id];
    }
    let inStages = data[node_id].inStages;
    let mean = 0;
    let dev = 0;

    let stageMean = 0;
    let stageDev = 0;

    let maxMean = 0;

    for (inStage in inStages) {
      if (!(inStage in times)) {
        stageTimeDist = _recTimeDists(sinks, sources, inStage, times);
        stageMean = stageTimeDist["mean"];
        stageDev = stageTimeDist["dev"];
      }
      else {
        stageMean = times[inStage][mean];
        stageDev = times[inStage][dev];
      }
      if (stageMean > mean) {
        mean = stageMean;
      }
      if (stageDev > dev) {
        dev = stageDev;
      }
    }

    if (time[type] == "DETERMINISTIC") {
        times[node_id] = {'mean': mean + time[mean],
                          'dev': dev};
    }
    else {
      times[node_id] = {'mean': mean + time[mean],
                        'dev': Math.sqrt(dev*dev + time[dev]*time[dev])};
    }
    return times[node_id];
  }

  _getSources = () => {
    const { data } = this;
    return Object.keys(data).filter(key => data[key].inStages.length === 0);
  }

  run = () => {
    
  }
}

export default Runner;
