const Airtable = require('airtable');

// Use environment variables for security (make sure `.env` has the correct values)
const base = new Airtable({ apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN }).base(process.env.AIRTABLE_BASE_ID);

// Helper to convert Airtable record to a Question object
const convertRecordToQuestion = (record) => {
    console.log('Record:', record); // Log the full record to debug
    console.log('Record Fields:', record.fields); // Log the fields to check if it is properly set

    if (!record || !record.fields) {
        console.error('Invalid record or missing fields:', record);
        return {}; // Return an empty object to prevent the crash
    }

    // Safely access fields with nullish coalescing and string fallback
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

// Use Table ID `tbloyD5mIaPRlgh4F` instead of table name "Questions"
// GET all questions
exports.getQuestions = async (req, res) => {
    const questions = [];
    base('tbloyD5mIaPRlgh4F').select({}).eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
            questions.push(convertRecordToQuestion(record));
        });
        fetchNextPage();
    }, (err) => {
        if (err) {
            console.error('Error fetching questions from Airtable:', err); // Log the detailed error
            res.status(500).json({ error: 'Failed to fetch questions', details: err.message });
        } else {
            res.json(questions);
        }
    });
};



exports.addQuestion = async (req, res) => {
    console.log('Incoming request body:', req.body);
    try {
        const fields = {
            "Company Name": req.body.fields.companyName,
            "_companyId": req.body.fields._companyId,
            "Question": req.body.fields.question,
            "Answer": req.body.fields.answer,
            "Created At": req.body.fields.createdAt,
            "Created By": req.body.fields.createdBy,
            "Updated At": req.body.fields.updatedAt,
            "Updated By": req.body.fields.updatedBy,
            "Assigned To": req.body.fields.assignedTo,
            "Properties": JSON.stringify(req.body.fields.properties), // Convert to string if necessary
            "Question Description": req.body.fields.questionDescription
        };

        const createdRecords = await base('tbloyD5mIaPRlgh4F').create([{ fields }]);
        const createdRecord = createdRecords[0]; // Airtable returns an array of created records

        console.log('Created Airtable record:', createdRecord); // Log the created record

        // Send the created record ID and other fields back in the response
        res.status(201).json({
            _recordId: createdRecord.id, // Return the record ID
            companyName: createdRecord.fields["Company Name"],
            _companyId: createdRecord.fields["_companyId"],
            question: createdRecord.fields["Question"],
            answer: createdRecord.fields["Answer"],
            createdAt: createdRecord.fields["Created At"],
            createdBy: createdRecord.fields["Created By"],
            updatedAt: createdRecord.fields["Updated At"],
            updatedBy: createdRecord.fields["Updated By"],
            assignedTo: createdRecord.fields["Assigned To"],
            properties: JSON.parse(createdRecord.fields["Properties"]),
            questionDescription: createdRecord.fields["Question Description"]
        });
    } catch (err) {
        console.error('Error adding question:', err);
        res.status(400).json({ error: 'Failed to add question', details: err.message });
    }
};



// PUT update a question
exports.updateQuestion = async (req, res) => {
    try {
        const fields = {
            "Question": req.body.fields.question,
            "Answer": req.body.fields.answer,
            "Updated At": req.body.fields.updatedAt,
            "Updated By": req.body.fields.updatedBy
        };

        const updatedRecords = await base('tbloyD5mIaPRlgh4F').update([
            {
                id: req.params.id,
                fields
            }
        ]);
        const updatedRecord = updatedRecords[0]; // Access the first (and only) record returned
        console.log('Updated Airtable record:', updatedRecord);
        
        res.json(convertRecordToQuestion(updatedRecord));
    } catch (err) {
        console.error('Error updating question:', err);
        res.status(400).json({ error: 'Failed to update question', details: err.message });
    }
};


// PATCH partial update a question
exports.patchQuestion = async (req, res) => {
    const recordId = req.params.id;
    console.log('Incoming PATCH request:', req.body); // Log the incoming request for debugging
    try {
        const updatedRecord = await base('tbloyD5mIaPRlgh4F').update([
            {
                id: recordId,
                fields: req.body.fields
            }
        ]);
        if (updatedRecord.length > 0) {
            res.json(convertRecordToQuestion(updatedRecord[0]));
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

