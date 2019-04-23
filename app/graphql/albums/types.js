const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInt } = require('graphql');

exports.albumType = new GraphQLObjectType({
  name: 'Album',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    userId: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    title: { type: GraphQLString }
  }
});
