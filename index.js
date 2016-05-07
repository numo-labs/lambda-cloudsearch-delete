require('env2')('.env');
// console.log(process.env)
// var assert = require('assert');
var index = require('taggable-searcher');
const AWS = require('aws-sdk');

console.log('CLOUDSEARCH_ENDPOINT:', process.env.CLOUDSEARCH_ENDPOINT);
var CS = new AWS.CloudSearchDomain({endpoint: process.env.CLOUDSEARCH_ENDPOINT, region: process.env.AWS_REGION});
console.log(CS);

var options = {
  text: 'amenities:ne.',
  size: 8000
};
var records = [];

index.suggest(options, function (err, data) {
  if (err) console.error(err);
  // console.log(JSON.stringify(data, null, 2));
  data.hits.hit.forEach((hit) => {
    records.push({
      type: 'delete',
      id: hit.id
    });
  });
  // console.log(records);
  console.log(data.hits.hit.length);
  var docs = {
    contentType: 'application/json',
    documents: JSON.stringify(records)
  };

  CS.uploadDocuments(docs, function (err, data) {
    console.log(err, data);
  });
});
