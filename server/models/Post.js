const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    onlyfans: {
        type: Boolean,
        default: false,
    },
    fans: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Account',
    }],
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

PostSchema.statics.toAPI = (doc, account) => {
    const ownerId = doc.owner && doc.owner._id ? doc.owner._id : doc.owner;
    const isOwner = !!account && ownerId.toString() === account._id.toString();
    const fans = doc.fans || [];
    const isFan = !!account && fans.some(fan => fan.toString() === account._id.toString());
    const hasAccess = isOwner || isFan;
    const isLocked = doc.onlyfans && !hasAccess;

    return {
        _id: doc._id,
        content: isLocked ? '' : doc.content,
        username: doc.owner && doc.owner.username,
        onlyfans: doc.onlyfans,
        isLocked,
        canDelete: isOwner,
        canPay: doc.onlyfans && !!account && !isOwner && !isFan,
        createdDate: doc.createdDate,
    };
};

module.exports = mongoose.model('Post', PostSchema);
