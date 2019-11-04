function createChatInsertQueryValues(data) {
  let queryArray = [];
  let queryValues = '';

  data.map((chat, index) => {
    const values = '(?, ?, ?, ?, ?, ?, ?, ?)';
    const comma = ',\n';

    if (index !== data.length - 1) {
      queryValues += values + comma;
    } else {
      queryValues += values;
    }

    queryArray = queryArray.concat([
      chat.creatorId, chat.time, chat.name, chat.userid,
      chat.subscriber ? 1 : 0, chat.manager ? 1 : 0,
      chat.badges ? JSON.stringify(chat.badges) : null, chat.text
    ]);

    return null;
  });

  return [queryArray, queryValues];
}

module.exports = createChatInsertQueryValues;
