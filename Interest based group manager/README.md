# Interest Group Manager

A comprehensive web application for managing interest groups, built with Next.js, TypeScript, and MongoDB.

## Features

- **User Authentication**: Secure login and registration system
- **Group Management**: Create, edit, and manage interest groups
- **Member Management**: Handle group memberships and roles
- **Dashboard**: Comprehensive dashboard for users and administrators
- **Notifications**: Real-time notifications for group activities
- **Analytics**: Group analytics and activity tracking
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: Custom JWT-based authentication
- **Deployment**: Vercel-ready configuration

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── groups/           # Group-related pages
│   ├── login/            # Authentication pages
│   └── register/
├── components/           # Reusable React components
│   └── ui/              # shadcn/ui components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── scripts/             # Database and utility scripts
├── styles/              # Global styles
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AkashkrishnanK2023/Interest-group-Manager.git
cd Interest-group-Manager
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/interest-groups
JWT_SECRET=your-jwt-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

4. Initialize the database:
```bash
node scripts/init-db.js
```

5. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `node scripts/init-db.js` - Initialize database with sample data
- `node scripts/create-admin.js` - Create admin user
- `node scripts/check-groups.js` - Check existing groups in database

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy

See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Akash Krishnan K**
- GitHub: [@AkashkrishnanK2023](https://github.com/AkashkrishnanK2023)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)