const { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLInt } = require('graphql');

exports.albumType = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLInt) }
  }
});

exports.albumListType = new GraphQLObjectType({
  name: 'OrderList',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLInt) }
  }
});
