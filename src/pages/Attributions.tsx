import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Attributions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Attributions & Licensing | Tools Hub</title>
        <meta
          name="description"
          content="Open-source licenses and attributions for icons, UI components, libraries, and any third-party resources used across our tools."
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <section className="prose prose-lg max-w-3xl">
          <h1>Attributions & Licensing</h1>
          <p>
            We believe in transparency and proper credit. This page lists the
            primary third-party resources used in this website and their licenses.
            Brand names and logos are the property of their respective owners.
          </p>

          <h2>Core Technologies</h2>
          <ul>
            <li>React (MIT License)</li>
            <li>Vite (MIT License)</li>
            <li>Tailwind CSS (MIT License)</li>
            <li>TypeScript (Apache-2.0 License)</li>
          </ul>

          <h2>UI & Icons</h2>
          <ul>
            <li>shadcn/ui components (MIT License)</li>
            <li>lucide-react icons (ISC License)</li>
          </ul>

          <h2>Content & Tools</h2>
          <p>
            Many tools are implemented in-house. If any tool bundles or depends
            on third-party libraries beyond the above, we note their licenses in
            the repository or within the tool page where relevant.
          </p>

          <h2>Responsible Use</h2>
          <p>
            Downloader and analyzer tools must be used in accordance with the
            terms of the target platforms and applicable law. Do not use our
            tools to violate copyrights, terms of service, or privacy.
          </p>

          <h2>Contact</h2>
          <p>
            If you believe attribution is missing or incorrect, please reach out
            via our <a href="/contact">Contact</a> page and we will update this
            page promptly.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Attributions;