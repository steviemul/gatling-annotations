const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

const templatePath = path.join(__dirname, 'report.template');
const TEMPLATE_CONTENTS = fs.readFileSync(templatePath).toString();

const generate = (results) => {

  const report = mustache.render(TEMPLATE_CONTENTS, results);

  return report;
};

module.exports = {
  generate
};