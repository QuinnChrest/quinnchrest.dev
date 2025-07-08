# Quinn Chrest - Developer Portfolio

A modern, responsive portfolio website built with SvelteKit, TypeScript, and Tailwind CSS. Features a dev log, projects showcase, and blog section with smooth animations and a beautiful dark theme.

## 🚀 Features

### ✨ Modern Design
- Dark theme with purple/pink gradient accents
- Smooth animations and transitions
- Responsive design for all devices
- Glass morphism effects
- Custom scrollbar styling

### 📝 Dev Log
- Timeline-based development updates
- Categorization (Feature, Bug Fix, Learning, Update)
- Tag system for easy filtering
- Add new entries with a form
- Visual indicators for different entry types

### 🚀 Projects Showcase
- Grid layout with project cards
- Status tracking (Completed, In Progress, Planned)
- Technology tags
- GitHub and live demo links
- Featured projects highlighting
- Filter by status or featured projects

### 📚 Blog Section
- Search and filter functionality
- Category-based organization
- Read time estimation
- Featured posts
- Tag system
- Add new blog posts

### 🧭 Navigation
- Smooth scrolling between sections
- Active section highlighting
- Mobile-responsive navigation
- Fixed header with backdrop blur

## 🛠️ Tech Stack

- **Framework**: SvelteKit 2.16.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.0
- **Build Tool**: Vite 6.2.6
- **Font**: Inter (Google Fonts)

## 🎨 Customization

### Colors and Theme
The website uses a dark theme with purple and pink gradients. You can customize the colors by modifying the Tailwind classes in the components or updating the `tailwind.config.js` file.

### Content
- Update personal information in the `Hero.svelte` component
- Add your own projects in the `Projects.svelte` component
- Customize the dev log entries in `DevLog.svelte`
- Add blog posts in the `Blog.svelte` component

### Social Links
Update the social media links in the `Hero.svelte` component with your actual profiles.

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Environment Variables for Production
When deploying to production, make sure to set the following environment variables in your hosting platform:

- `DB_HOST` - Your database host
- `DB_PORT` - Database port (usually 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_SSL` - Set to 'true' for production databases

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Add environment variables in Netlify dashboard
3. Deploy the `build` folder to Netlify

### Other Platforms
The project uses SvelteKit's adapter-auto, so it should work with most hosting platforms. Remember to configure environment variables for your database connection.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type-check the project

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

- **Website**: [quinnchrest.dev](https://quinnchrest.dev)
- **GitHub**: [@quinnchrest](https://github.com/quinnchrest)
- **LinkedIn**: [Quinn Chrest](https://linkedin.com/in/quinnchrest)

---

Built with ❤️ using SvelteKit and Tailwind CSS
