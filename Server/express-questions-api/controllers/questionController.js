const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);

// Helper function to map fields from request to Airtable format
const mapFieldsToAirtable = (fields) => ({
    "Company Name": fields.companyName ?? '',
    "_companyId": fields._companyId ?? '',
    "Question": fields.question ?? '',
    "Answer": fields.answer ?? '',
    "Created At": fields.createdAt ?? '',
    "Created By": fields.createdBy ?? '',
    "Updated At": fields.updatedAt ?? '',
    "Updated By": fields.updatedBy ?? '',
    "Assigned To": fields.assignedTo ?? '',
    "Properties": typeof fields.properties === 'object' ? JSON.stringify(fields.properties) : fields.properties,
    "Question Description": fields.questionDescription ?? ''
});

// Helper to convert Airtable record to a Question object
const convertRecordToQuestion = (record) => {
    if (!record || !record.fields) {
        console.error('Invalid record or missing fields:', record);
        return {}; // Return an empty object to prevent the crash
    }

    const fields = record.fields;
    return {
        _recordId: record.id,
        companyName: fields['Company Name'] ?? '',
        _companyId: fields['_companyId'] ?? '',
        question: fields['Question'] ?? '',
        answer: fields['Answer'] ?? '',
        createdAt: fields['Created At'] ?? '',
        createdBy: fields['Created By'] ?? '',
        updatedAt: fields['Updated At'] ?? '',
        updatedBy: fields['Updated By'] ?? '',
        assignedTo: fields['Assigned To'] ?? '',
        properties: fields['Properties'] ?? '',
        questionDescription: fields['Question Description'] ?? ''
    };
};

// Clean payload by removing undefined or empty values
const cleanFields = (fields) => {
    return Object.fromEntries(
        Object.entries(fields).filter(([_, value]) => value !== '' && value !== undefined)
    );
};

// GET all questions
exports.getQuestions = async (req, res) => {
    const questions = [];
    base('tbloyD5mIaPRlgh4F').select({}).eachPage(
        (records, fetchNextPage) => {
            records.forEach((record) => questions.push(convertRecordToQuestion(record)));
            fetchNextPage();
        },
        (err) => {
            if (err) {
                console.error('Error fetching questions from Airtable:', err);
                res.status(500).json({ error: 'Failed to fetch questions', details: err.message });
            } else {
                res.json(questions);
            }
        }
    );
};

// POST a new question with bulk assignment handling
exports.addQuestion = async (req, res) => {
    console.log('Incoming request body:', req.body);
    try {
        const fields = mapFieldsToAirtable(req.body.fields);

        // Check if "Assigned To" has values
        const assignedToUsers = fields["Assigned To"] ? fields["Assigned To"].split(',').map(user => user.trim()) : [];

        const createdRecords = [];
        if (assignedToUsers.length === 0) {
            // If no assigned users, just create one record without assigning
            const records = await base('tbloyD5mIaPRlgh4F').create([{ fields }]);
            createdRecords.push(...records);
        } else {
            // Create a record for each assigned user
            for (let user of assignedToUsers) {
                const newFields = { ...fields, "Assigned To": user };
                const records = await base('tbloyD5mIaPRlgh4F').create([{ fields: newFields }]);
                createdRecords.push(...records);
            }
        }

        const response = createdRecords.map(convertRecordToQuestion);
        console.log('Created Airtable records:', response);
        res.status(201).json(response); // Return all created records
    } catch (err) {
        console.error('Error adding question:', err);
        res.status(400).json({ error: 'Failed to add question', details: err.message });
    }
};

// PUT update a question with bulk assignment handling
exports.updateQuestion = async (req, res) => {
    try {
        console.log('Incoming Request Payload:', req.body);
        const fields = cleanFields(mapFieldsToAirtable(req.body.fields));

        // If updating the `Assigned To` field, handle multiple users
        const assignedToUsers = fields["Assigned To"].split(',').map(user => user.trim());

        const updatedRecords = [];
        for (let user of assignedToUsers) {
            const newFields = { ...fields, "Assigned To": user };
            const records = await base('tbloyD5mIaPRlgh4F').update([
                { id: req.params.id, fields: newFields }
            ]);
            updatedRecords.push(...records);
        }

        const response = updatedRecords.map(convertRecordToQuestion);
        console.log('Updated Airtable records:', response);
        res.json(response); // Return all updated records
    } catch (err) {
        console.error('Error updating question:', err);
        res.status(400).json({ error: 'Failed to update question', details: err.message });
    }
};

// PATCH partial update a question
exports.patchQuestion = async (req, res) => {
    const recordId = req.params.id;
    console.log('Incoming PATCH request:', req.body);
    try {
        const fields = cleanFields(mapFieldsToAirtable(req.body.fields));
        console.log('Fields to patch:', fields);
        const updatedRecords = await base('tbloyD5mIaPRlgh4F').update([{ id: recordId, fields }]);
        if (updatedRecords.length > 0) {
            const updatedRecord = updatedRecords[0];
            console.log('Patched Airtable record:', updatedRecord);
            res.json(convertRecordToQuestion(updatedRecord));
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (err) {
        console.error('Error patching question:', err);
        res.status(400).json({ error: 'Failed to patch question', details: err.message });
    }
};

// DELETE a question
exports.deleteQuestion = async (req, res) => {
    const recordId = req.params.id;
    try {
        await base('tbloyD5mIaPRlgh4F').destroy(recordId);
        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        console.error('Error deleting question:', err);
        res.status(400).json({ error: 'Failed to delete question', details: err.message });
    }
};
