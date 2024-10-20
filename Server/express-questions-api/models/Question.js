const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    _recordId: { type: Number, required: true },
    companyName: { type: String, required: true },
    _companyId: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String, required: true },
    assignedTo: { type: String, required: false },
    properties: { type: Object, required: false },
    questionDescription: { type: String, required: false }
});

module.exports = mongoose.model('Question', QuestionSchema);
