const fs = require('fs');
const glob = require('glob');

const STATS_FILE = 'stats.json';

const readStatsJson = (reportsRootPattern) => {

  const statsPath = reportsRootPattern + '/' + STATS_FILE;

  const statsFiles = glob.sync(statsPath);

  if (statsFiles.length == 0) {
    throw new Error(`No stats files found for path ${statsPath}`);
  }

  if (statsFiles.length > 1) {
    throw new Error(`Found ${statsFiles.length} stats files, expecting 1`);
  }
  
  const statsFile = statsFiles[0];

  const statsReport = fs.readFileSync(statsFile);

  return JSON.parse(statsReport);
};

module.exports = {
  readStatsJson
};