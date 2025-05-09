# Campaign Management System Backend

A Node.js backend for managing campaigns and generating personalized outreach messages based on LinkedIn profile data.

## Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB
- AI Integration:
  - Google Gemini API with gemini-2.0-flash model (free tier available)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/campaign-manager

   # AI API key for personalized message generation
   # If not provided, template-based messages will be used

   # Google Gemini API key (free tier available)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   > **Note**: For the personalized message generation, the system uses Google's Gemini API with the gemini-2.0-flash model (which has a free tier). If the API key is not provided or there's an error, the system will fall back to template-based messages.
   >
   > **Getting a Gemini API Key**:
   > 1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   > 2. Sign in with your Google account
   > 3. Click "Create API Key" and follow the instructions
   > 4. Copy the API key and add it to your `.env` file
4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Campaign APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /campaigns | Fetch all campaigns (excluding DELETED) |
| GET | /campaigns/:id | Fetch a single campaign by ID |
| POST | /campaigns | Create a new campaign |
| PUT | /campaigns/:id | Update campaign details (including status) |
| DELETE | /campaigns/:id | Soft delete (set status to DELETED) |

### LinkedIn Message API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /personalized-message | Take LinkedIn profile data as input & return outreach message |

## Example Requests

### Create a Campaign

```
POST /campaigns
Content-Type: application/json

{
  "name": "Campaign 1",
  "description": "This is a campaign to find leads",
  "status": "active",
  "leads": ["https://linkedin.com/in/profile-1", "https://linkedin.com/in/profile-2", "https://linkedin.com/in/profile-3"],
  "accountIDs": ["123", "456"]
}
```

> **Important**: When using Postman or any API client, ensure your JSON is properly formatted. Common JSON syntax errors include:
> - Missing commas between array elements or object properties
> - Trailing commas after the last element (not allowed in JSON)
> - Unquoted property names (all property names must be in double quotes)
> - Single quotes instead of double quotes (JSON requires double quotes)

### Generate Personalized Message

```
POST /personalized-message
Content-Type: application/json

{
  "name": "John Doe",
  "job_title": "Software Engineer",
  "company": "TechCorp",
  "location": "San Francisco, CA",
  "summary": "Experienced in AI & ML..."
}
```

## Testing with Postman

1. Start the server with `npm run dev`
2. Open Postman
3. Create a new request:
   - Set the request type (GET, POST, PUT, DELETE)
   - Enter the URL (e.g., `http://localhost:3000/campaigns`)
   - For POST/PUT requests:
     - Go to the "Headers" tab and add `Content-Type: application/json`
     - Go to the "Body" tab, select "raw", and choose "JSON" from the dropdown
     - Enter your JSON payload
   - Click "Send"

## Build for Production

```
npm run build
npm start
```
