# AnswerMe - Audit Dashboard

## Overview
**AnswerMe** is an audit dashboard application designed to efficiently manage and track audit-related questions and answers. It integrates with Airtable as the backend database, making it easy to store, update, and retrieve audit information. The application provides features like adding, editing, deleting, and searching audit questions, along with state management and a streamlined UI.

## Features
- **Add Questions**: Easily add new audit questions and assign them to users.
- **Edit and Update**: Modify existing questions and update details seamlessly.
- **Search and Filter**: Quickly find specific questions using the search bar.
- **Delete Questions**: Remove questions that are no longer relevant.
- **Real-Time Updates**: Integration with Airtable ensures data consistency and up-to-date records.
- **User-Friendly Interface**: Clean and responsive design using Angular and Bootstrap.

## Getting Started

### Prerequisites
To run this application locally, make sure you have the following installed:
- **Node.js** (v14+)
- **Angular CLI**
- **Airtable Account & API Key**
- **npm** (Node Package Manager)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/AnswerMe.git
   cd AnswerMe
   ```

2. **Backend Setup (Express Server)**
   - Navigate to the `Server` directory:
     ```bash
     cd Server
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the root of the `Server` directory and add the following:
     ```env
     AIRTABLE_PERSONAL_ACCESS_TOKEN=your_airtable_token
     AIRTABLE_BASE_ID=your_base_id
     ```
   - Start the server:
     ```bash
     npm start
     ```
   - Your server will be running on `http://localhost:3000`.

3. **Frontend Setup (Angular Application)**
   - Navigate to the `AnswerMeClient` directory:
     ```bash
     cd AnswerMeClient
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the Angular application:
     ```bash
     ng serve
     ```
   - Your frontend application will be running on `http://localhost:4200`.

## Usage

### Adding a New Question
1. Click the **+ Add Question** button on the dashboard.
2. Fill out the necessary fields in the modal.
3. Click **Add** to save the question. The new entry will appear at the start of the list.

### Editing a Question
1. Click the **Edit** button next to the question you want to modify.
2. Update the required fields in the modal.
3. Click **Update** to save your changes.

### Searching and Filtering
1. Use the search bar to type keywords related to your question or answer.
2. The list will automatically update to show matching results.

### Deleting a Question
1. Click the **Delete** button next to the question you want to remove.
2. Confirm the deletion in the prompt.

## API Endpoints

### Base URL:
`http://localhost:3000/api/questions`

### Endpoints
- **GET /questions** - Fetch all questions
- **POST /questions** - Add a new question
- **PUT /questions/:id** - Update a specific question
- **PATCH /questions/:id** - Partially update a question
- **DELETE /questions/:id** - Delete a question

## Code Structure

### Frontend (Angular)
- **Components**
  - `dashboard.component.ts` - Main component displaying the list of questions.
  - `question-modal.component.ts` - Modal for adding and editing questions.
  - `answer-modal.component.ts` - Modal for viewing and updating answers.
- **Services**
  - `question.service.ts` - Handles API calls to the backend.

### Backend (Express)
- **Controllers**
  - `questionController.js` - Handles requests to interact with Airtable.
- **Routes**
  - `questionRoutes.js` - Defines the RESTful routes for API operations.
- **Configuration**
  - `.env` - Stores environment variables like API keys and base IDs.

## Environment Variables
The application relies on the following environment variables:
- **AIRTABLE_PERSONAL_ACCESS_TOKEN**: Your Airtable API key.
- **AIRTABLE_BASE_ID**: The ID of your Airtable base.


## Contact
For further information, issues, or feedback, please contact:
- **Aabhaas Malhotra** - [email@example.com](mailto:email@example.com)

