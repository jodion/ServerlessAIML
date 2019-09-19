/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getInference = `query GetInference {
  getInference {
    class
    confidence
  }
}
`;
export const getClassificationResult = `query GetClassificationResult($id: ID!) {
  getClassificationResult(id: $id) {
    class
    confidence
  }
}
`;
export const listClassificationResults = `query ListClassificationResults(
  $filter: ModelClassificationResultFilterInput
  $limit: Int
  $nextToken: String
) {
  listClassificationResults(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      class
      confidence
    }
    nextToken
  }
}
`;
