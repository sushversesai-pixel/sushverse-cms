# 🎯 Sushverse CMS - Advanced Content Management System

A powerful, modern Content Management System built with Next.js, React, TypeScript, and Tailwind CSS. Features dark mode, theme switching, real-time Firebase integration, and comprehensive content management capabilities.

## 🚀 Live Demo

[View Live CMS](https://sushverse-cms.vercel.app)

## ✨ Features

- **Advanced Content Management** - Create, edit, publish, and organize content
- **Rich Text Editing** - React Quill for professional content formatting
- **Real-Time Synchronization** - Firebase Firestore for instant updates
- **Dark Mode & Themes** - Next-themes with automatic light/dark switching
- **RSS Feed Management** - Import and manage RSS feeds
- **User Authentication** - Secure Firebase authentication
- **Responsive UI** - Beautiful design with Lucide React icons
- **Modern Animations** - Smooth transitions with Framer Motion
- **SEO Optimized** - Built-in SEO features for content
- **TypeScript Support** - Full type safety and better DX
- **Tailwind CSS** - Utility-first, customizable styling

## 🛠 Tech Stack

### Frontend
- **React 19.2.4** - Component-based UI library
- **Next.js 16.2.4** - React framework with SSR and SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework

### Libraries & Tools
- **next-themes 0.4.6** - Theme management (light/dark mode)
- **Framer Motion 12.38.0** - Smooth animations
- **Lucide React 1.14.0** - Beautiful icon library
- **React Quill** - Rich text editor
- **RSS Parser 3.13.0** - Parse RSS feeds
- **Cheerio 1.2.0** - jQuery-like syntax for parsing

### Backend & Database
- **Firebase 12.12.1** - Authentication, Firestore, Hosting
- **Vercel** - Deployment and hosting

## 📋 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sushversesai-pixel/sushverse-cms.git
   cd sushverse-cms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**:
   Visit `http://localhost:3000`

## 💻 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 📁 Project Structure

```
sushverse-cms/
├── app/
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── Navbar.tsx         # Navigation bar
│   ├── Editor.tsx         # Content editor
│   ├── Preview.tsx        # Content preview
│   └── ThemeToggle.tsx    # Dark mode toggle
├── lib/
│   ├── firebase.ts        # Firebase configuration
│   ├── api.ts            # API utility functions
│   └── types.ts          # TypeScript types
├── styles/               # Global styles
├── public/              # Static assets
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies
└── README.md            # Documentation
```

## 🎯 Core Features

### Content Management Dashboard
- Overview of all published and draft content
- Quick access to frequently used sections
- Analytics and statistics

### Article/Post Management
- Create new articles with rich formatting
- Edit existing content
- Schedule publication dates
- Save as drafts or publish immediately
- Categorize and tag content

### Media Management
- Upload and organize images
- Manage media library
- Insert media into articles

### RSS Feed Management
- Add new RSS feed sources
- Configure feed settings
- Manage feed refresh intervals
- Review and publish feed items

### User Management
- User authentication with Firebase
- Role-based access control
- User permissions management
- Activity logging

### Theme & Appearance
- Light/dark mode toggle
- Automatic theme switching based on system preferences
- Custom theme configuration
- Responsive design for all devices

## 🎨 Customization

### Dark Mode Configuration

The CMS uses `next-themes` for seamless dark mode support:

```typescript
// Components automatically support dark mode with Tailwind classes
<div className="bg-white dark:bg-slate-900">
  // Your content
</div>
```

### Tailwind CSS Customization

Update `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      },
    },
  },
};
```

### Add Custom Components

Create new components in `components/`:

```typescript
// components/CustomSection.tsx
export default function CustomSection() {
  return (
    <section className="py-8 px-4">
      {/* Your component content */}
    </section>
  );
}
```

### Firebase Configuration

Update Firebase settings in `lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... other config
};
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Import in Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Add environment variables
   - Click "Deploy"

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
npm run build
firebase deploy
```

### Deploy to Netlify

1. Build the project: `npm run build`
2. Connect your GitHub repo to Netlify
3. Set environment variables
4. Deploy

## 📊 Usage Guide

### Creating Content

1. Navigate to "New Article"
2. Enter title and content
3. Use the rich text editor for formatting
4. Add tags and categories
5. Click "Publish" or "Save Draft"

### Managing Feeds

1. Go to "Feed Settings"
2. Add new RSS feed URL
3. Configure update frequency
4. Review and manage feed items

### Theme Management

- Click the theme toggle in the navbar
- Automatic switching based on system preference
- Persistent theme selection

### User Permissions

1. Access "User Management"
2. Invite team members
3. Set role-based permissions
4. Monitor user activity

## 🔐 Security Features

- Firebase Authentication
- Secure API endpoints
- Input validation and sanitization
- Environment variable protection
- HTTPS enforced
- CSRF protection
- XSS prevention

## ⚡ Performance Optimization

- Image optimization with Next.js Image
- Code splitting and lazy loading
- Server-side rendering (SSR)
- Static site generation (SSG)
- Incremental static regeneration (ISR)
- CDN caching

## 🔍 SEO Features

- Meta tags management
- OpenGraph support
- XML sitemap generation
- robots.txt configuration
- Structured data (JSON-LD)
- Mobile responsiveness

## 🤝 Contributing

We welcome contributions! Follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature/your-feature-name`
5. Submit a Pull Request

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📝 License

Licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Sai Susmitha**
- GitHub: [@sushversesai-pixel](https://github.com/sushversesai-pixel)

---

**Have questions or suggestions?** [Open an issue](https://github.com/sushversesai-pixel/sushverse-cms/issues) or start a discussion!
