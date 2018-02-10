import math
import json

import pandas as pd

titles = ["Cereal", "Perfume", "Computer", "Aircraft"]

for title in titles:
    sd = pd.read_excel("CAVE_Hackathon_Data.xlsx", sheet_name="{}_SD".format(title))
    ll = pd.read_excel("CAVE_Hackathon_Data.xlsx", sheet_name="{}_LL".format(title))
    
    res = {}
    
    for _, node in sd.iterrows():
        name = node["Stage Name"]
        res[name] = {}
        res[name]["cost"] = node["stageCost"]
        res[name]["relDepth"] = node["relDepth"]
        res[name]["classification"] = node["stageClassification"].upper()
        if not math.isnan(node["avgDemand"]):
            res[name]["demand"] = {"avg": node["avgDemand"], "dev": node["stdDevDemand"]}
        if not math.isnan(node["stageTime_1"]):
            pmf = {}
            for i in range(1, 7):
                if math.isnan(node["stageTime_{}".format(i)]):
                    break
                else:
                    pmf[node["stageTime_{}".format(i)]] = node["stageTime_%_{}".format(i)]
            res[name]["time"] = {"type": "DISCRETE", "mean": node["stageTime"], "pmf": pmf}
        elif not math.isnan(node["stdDev stageTime"]):
            res[name]["time"] = {"type": "NORMAL", "mean": node["stageTime"], "dev": node["stdDev stageTime"]}
        else:
            res[name]["time"] = {"type": "DETERMINISTIC", "mean": node["stageTime"]}
            
        res[name]["outStages"] = ll[ll["sourceStage"] == name]["destinationStage"].tolist()
        res[name]["inStages"] = ll[ll["destinationStage"] == name]["sourceStage"].tolist()
    
    with open("{}/data.json".format(title), "w") as file:
        json.dump(res, file, indent=2)