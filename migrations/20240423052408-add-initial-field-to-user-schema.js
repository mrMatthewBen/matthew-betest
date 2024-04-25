module.exports = {
  up(db) {
    return db.collection('users').updateMany({}, {
      $set: {
        userName: '',
        accountNumber: '',
        emailAddress: '',
        identityNumber: ''
      }
    });
  },

  down(db) {
    return db.collection('users').updateMany({}, {
      $unset: {
        userName: '',
        accountNumber: '',
        emailAddress: '',
        identityNumber: ''
      }
    });
  }
};