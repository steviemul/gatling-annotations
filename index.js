const core = require('@actions/core');
const github = require('@actions/github');
const statsParser = require('./src/stats/parser');
const statsReader = require('./src/stats/reader');
const reportGenerator = require('./src/report/generator');
const annotator = require('./src/stats/annotator');

const STATUS_COMPLETED = 'completed';

const buildSummary = (item) => {

  const totalRequests = item.successes + item.failures;

  return `Total Requests : ${totalRequests} - `
   + `Successes : ${item.successes} :white_check_mark: - `
   + `Failures : ${item.failures} :x: - ` 
   + `Avg. Response Time : ${item.avgResponseTime}ms`;
}

const buildReport = (results) => {
  return reportGenerator.generate(results);
};

async function run () {
  const checkName = core.getInput('name') || 'Gatling Report';
  const reportPath = core.getInput('report-path');
  const accessToken = core.getInput('access-token');

  const statsJson = statsReader.readStatsJson(reportPath);

  const results = statsParser.parse(statsJson);

  const pullRequest = github.context.payload.pull_request;
  const head_sha = (pullRequest && pullRequest.head.sha) || github.context.sha;

  const checkRequest = {
    ...github.context.repo,
    name: checkName,
    head_sha,
    status: STATUS_COMPLETED,
    conclusion: results.overall.outcome,
    output: {
      title: checkName,
      summary: buildSummary(results.overall),
      text: buildReport(results),
      annotations: [annotator.createGlobalAnnotation(results, checkName, 'stats.json')]
    }
  };

  try {
    const octokit = github.getOctokit(accessToken);

    await octokit.checks.create(checkRequest);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

try {
  run();
}
catch (error) {
  core.setFailed(error.message);
}