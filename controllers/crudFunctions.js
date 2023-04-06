async function countDocs(model, next) {
  try {
    const count = await model.countDocuments({});
    // Return count and model name as a object for render
    return {
      count,
      name: model.modelName,
    };
  } catch (error) {
    return next(error);
  }
}

async function getAllCollectionDocuments(model, next) {
  try {
    const collection = await model.find({});
    return collection;
  } catch (error) {
    return next(error);
  }
}

async function findDocumentWithID(model, id, next) {
  try {
    const document = await model.findOne({ _id: id });
    return document;
  } catch (error) {
    return next(error);
  }
}

async function getRelatedDocuments(model, field, id, next) {
  try {
    const documents = await model.find({ [field]: id });
    return documents;
  } catch (error) {
    return next(error);
  }
}

async function deleteDocument(model, id, next) {
  try {
    await model.findByIdAndDelete(id);
  } catch (error) {
    return next(error);
  }
}

async function updateDocumentWithID(model, id, res, updated, next) {
  try {
    await model
      .findByIdAndUpdate(id, updated, {})
      .then((updatedDocument) => {
        res.redirect(updatedDocument.url);
      })
      .catch((err) => next(err));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  countDocs,
  getAllCollectionDocuments,
  findDocumentWithID,
  getRelatedDocuments,
  deleteDocument,
  updateDocumentWithID,
};
