import Chance from 'chance';
import Stage from './Stage';
import * as cerealData from '../data/Cereal/data.json';
import * as aircraftData from '../data/Aircraft/data.json';
import * as computerData from '../data/Computer/data.json';
import * as perfumeData from '../data/Perfume/data.json';

chance = Chance();

class Runner {
  constructor(dataFile) {
    this.data = this._loadData(dataFile);
    this.sinks = {};
    for (let sink of this._getSinks()) {
      const demand = this.data[sink].demand;
      this.sinks[sink] = Math.max(0, Math.round(chance.normal({ mean: demand.avg, dev: demand.dev })));
    }
    this.sources = this._getSources();
    [this.amnts, this.sinkAmnts] = this._getAmnts(this.sinks);
    this.stages = {};
    for (let [key, value] of Object.entries(this.data)) {
      this.stages[key] = new Stage(value);
    }
  }

  _loadData = (dataFile) => {
    switch (dataFile) {
      case 'CEREAL':
        return cerealData.default;
        break;
      case 'AIRCRAFT':
        return aircraftData.default;
        break;
      case 'COMPUTER':
        return computerData.default;
        break;
      case 'PERFUME':
        return perfumeData.default;
        break;
      default:
        return {};
        break;
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
    const sinkAmnts = {};
    const amnts = {};
    for (let [key, demand] of Object.entries(sinks)) {
      sinkAmnts[key] = {};
      amnts[key] = demand;
      let inStages = data[key].inStages;
      for (let i = 0; i < inStages.length; i++) {
        const curr = inStages[i];
        if (sinkAmnts[key][curr]) {
          sinkAmnts[key][curr] += demand;
          amnts[curr] += demand;
        }
        else {
          sinkAmnts[key][curr] = demand;
        }
        if (amnts[curr]) {
          amnts[curr] += demand;
        }
        else {
          amnts[curr] = demand;
        }
        inStages.push(...data[curr].inStages);
      }
    }
    return [amnts, sinkAmnts];
  }

  _getTimeDists = (sinks, sources) => {
    const { data } = this;
    const times = {};

    console.log("sources:");
    console.log(sources);

    console.log(sinks);
    for (let node_id in sinks) {
      console.log(node_id);
      this._recTimeDists(sinks, sources, node_id, times);
    }

    return times;
  }


  _recTimeDists = (sinks, sources, node_id, times) => {
    const {data} = this;

    console.log(node_id);
    let time = data[node_id]["time"];

    if (sources.includes(node_id)) {
      console.log("in sources");
      console.log(time);
      if (time["type"] === "DETERMINISTIC") {
        console.log("deterministic");
        times[node_id] = {'mean': time['mean'],
                          'dev': 0};
      }
      else {
        console.log("normal");
        times[node_id] = {'mean': time['mean'],
                          'dev': time['dev']};

      }
      console.log(times[node_id]);
      return times[node_id];
    }

    console.log("not in sources");
    let inStages = data[node_id].inStages;
    console.log(inStages);
    let mean = 0;
    let dev = 0;

    let stageMean = 0;
    let stageDev = 0;

    let maxMean = 0;

    for (let inStage of inStages) {
      console.log(times);
      if (!(inStage in times)) {
        console.log("time to be calculated ");
        console.log(inStage);
        let stageTimeDist = this._recTimeDists(sinks, sources, inStage, times);
        stageMean = stageTimeDist["mean"];
        stageDev = stageTimeDist["dev"];
      }
      else {
        console.log("time already calculated");
        stageMean = times[inStage]['mean'];
        stageDev = times[inStage]['dev'];
      }
      if (stageMean > mean) {
        mean = stageMean;
      }
      if (stageDev > dev) {
        dev = stageDev;
      }
    }

    if (time['type'] === "DETERMINISTIC") {
        times[node_id] = {'mean': mean + time['mean'],
                          'dev': dev};
    }
    else {
      times[node_id] = {'mean': mean + time['mean'],
                        'dev': Math.sqrt(dev*dev + time['dev']*time['dev'])};
    }
    return times[node_id];
  }

  _getSources = () => {
    const { data } = this;
    return Object.keys(data).filter(key => data[key].inStages.length === 0);
  }

  run = () => {
    const { sinkAmnts, stages } = this;
    const sim = {};
    for (let [sink, stgs] of Object.entries(sinkAmnts)) {
      sim[sink] = { costs: {}, times: {} };
      for (let [stageKey, amnt] of Object.entries(stgs)) {
        const processingCosts = stages[stageKey].process(amnt);
        sim[sink].costs[stageKey] = processingCosts.cost;
        sim[sink].times[stageKey] = processingCosts.time;
      }
    }
    return sim;
  }

  run2 = () => {
    const {sinkAmnts, sources} = this;
    return this._getTimeDists(sinkAmnts, sources);
  }
}

export default Runner;
