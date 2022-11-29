exports = async function (changeEvent) {
    const doc = changeEvent.fullDocumentBeforeChange;

    const countercollection = context.services.get("MosesQuotes").db(changeEvent.ns.db).collection("pt-counter");

    await countercollection.findOneAndUpdate({ _id: changeEvent.ns }, { $inc: { seq_value: -1 } }, { upsert: true });

    const counterDoc = await countercollection.find({}).toArray();

    if (doc.quoteId == counterDoc[0].seq_value + 1) return console.log(`Deleted document was last in collection`);

    context.services
        .get("MosesQuotes")
        .db(changeEvent.ns.db)
        .collection("pt-quotes")
        .updateMany({ quoteId: { $gt: doc.quoteId } }, { $inc: { quoteId: -1 } }, { multi: true });

    console.log(`Updated documents with id greater than ${doc.quoteId}`);
};