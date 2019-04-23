const { GraphQLList, GraphQLString, GraphQLNonNull } = require('graphql'),
  { albumType } = require('./types'),
  { getAlbums } = require('../../services/albums');

exports.album = {
  description: 'it returns all albums',
  type: GraphQLList(albumType),
  resolve: async (obj, root, context, info) => {
    return getAlbums();
  }
};
