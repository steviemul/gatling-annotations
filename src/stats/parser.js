const FAILURE = 'failure';
const SUCCESS = 'success';

const TYPE_REQUEST = 'REQUEST';

const getRequest = (request) => {

  return {
    name: request.name,
    successes: request.stats.numberOfRequests.ok,
    failures: request.stats.numberOfRequests.ko,
    avgResponseTime: request.stats.meanResponseTime.total
  };
};

const getOutcome = (stats) => {
  return stats.stats.numberOfRequests.ko > 0 ? FAILURE : SUCCESS
};

const parse = (stats) => {

  const results = {
    overall : {
      outcome: getOutcome(stats),
      successes: stats.stats.numberOfRequests.ok,
      failures: stats.stats.numberOfRequests.ko,
      avgResponseTime: stats.stats.meanResponseTime.total
    },
    requests: []
  };

  for (const contentItem of Object.values(stats.contents)) {

    if (contentItem.type == TYPE_REQUEST) {
      results.requests.push(getRequest(contentItem));
    }
  }

  return results;
};

module.exports = {
  parse
};
