const LEVEL_NOTICE = 'notice';
const LEVEL_FAILURE = 'failure';

const buildSummary = (item) => {

  const totalRequests = item.successes + item.failures;

  return `Total Requests : ${totalRequests} - `
   + `Successes : ${item.successes} :white_check_mark: - `
   + `Failures : ${item.failures} :x: - ` 
   + `Avg. Response Time : ${item.avgResponseTime}ms`;
}

const createRequestAnnotation = (request, statsPath) => {

  const level = request.failures == 0 ? LEVEL_NOTICE : LEVEL_FAILURE;

  return {
    path: statsPath,
    start_line: 0,
    end_line: 0,
    annotation_level: level,
    title: request.name,
    message: buildSummary(request)
  }
};

const buildGlobalMessage = (results) => {

  const stats = results.overall;
  const total = stats.successes + stats.failures;

  return `${total} requests executed (${stats.successes} succeeded) (${stats.failures} failed) with an average response time of ${stats.avgResponseTime}ms.`
};

const createGlobalAnnotation = (results, checkName, statsPath) => {

  const level = results.overall.failures == 0 ? LEVEL_NOTICE : LEVEL_FAILURE;

  return {
    path: statsPath,
    start_line: 0,
    end_line: 0,
    annotation_level: level,
    title: `${checkName} Summary`,
    message: buildGlobalMessage(results)
  }
};

const createAnnotations = (results, statsPath) => {
  const annotations = [];

  for (const request of results.requests) {
    annotations.push(createRequestAnnotation(request, statsPath));
  }

  return annotations;
};

module.exports = {
  createAnnotations,
  createGlobalAnnotation
};