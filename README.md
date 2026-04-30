# EventPro - Event Organizer Portal MVP

A complete MERN stack (MongoDB, Express, React, Node.js) event management platform with organizer authentication, event creation, and sales dashboard.

## Project Structure

```
├── Cilent En/Event/          # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/            # Admin Login, Dashboard, Create Event
│   │   ├── components/       # AppShell (Layout)
│   │   ├── lib/              # API calls & Auth utilities
│   │   ├── routes/           # Protected Routes
│   │   └── App.jsx           # Main App component
│   └── package.json
│
├── Server En/                 # Node.js/Express Backend
│   ├── controllers/          # API request handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── middleware/           # JWT authentication
│   ├── utils/                # Helper functions
│   ├── index.js              # Server entry point
│   └── package.json
│
└── README.md                  # This file
```

## Features

✅ **Admin Authentication**
- Secure login with JWT tokens
- Password hashing with bcrypt
- Session management

✅ **Event Management**
- Create events with detailed information
- Organizer-specific event dashboard
- Real-time event status tracking

✅ **Analytics Dashboard**
- Total revenue calculation
- Tickets sold tracking
- Event performance metrics
- Visual progress indicators

✅ **Responsive UI**
- Clean, modern design (matches provided designs)
- Standard CSS styling (no frameworks)
- Sidebar navigation
- Mobile-responsive layout

## Technology Stack

### Frontend
- React 19.2.5
- React Router DOM 7.14.2
- Vite 8.0.10
- Standard CSS

### Backend
- Node.js + Express 5.2.1
- MongoDB + Mongoose 7.0.0
- JWT (JSON Web Tokens)
- Bcrypt for password hashing

### Database
- MongoDB (Local or MongoDB Atlas)

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or MongoDB Atlas account)

### Step 1: Setup Database

#### Option A: MongoDB Atlas (Cloud - Recommended for MVP)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Update `Server En/.env`:
   ```
   your datbase connection
   ```

#### Option B: Local MongoDB
1. **Windows**: Download from https://www.mongodb.com/try/download/community
2. **macOS**: `brew install mongodb-community`
3. **Linux**: Follow https://docs.mongodb.com/manual/installation/
4. Start MongoDB:
   ```
   # Windows
   mongod --dbpath "C:\data\db"
   
   # macOS/Linux
   mongod --dbpath /usr/local/var/mongodb
   ```
5. Use default connection in `.env`:
   ```
  
   ```
0.0.0.0
#### Option C: Docker (If Docker Desktop is installed)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 2: Setup Backend

```bash
cd "Server En"
npm install

# Edit .env file with your MongoDB connection string
# MONGO_URI=...

npm start
# Server runs on the localhost
```

### Step 3: Setup Frontend

```bash
cd "Cilent En/Event"
npm install
npm run dev
# Frontend runs on on the lloocal host
```

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb
PORT=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## Database Models

### Organizer
```javascript
{
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### Event
```javascript
{
  organizerId: ObjectId (ref),
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  location: String,
  ticketPrice: Number,
  totalCapacity: Number,
  ticketsSold: Number (default: 0),
  status: String (Draft|On Sale|Sold Out),
  timestamps: true
}
```

## Usage Flow

1. **Login**: Navigate to `/admin/login`
   - Enter credentials: 
   - JWT token saved to localStorage

2. **Dashboard**: View overview and active events
   - See total revenue and tickets sold
   - View all created events
   - Track event status and sales

3. **Create Event**: Click "+ New Event"
   - Fill in event details, dates, location
   - Set ticket price and quantity
   - Click "Publish Event"

4. **Logout**: Click logout button in sidebar

## Styling

- No CSS framework (Tailwind, Bootstrap)
- Pure CSS with CSS custom properties (CSS variables)
- Matches provided UI designs exactly
- Mobile responsive media queries included

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running (check Option A/B/C above)
- Verify MONGO_URI in `.env`
- Check MongoDB is accessible on the configured port

### Port Already in Use
```bash
# Find and kill process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### CORS Errors
- Ensure backend server is running
- Check VITE_API_URL in frontend `.env`
- Verify backend has cors() middleware enabled

### Login Not Working
- Check admin credentials in `.env`
- Verify MongoDB connection is active
- Check browser console for error messages

## Development Notes

- JWT expires in 7 days
- Passwords hashed with bcrypt (10 rounds)
- Date format: ISO 8601 (datetime-local HTML5 input)
- All API responses include error messages
- Protected routes redirect to login if not authenticated

## Building for Production

### Frontend
```bash
cd "Cilent En/Event"
npm run build
# Output in dist/ directory
```

### Backend
```bash
cd "Server En"
# Update .env with production values
npm start
```

## Performance & Scalability

For production deployment:
1. Use MongoDB Atlas or managed MongoDB
2. Implement request rate limiting
3. Add database indexing for queries
4. Enable caching strategies
5. Use environment-specific configurations
6. Implement input validation & sanitization

## Security Checklist

- [ ] Change JWT_SECRET to long random string
- [ ] Update admin credentials
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Enable HTTPS in production
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Add helmet.js for security headers
- [ ] Validate all user inputs

## License

MIT

## Support

For setup issues, ensure:
1. Node.js version >= 14
2. MongoDB is running and accessible
3. All .env files are properly configured
4. Both servers are on correct ports (5000, 5173)
5. Check browser console and server logs for errors
