const simpleAlbum = () => `
query {
  album(id: 1) {
    id
    userId
    title
  }
}`;

const album = {
  userId: 1,
  id: 1,
  title: 'quidem molestiae enim'
};

exports.simpleAlbum = {
  query: simpleAlbum(),
  response: {
    data: { album }
  }
};
