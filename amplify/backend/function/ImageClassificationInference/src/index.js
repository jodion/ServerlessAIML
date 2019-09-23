/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageStorageBucketName = process.env.STORAGE_STORAGE_BUCKETNAME

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const request = require('request').defaults({ encoding: null });
const json = require('json');

const sagemakerruntime = new AWS.SageMakerRuntime({region: process.env.REGION});
const s3 = new AWS.S3();

exports.handler = function (event, context) { //eslint-disable-line
  console.log(event);
  console.log(process.env);

  const s3params = {
    Bucket: process.env.STORAGE_STORAGE_BUCKETNAME,
    Key: 'public/' + event.arguments.key
  };

  s3.getObject(s3params, function (err, data) {
    if (!err) {
      console.log(data);

      const params = {
        Body: data.Body,
        EndpointName: 'hotdog',
        ContentType: "image/jpeg",
        Accept: "application/json"
      };
      console.log(JSON.stringify(params));

      sagemakerruntime.invokeEndpoint(params, function (err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          context.done(err);
        } else {
          const responseData = JSON.parse(Buffer.from(data.Body).toString('utf8'));
          console.log(responseData);

          //const jsonResponse = json.loads(responseData);
          const index = responseData.indexOf(Math.max(...responseData));
          console.log(index);

          const object_categories = ['nothotdog', 'hotdog']

          const result = {
            class: object_categories[index],
            confidence: responseData[index]
          };

          context.done(null, result);
        }
      });
    } else {
      console.log(err);
    }
  });
};