# Premium Dashboard

A luxurious, minimalist dashboard web application with a premium dark theme and matte finish. Built with React, Node.js, and SQLite for local data storage.

## ✨ Features

- **Premium Dark Theme**: Sophisticated dark color palette with matte finish
- **Minimalist Design**: Clean, modern interface with ample whitespace
- **Authentication System**: JWT-based authentication with user registration and login
- **Responsive Layout**: Fully responsive design that works on all devices
- **Dashboard Pages**: Five internal pages (Settings, Assistant, About, Pantry, Nutrition)
- **Local Storage**: SQLite3 database for user data and authentication
- **Modern Technology**: Built with React 18, Vite, Node.js, and Express

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd premium-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in server directory
   cd server
   echo "PORT=5000" > .env
   echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" >> .env
   ```

4. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Project Structure

```
premium-dashboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Auth)
│   │   └── pages/          # Dashboard pages
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── database.sqlite    # SQLite database (created automatically)
│   └── package.json
└── package.json           # Root package.json
```

## 🎨 Design Philosophy

### Color Palette
- **Primary**: Deep blacks and charcoals (#0a0a0a, #111111, #1a1a1a)
- **Secondary**: Dark grays (#2a2a2a, #333333)
- **Accent**: Subtle whites and grays for text and borders
- **Finish**: Matte finish on all interactive elements

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### UI Elements
- **Rounded Corners**: Consistent border-radius on all elements
- **Subtle Shadows**: Layered shadows for depth
- **Hover Effects**: Smooth transitions and scale effects
- **Minimalist Layout**: Clean, uncluttered interface

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- **Registration**: Users can create accounts with username, email, and password
- **Login**: Secure login with email and password
- **Token Storage**: JWT tokens stored in localStorage
- **Protected Routes**: Dashboard accessible only to authenticated users
- **Password Hashing**: bcryptjs for secure password storage

## 📱 Dashboard Pages

### 1. Settings
- User account information
- Application preferences
- Theme settings
- Notification preferences

### 2. Assistant
- AI-powered chat interface
- Placeholder for future AI features
- Real-time messaging simulation

### 3. About
- Application information
- Feature overview
- Technology stack details
- Project statistics

### 4. Pantry
- Food inventory management
- Expiry date tracking
- Category organization
- Add/remove items functionality

### 5. Nutrition
- Daily nutrition tracking
- Calorie and macro counting
- Meal organization
- Progress visualization

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS3**: Custom styling with gradients and animations

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **SQLite3**: Local database
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Database Schema
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

## 🔮 Future Enhancements

### Phase 2 (Planned)
- [ ] MongoDB migration
- [ ] Redux/Zustand state management
- [ ] Advanced AI assistant features
- [ ] Barcode scanning for pantry
- [ ] Recipe suggestions
- [ ] Nutrition analytics
- [ ] User profiles and preferences
- [ ] Data export/import
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Real-time collaboration
- [ ] Cloud synchronization
- [ ] Advanced analytics dashboard
- [ ] Third-party integrations
- [ ] API for external developers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Inter Font**: Google Fonts
- **React Team**: For the amazing framework
- **Vite Team**: For the blazing fast build tool
- **Express.js Team**: For the robust web framework

---

**Built with ❤️ and attention to detail**