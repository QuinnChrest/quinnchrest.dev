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

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/quinnchrest/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── app.css              # Global styles and Tailwind imports
├── app.html             # HTML template
├── routes/
│   ├── +layout.svelte   # Root layout
│   └── +page.svelte     # Main page component
└── lib/
    └── components/
        ├── Navigation.svelte  # Navigation bar
        ├── Hero.svelte        # Hero section
        ├── DevLog.svelte      # Dev log component
        ├── Projects.svelte    # Projects showcase
        └── Blog.svelte        # Blog section
```

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

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify

### Other Platforms
The project uses SvelteKit's adapter-auto, so it should work with most hosting platforms.

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
