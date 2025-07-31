# 🗄️ Backend Structure - Interest Group Manager

## 📍 **Backend Location**
The backend is stored in: `c:\Users\hp\Desktop\AKASH\Certificates\interest-group-manager (1)`

This is a **Next.js Full-Stack Application** where the backend and frontend are integrated in the same project.

---

## 🏗️ **Backend Architecture**

### **Framework**: Next.js 14 with App Router
- **Type**: Full-stack React framework
- **API Routes**: Server-side API endpoints
- **Database**: MongoDB with connection pooling
- **Authentication**: JWT-based authentication

---

## 📂 **Backend Directory Structure**

```
📁 app/api/                          # 🔥 MAIN BACKEND FOLDER
├── 📁 auth/                         # Authentication endpoints
│   ├── 📁 login/
│   │   └── route.ts                 # POST /api/auth/login
│   └── 📁 register/
│       └── route.ts                 # POST /api/auth/register
│
├── 📁 groups/                       # Group management endpoints
│   ├── route.ts                     # GET/POST /api/groups
│   └── 📁 [id]/                     # Dynamic group routes
│       ├── route.ts                 # GET/PUT/DELETE /api/groups/[id]
│       ├── 📁 activities/
│       │   └── route.ts             # GET /api/groups/[id]/activities
│       ├── 📁 analytics/
│       │   └── route.ts             # GET /api/groups/[id]/analytics
│       ├── 📁 join/
│       │   └── route.ts             # POST /api/groups/[id]/join
│       ├── 📁 leave/
│       │   └── route.ts             # POST /api/groups/[id]/leave
│       └── 📁 members/               # Member management
│           ├── route.ts             # GET /api/groups/[id]/members
│           └── 📁 [memberId]/
│               ├── route.ts         # DELETE /api/groups/[id]/members/[memberId]
│               ├── 📁 approve/
│               │   └── route.ts     # POST /api/groups/[id]/members/[memberId]/approve
│               └── 📁 promote/
│                   └── route.ts     # POST /api/groups/[id]/members/[memberId]/promote
│
├── 📁 notifications/                # Notification endpoints
│   ├── route.ts                     # GET/POST /api/notifications
│   └── 📁 [id]/
│       └── 📁 read/
│           └── route.ts             # POST /api/notifications/[id]/read
│
└── 📁 user/                         # User-specific endpoints
    └── 📁 dashboard/
        └── route.ts                 # GET /api/user/dashboard
```

---

## 🛠️ **Backend Support Files**

```
📁 lib/                              # 🔧 BACKEND UTILITIES
├── mongodb.ts                       # Database connection & configuration
├── auth.ts                          # JWT authentication utilities
├── mock-db.ts                       # Mock database for development
└── api.ts                           # API helper functions

📁 types/                            # 📝 TYPE DEFINITIONS
└── index.ts                         # TypeScript interfaces & types

📁 scripts/                          # 🚀 DATABASE SCRIPTS
├── init-db.js                       # Initialize database
├── create-admin.js                  # Create admin user
├── add-more-groups.js               # Add sample groups
├── add-sample-members.js            # Add sample members
├── admin-status.js                  # Check admin status
├── check-groups.js                  # List all groups
├── database-summary.js              # Database overview
└── final-status.js                  # Complete status check
```

---

## 🗃️ **Database Storage**

### **Primary Database**: MongoDB
- **Location**: `mongodb://localhost:27017` (local) or MongoDB Atlas (cloud)
- **Database Name**: `interest-groups`
- **Collections**:
  - `users` - User accounts and profiles
  - `groups` - Interest groups data
  - `memberships` - User-group relationships
  - `notifications` - User notifications
  - `group_activities` - Group activity logs

### **Fallback Database**: Mock Database
- **Location**: `lib/mock-db.ts`
- **Purpose**: Development fallback when MongoDB is unavailable
- **Storage**: In-memory arrays

---

## 🔌 **API Endpoints Overview**

### **Authentication APIs**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### **Group Management APIs**
- `GET /api/groups` - List all groups
- `POST /api/groups` - Create new group
- `GET /api/groups/[id]` - Get group details
- `PUT /api/groups/[id]` - Update group
- `DELETE /api/groups/[id]` - Delete group

### **Group Membership APIs**
- `POST /api/groups/[id]/join` - Join group
- `POST /api/groups/[id]/leave` - Leave group
- `GET /api/groups/[id]/members` - Get group members
- `DELETE /api/groups/[id]/members/[memberId]` - Remove member
- `POST /api/groups/[id]/members/[memberId]/approve` - Approve member
- `POST /api/groups/[id]/members/[memberId]/promote` - Promote to moderator

### **Analytics & Activity APIs**
- `GET /api/groups/[id]/analytics` - Group analytics
- `GET /api/groups/[id]/activities` - Group activity feed

### **User & Notification APIs**
- `GET /api/user/dashboard` - User dashboard data
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/[id]/read` - Mark notification as read

---

## 🔐 **Security & Authentication**

### **JWT Authentication**
- **Location**: `lib/auth.ts`
- **Token Storage**: HTTP-only cookies (recommended) or localStorage
- **Middleware**: Built into each API route

### **Database Security**
- **Connection**: Secure MongoDB connection with authentication
- **Validation**: Input validation on all endpoints
- **Authorization**: Role-based access control (Admin, Moderator, Member)

---

## 🚀 **How to Access Backend**

### **Development Server**
```bash
npm run dev
# Backend available at: http://localhost:3000/api/*
```

### **API Testing**
```bash
# Test admin login
npm run admin-status

# Check database
npm run db-summary

# Test group details
node scripts/test-group-details.js
```

### **Database Management**
```bash
# Initialize database
npm run init-db

# Add sample data
npm run add-groups
npm run add-members

# Check status
npm run final-status
```

---

## 📊 **Current Backend Status**

✅ **Fully Functional Backend with:**
- 16 API endpoints
- MongoDB integration
- JWT authentication
- Member management
- Group analytics
- Real-time notifications
- Role-based permissions
- Comprehensive error handling

✅ **Database Contains:**
- 9 users (including admin)
- 46 groups across 11 categories
- 259 memberships (206 approved, 53 pending)
- Full relational data structure

---

## 🎯 **Backend Access Points**

**Main Backend Folder**: `app/api/`
**Database Config**: `lib/mongodb.ts`
**Authentication**: `lib/auth.ts`
**API Base URL**: `http://localhost:3000/api/`
**Admin Credentials**: `admin` / `admin123`

The backend is fully integrated with the frontend and provides a complete REST API for the Interest Group Manager application!