function convertToIdArr(idArrOfObjs) {
  if (arguments.length > 1) return [];
  if (!Array.isArray(idArrOfObjs)) return [];
  if (idArrOfObjs.length === 0) return [];

  const idArr = idArrOfObjs.reduce((initialArr, idObj) => {
    return initialArr.concat(idObj._id);
  }, []);

  return idArr;
}

module.exports = { convertToIdArr };
