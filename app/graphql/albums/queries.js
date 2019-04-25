const { GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLID } = require('graphql'),
  { albumType, albumListType } = require('./types'),
  albumService = require('../../services/albums');

exports.album = {
  description: 'it returns a single album with given id',
  type: albumType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: async (obj, root, context, info) => {
    return albumService.getAllAlbums();
  }
};

exports.albums = {
  description: 'it returns a list of albums',
  type: new GraphQLList(albumListType),
  args: {
    userId: { type: GraphQLID },
    leaderId: { type: GraphQLID },
    page: { type: new GraphQLNonNull(GraphQLInt) },
    pageSize: { type: new GraphQLNonNull(GraphQLInt) }
  },
  resolve: async (obj, root, context, info) => {
    return albumService.getAlbums();
  }
};
