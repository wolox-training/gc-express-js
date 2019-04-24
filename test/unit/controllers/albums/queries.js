const albumsName = () => `
query {
  album {
    title
  }
}`;

exports.getAllAlbums = {
  query: albumsName(),
  response: {
    data: { album: null }
  }
};
