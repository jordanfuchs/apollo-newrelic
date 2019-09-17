const { GraphQLExtension } = require('graphql-extensions');
const newrelic = require('newrelic');

class NewRelicExtension extends GraphQLExtension {
  requestDidStart({ queryString, operationName, variables }) {
    if (operationName === 'IntrospectionQuery') return;

    newrelic.setTransactionName(`graphql.query.${operationName}`);

    let customAttributes = {
      'graphql.queryName': operationName,
      'graphql.queryString': queryString,
    };

    Object.keys(variables).forEach((v) => {
      customAttributes[`graphql.variables.${v}`] = variables[v];
    });

    newrelic.addCustomAttributes(customAttributes);
  }
}

module.exports = NewRelicExtension;
