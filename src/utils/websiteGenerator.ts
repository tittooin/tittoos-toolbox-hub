
interface WebsiteGenerationParams {
  prompt: string;
  websiteType: string;
  theme: string;
  colorScheme: string;
  customizations: {
    includeContact: boolean;
    includeGallery: boolean;
    includeBlog: boolean;
    includeEcommerce: boolean;
    animations: boolean;
    darkMode: boolean;
    fontSize: number[];
    spacing: number[];
  };
}

interface GeneratedWebsite {
  title: string;
  description: string;
  html: string;
  css: string;
  js?: string;
  preview: string;
  technologies: string[];
  features: string[];
  readme: string;
}

const themeColors = {
  blue: { primary: '#3B82F6', secondary: '#EFF6FF', accent: '#1D4ED8' },
  purple: { primary: '#8B5CF6', secondary: '#F3E8FF', accent: '#7C3AED' },
  green: { primary: '#10B981', secondary: '#ECFDF5', accent: '#059669' },
  orange: { primary: '#F59E0B', secondary: '#FFFBEB', accent: '#D97706' },
  pink: { primary: '#EC4899', secondary: '#FDF2F8', accent: '#DB2777' },
  gray: { primary: '#6B7280', secondary: '#F9FAFB', accent: '#4B5563' },
};

const websiteTemplates = {
  landing: {
    title: "Professional Landing Page",
    sections: ["hero", "features", "testimonials", "cta"],
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
  },
  portfolio: {
    title: "Creative Portfolio",
    sections: ["hero", "about", "projects", "skills", "contact"],
    technologies: ["HTML5", "CSS3", "JavaScript", "Grid Layout", "Flexbox"],
  },
  business: {
    title: "Business Website",
    sections: ["header", "services", "about", "team", "contact"],
    technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "SEO Optimized"],
  },
  blog: {
    title: "Blog Platform",
    sections: ["header", "featured", "articles", "sidebar", "footer"],
    technologies: ["HTML5", "CSS3", "JavaScript", "RSS Feed", "Comments"],
  },
  ecommerce: {
    title: "E-commerce Store",
    sections: ["header", "products", "categories", "cart", "checkout"],
    technologies: ["HTML5", "CSS3", "JavaScript", "Payment Gateway", "Shopping Cart"],
  },
  personal: {
    title: "Personal Website",
    sections: ["intro", "bio", "experience", "projects", "contact"],
    technologies: ["HTML5", "CSS3", "JavaScript", "Personal Branding"],
  },
};

export const generateWebsiteFromPrompt = async (params: WebsiteGenerationParams): Promise<GeneratedWebsite> => {
  const { prompt, websiteType, theme, colorScheme, customizations } = params;
  
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const template = websiteTemplates[websiteType as keyof typeof websiteTemplates];
  const colors = themeColors[colorScheme as keyof typeof themeColors];
  
  // Extract key information from prompt
  const businessName = extractBusinessName(prompt) || "Your Business";
  const industry = extractIndustry(prompt) || "Technology";
  const description = extractDescription(prompt) || "Professional services and solutions";
  
  const features = [
    "Responsive Design",
    "SEO Optimized",
    "Fast Loading",
    "Mobile Friendly",
    ...(customizations.includeContact ? ["Contact Form"] : []),
    ...(customizations.includeGallery ? ["Image Gallery"] : []),
    ...(customizations.includeBlog ? ["Blog Section"] : []),
    ...(customizations.includeEcommerce ? ["E-commerce"] : []),
    ...(customizations.animations ? ["Smooth Animations"] : []),
    ...(customizations.darkMode ? ["Dark Mode"] : []),
  ];

  const html = generateHTML({
    businessName,
    industry,
    description,
    websiteType,
    customizations,
    colors,
    theme
  });

  const css = generateCSS({
    theme,
    colors,
    customizations,
    websiteType
  });

  const js = generateJavaScript(customizations);

  const preview = generatePreview({
    businessName,
    industry,
    description,
    websiteType,
    colors,
    theme
  });

  const readme = generateReadme({
    businessName,
    websiteType,
    features,
    technologies: template.technologies
  });

  return {
    title: `${businessName} - ${template.title}`,
    description: `${description} - Generated with AI`,
    html,
    css,
    js,
    preview,
    technologies: template.technologies,
    features,
    readme
  };
};

function extractBusinessName(prompt: string): string | null {
  const patterns = [
    /for\s+([A-Z][a-zA-Z\s&]+?)(?:\s+(?:company|business|startup|website))/i,
    /"([^"]+)"/,
    /called\s+([A-Z][a-zA-Z\s&]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

function extractIndustry(prompt: string): string | null {
  const industries = [
    'technology', 'tech', 'software', 'app', 'saas',
    'design', 'creative', 'art', 'photography',
    'business', 'consulting', 'finance', 'marketing',
    'health', 'medical', 'fitness', 'wellness',
    'education', 'learning', 'course', 'training',
    'ecommerce', 'retail', 'shop', 'store',
    'food', 'restaurant', 'cafe', 'catering',
    'travel', 'tourism', 'hotel', 'booking'
  ];
  
  const promptLower = prompt.toLowerCase();
  for (const industry of industries) {
    if (promptLower.includes(industry)) {
      return industry.charAt(0).toUpperCase() + industry.slice(1);
    }
  }
  return null;
}

function extractDescription(prompt: string): string | null {
  if (prompt.length > 100) {
    return prompt.substring(0, 100) + "...";
  }
  return prompt;
}

function generateHTML({ businessName, industry, description, websiteType, customizations, colors, theme }: any): string {
  const darkModeClass = customizations.darkMode ? ' dark' : '';
  
  return `<!DOCTYPE html>
<html lang="en"${darkModeClass}>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - ${industry}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${industry}, professional, services">
    <link rel="stylesheet" href="styles.css">
    ${customizations.animations ? '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">' : ''}
</head>
<body>
    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">
                <h1>${businessName}</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                ${customizations.includeGallery ? '<li><a href="#gallery">Gallery</a></li>' : ''}
                ${customizations.includeBlog ? '<li><a href="#blog">Blog</a></li>' : ''}
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero${customizations.animations ? ' animate__animated animate__fadeIn' : ''}">
            <div class="hero-content">
                <h2>Welcome to ${businessName}</h2>
                <p>${description}</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <h2>About Us</h2>
                <p>We are a leading ${industry} company dedicated to providing exceptional services and solutions to our clients.</p>
            </div>
        </section>

        <section id="services" class="services">
            <div class="container">
                <h2>Our Services</h2>
                <div class="services-grid">
                    <div class="service-card">
                        <h3>Service 1</h3>
                        <p>Professional ${industry} solutions tailored to your needs.</p>
                    </div>
                    <div class="service-card">
                        <h3>Service 2</h3>
                        <p>Expert consultation and strategic planning services.</p>
                    </div>
                    <div class="service-card">
                        <h3>Service 3</h3>
                        <p>Ongoing support and maintenance for your success.</p>
                    </div>
                </div>
            </div>
        </section>

        ${customizations.includeGallery ? `
        <section id="gallery" class="gallery">
            <div class="container">
                <h2>Gallery</h2>
                <div class="gallery-grid">
                    <div class="gallery-item">
                        <div class="placeholder-image">Project 1</div>
                    </div>
                    <div class="gallery-item">
                        <div class="placeholder-image">Project 2</div>
                    </div>
                    <div class="gallery-item">
                        <div class="placeholder-image">Project 3</div>
                    </div>
                    <div class="gallery-item">
                        <div class="placeholder-image">Project 4</div>
                    </div>
                </div>
            </div>
        </section>
        ` : ''}

        ${customizations.includeBlog ? `
        <section id="blog" class="blog">
            <div class="container">
                <h2>Latest Posts</h2>
                <div class="blog-grid">
                    <article class="blog-post">
                        <h3>Getting Started with ${industry}</h3>
                        <p>Learn the basics of ${industry} and how it can benefit your business...</p>
                        <a href="#" class="read-more">Read More</a>
                    </article>
                    <article class="blog-post">
                        <h3>Best Practices in ${industry}</h3>
                        <p>Discover the latest trends and best practices in the ${industry} industry...</p>
                        <a href="#" class="read-more">Read More</a>
                    </article>
                </div>
            </div>
        </section>
        ` : ''}

        ${customizations.includeContact ? `
        <section id="contact" class="contact">
            <div class="container">
                <h2>Get in Touch</h2>
                <form class="contact-form">
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Your Email" required>
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </section>
        ` : ''}
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${businessName}. All rights reserved.</p>
        </div>
    </footer>

    ${customizations.animations || customizations.includeContact ? '<script src="script.js"></script>' : ''}
</body>
</html>`;
}

function generateCSS({ theme, colors, customizations, websiteType }: any): string {
  const fontSize = customizations.fontSize[0];
  const spacing = customizations.spacing[0];
  const darkMode = customizations.darkMode;

  return `/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: ${darkMode ? '#f0f0f0' : '#333'};
    font-size: ${fontSize}px;
    background-color: ${darkMode ? '#1a1a1a' : '#ffffff'};
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${spacing}rem;
}

/* Header Styles */
.header {
    background: ${darkMode ? '#2a2a2a' : colors.primary};
    color: white;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${spacing}rem;
}

.nav-brand h1 {
    font-size: 1.8rem;
    font-weight: bold;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: ${colors.secondary};
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%);
    color: white;
    padding: 8rem 0;
    text-align: center;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-content h2 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.cta-button {
    background: ${colors.accent};
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.cta-button:hover {
    background: ${colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

/* Section Styles */
section {
    padding: 6rem 0;
}

section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: ${darkMode ? '#f0f0f0' : colors.primary};
}

/* About Section */
.about {
    background: ${darkMode ? '#2a2a2a' : colors.secondary};
}

.about p {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.8;
}

/* Services Section */
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.service-card {
    background: ${darkMode ? '#3a3a3a' : 'white'};
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.service-card h3 {
    color: ${colors.primary};
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

/* Gallery Section */
.gallery {
    background: ${darkMode ? '#2a2a2a' : colors.secondary};
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 3rem;
}

.gallery-item {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.placeholder-image {
    background: ${colors.primary};
    color: white;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.1rem;
}

/* Blog Section */
.blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.blog-post {
    background: ${darkMode ? '#3a3a3a' : 'white'};
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.blog-post h3 {
    color: ${colors.primary};
    margin-bottom: 1rem;
}

.read-more {
    color: ${colors.accent};
    text-decoration: none;
    font-weight: 600;
    display: inline-block;
    margin-top: 1rem;
}

.read-more:hover {
    color: ${colors.primary};
}

/* Contact Section */
.contact {
    background: ${darkMode ? '#2a2a2a' : colors.secondary};
}

.contact-form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.contact-form input,
.contact-form textarea {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    background: ${darkMode ? '#3a3a3a' : 'white'};
    color: ${darkMode ? '#f0f0f0' : '#333'};
}

.contact-form textarea {
    min-height: 120px;
    resize: vertical;
}

.contact-form button {
    background: ${colors.primary};
    color: white;
    border: none;
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.contact-form button:hover {
    background: ${colors.accent};
}

/* Footer */
.footer {
    background: ${darkMode ? '#1a1a1a' : '#333'};
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .hero-content h2 {
        font-size: 2.5rem;
    }
    
    .services-grid,
    .gallery-grid,
    .blog-grid {
        grid-template-columns: 1fr;
    }
    
    section {
        padding: 4rem 0;
    }
}

/* Animation Classes */
${customizations.animations ? `
.fade-in {
    animation: fadeIn 0.8s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.slide-up {
    animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
` : ''}`;
}

function generateJavaScript(customizations: any): string {
  let js = `// Website JavaScript\n\n`;

  if (customizations.animations) {
    js += `// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

`;
  }

  if (customizations.includeContact) {
    js += `// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name') || contactForm.querySelector('input[type="text"]').value;
            const email = formData.get('email') || contactForm.querySelector('input[type="email"]').value;
            const message = formData.get('message') || contactForm.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Simulate form submission
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});

`;
  }

  js += `// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add interactive hover effects
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card, .blog-post, .gallery-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});`;

  return js;
}

function generatePreview({ businessName, industry, description, websiteType, colors, theme }: any): string {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; line-height: 1.6;">
      <header style="background: ${colors.primary}; color: white; padding: 1rem; text-align: center;">
        <h1 style="margin: 0; font-size: 1.5rem;">${businessName}</h1>
      </header>
      
      <section style="background: linear-gradient(135deg, ${colors.primary}, ${colors.accent}); color: white; padding: 3rem 1rem; text-align: center;">
        <h2 style="font-size: 2rem; margin-bottom: 1rem;">Welcome to ${businessName}</h2>
        <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">${description}</p>
        <button style="background: ${colors.accent}; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 25px; font-size: 1rem; cursor: pointer;">
          Get Started
        </button>
      </section>
      
      <section style="padding: 2rem 1rem; background: ${colors.secondary};">
        <h2 style="text-align: center; color: ${colors.primary}; margin-bottom: 1.5rem;">About Us</h2>
        <p style="text-align: center; max-width: 600px; margin: 0 auto;">
          We are a leading ${industry} company dedicated to providing exceptional services and solutions.
        </p>
      </section>
      
      <section style="padding: 2rem 1rem;">
        <h2 style="text-align: center; color: ${colors.primary}; margin-bottom: 1.5rem;">Our Services</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: ${colors.primary};">Service 1</h3>
            <p>Professional ${industry} solutions</p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: ${colors.primary};">Service 2</h3>
            <p>Expert consultation services</p>
          </div>
          <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: ${colors.primary};">Service 3</h3>
            <p>Ongoing support and maintenance</p>
          </div>
        </div>
      </section>
      
      <footer style="background: #333; color: white; text-align: center; padding: 1rem;">
        <p>&copy; 2024 ${businessName}. All rights reserved.</p>
      </footer>
    </div>
  `;
}

function generateReadme({ businessName, websiteType, features, technologies }: any): string {
  return `# ${businessName} Website

This website was generated using AI-powered website generation technology.

## Website Type
${websiteType.charAt(0).toUpperCase() + websiteType.slice(1)} Website

## Features
${features.map((feature: string) => `- ${feature}`).join('\n')}

## Technologies Used
${technologies.map((tech: string) => `- ${tech}`).join('\n')}

## Getting Started

1. Open \`index.html\` in your web browser
2. Customize the content in the HTML file
3. Modify styles in \`styles.css\`
4. Add interactive features in \`script.js\`

## Deployment

You can deploy this website to any web hosting service:

- **Netlify**: Drag and drop the files to Netlify
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Traditional Hosting**: Upload files via FTP

## Customization

### Colors
The color scheme can be modified in the CSS file by changing the color variables.

### Content
Replace the placeholder content in the HTML file with your actual content.

### Images
Replace placeholder images with your actual images in the appropriate sections.

## Support

This website was generated with AI assistance. For modifications and updates, you can:
- Edit the HTML, CSS, and JavaScript files directly
- Use the AI Website Generator tool for regeneration
- Hire a web developer for advanced customizations

---

Generated with ❤️ by AI Website Generator
`;
}
