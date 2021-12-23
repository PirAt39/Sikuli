const googleapis = require('googleapis');

require('dotenv').config();

const attributeThresholds = {
  'INSULT': 0.75,
  'TOXICITY': 0.75,
  'SPAM': 0.75,
  'INCOHERENT': 0.75,
  'FLIRTATION': 0.75,
};

async function analyzeText(text) {
  const analyzer = new googleapis.commentanalyzer_v1alpha1.Commentanalyzer();

  const requestedAttributes = {};
  for (const key in attributeThresholds) {
    requestedAttributes[key] = {};
  }

  const req = {
    comment: {text: text},
    languages: ['en'],
    requestedAttributes: requestedAttributes,
  };

  const res = await analyzer.comments.analyze({
    key: process.env.API_KEY,
    resource: req},
  );

  data = {};

  for (const key in res['data']['attributeScores']) {
    data[key] =
        res['data']['attributeScores'][key]['summaryScore']['value'] >
        attributeThresholds[key];
  }
  return data;
}

module.exports.analyzeText = analyzeText;
