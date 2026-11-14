"use client";

import ContactUsModal from "@/components/common/ContactUsModal";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Home,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import styles from "./page.module.css";

const locations = [
  {
    number: "01",
    name: "South Kolkata",
    description:
      "Explore residential properties across established neighbourhoods of South Kolkata.",
  },
  {
    number: "02",
    name: "Central Kolkata",
    description:
      "Discover residential opportunities in the heart of Kolkata.",
  },
  {
    number: "03",
    name: "North Kolkata",
    description:
      "Explore properties across North Kolkata and surrounding neighbourhoods.",
  },
  {
    number: "04",
    name: "East Kolkata",
    description:
      "Discover residential projects across the growing areas of East Kolkata.",
  },
  {
    number: "05",
    name: "New Town",
    description:
      "Explore modern residential projects and properties in New Town.",
  },
  {
    number: "06",
    name: "Rajarhat",
    description:
      "Discover residential developments and property options in Rajarhat.",
  },
];

const projects = [
  {
    name: "Vinayak Atlantis",
    location: "Action Area I, New Town",
    image: "/Projects/Vinayak_Atlantis.webp",
    tag: "NEW TOWN",
    description:
      "Explore premium residential living in one of Kolkata's rapidly developing areas.",
  },
  {
    name: "Orbit Dakshini",
    location: "Baranagar, Kolkata",
    image: "/Projects/Orbit_Dakshini.webp",
    tag: "NORTH KOLKATA",
    description:
      "Discover spacious residential opportunities in North Kolkata.",
  },
  {
    name: "Sansara",
    location: "Salkia, Howrah",
    image: "/Projects/Sansara.webp",
    tag: "KOLKATA REGION",
    description:
      "Explore thoughtfully designed residential spaces near Kolkata.",
  },
];

const reasons = [
  {
    number: "01",
    title: "Curated Properties",
    description:
      "Explore carefully selected residential properties and projects across Kolkata.",
  },
  {
    number: "02",
    title: "Multiple Locations",
    description:
      "Discover property options across established neighbourhoods and emerging areas.",
  },
  {
    number: "03",
    title: "Property Guidance",
    description:
      "Get assistance while exploring properties based on your requirements.",
  },
  {
    number: "04",
    title: "Easy Discovery",
    description:
      "Browse projects, explore locations and connect with the Adjective team.",
  },
];

export default function KolkataPage() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <div className={styles.page}>
      {/* ================= NAVBAR ================= */}
      <Navbar />

      <main>
        {/* ================= HERO ================= */}
        <section className={styles.hero}>
          <div className={styles.heroPattern} />

          <div className={styles.container}>
            <div className={styles.heroGrid}>
              {/* Hero Content */}
              <div className={styles.heroContent}>

                <div className={styles.heroLabel}>
                  <Sparkles size={14} />
                  Real Estate in Kolkata
                </div>

                <h1>
                  Find Your Ideal Property
                  <span>in Kolkata</span>
                </h1>

                <p className={styles.heroDescription}>
                  Explore residential properties and real estate projects
                  across Kolkata with Adjective.
                </p>

                <div className={styles.heroButtons}>
                  <Link
                    href="/projects"
                    className={styles.primaryButton}
                  >
                    Explore Projects
                    <ArrowUpRight size={17} />
                  </Link>

                  {/* Contact Us - Opens Modal */}
                 <button
  type="button"
  onClick={() => setContactModalOpen(true)}
  className={styles.ctaButton}
>
  <span>Contact Us</span>

  <span className={styles.ctaArrow}>
    <ArrowRight size={17} />
  </span>
</button>
                </div>
              </div>

              {/* Hero Visual */}
              <div className={styles.heroVisual}>
                <div className={styles.heroImageFrame}>
                  <Image
                    src="/Projects/Vinayak_Atlantis.webp"
                    alt="Residential property in Kolkata"
                    fill
                    priority
                    className={styles.heroImage}
                  />

                  <div className={styles.heroImageOverlay} />

                  <div className={styles.heroImageText}>
                    <span>KOLKATA</span>
                    <strong>Find Your Place</strong>
                  </div>
                </div>

                <div className={styles.heroCircle}>
                  <div className={styles.circleInner}>
                    <Building2 size={38} strokeWidth={1.2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= INTRO ================= */}
        <section className={styles.intro}>
          <div className={styles.container}>
            <div className={styles.introGrid}>
              <div>
                <p className={styles.eyebrow}>KOLKATA REAL ESTATE</p>

                <h2>
                  Discover a Property
                  <span>That Feels Like Home</span>
                </h2>
              </div>

              <div className={styles.introText}>
                <p>
                  Kolkata offers a diverse range of residential properties
                  across established neighbourhoods and emerging developments.
                </p>

                <p>
                  From New Town and Rajarhat to Salt Lake, South Kolkata and
                  other parts of the city, explore residential projects and
                  property options with Adjective.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= LOCATIONS ================= */}
        <section className={styles.locations}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>EXPLORE KOLKATA</p>

                <h2>
                  Discover Kolkata&apos;s
                  <span>Popular Locations</span>
                </h2>
              </div>

              <p className={styles.sectionDescription}>
                Explore residential properties across some of Kolkata&apos;s
                sought-after locations.
              </p>
            </div>

            <div className={styles.locationGrid}>
              {locations.map((location) => (
                <Link
                  href="/projects"
                  key={location.number}
                  className={styles.locationCard}
                >
                  <div className={styles.locationTop}>
                    <span className={styles.locationNumber}>
                      {location.number}
                    </span>

                    <span className={styles.locationArrow}>
                      <ArrowUpRight size={18} />
                    </span>
                  </div>

                  <div className={styles.locationContent}>
                    <MapPin size={17} />

                    <h3>{location.name}</h3>

                    <p>{location.description}</p>
                  </div>

                  <span className={styles.locationLink}>
                    Explore Properties
                    <ArrowRight size={15} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PROJECTS ================= */}
        <section className={styles.projects}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>FEATURED PROJECTS</p>

                <h2>
                  Explore Projects
                  <span>in Kolkata</span>
                </h2>
              </div>

              <Link
                href="/projects"
                className={styles.viewAll}
              >
                View All Projects
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className={styles.projectGrid}>
              {projects.map((project) => (
                <article
                  className={styles.projectCard}
                  key={project.name}
                >
                  <div className={styles.projectImage}>
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className={styles.projectImageElement}
                    />

                    <div className={styles.projectImageOverlay} />

                    <span className={styles.projectTag}>
                      {project.tag}
                    </span>

                    <Link
                      href="/projects"
                      className={styles.projectRoundButton}
                      aria-label={`View ${project.name}`}
                    >
                      <ArrowUpRight size={19} />
                    </Link>
                  </div>

                  <div className={styles.projectContent}>
                    <div className={styles.projectLocation}>
                      <MapPin size={15} />
                      {project.location}
                    </div>

                    <h3>{project.name}</h3>

                    <p>{project.description}</p>

                    <Link
                      href="/projects"
                      className={styles.projectLink}
                    >
                      View Project
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= WHY ADJECTIVE ================= */}
        <section className={styles.whySection}>
          <div className={styles.container}>
            <div className={styles.whyGrid}>
              <div className={styles.whyHeading}>
                <p className={styles.eyebrow}>WHY ADJECTIVE</p>

                <h2>
                  A Smarter Way to
                  <span>Explore Property</span>
                </h2>

                <p>
                  Finding a home is more than searching for an address.
                  Adjective helps you discover residential opportunities
                  across Kolkata with a simpler property exploration
                  experience.
                </p>

                {/* Talk to Us - Opens Modal */}
                <button
  type="button"
  onClick={() => setContactModalOpen(true)}
  className={styles.whyButton}
>
  Talk to Us
  <ArrowUpRight size={17} />
</button>
              </div>

              <div className={styles.reasonGrid}>
                {reasons.map((reason) => (
                  <div
                    className={styles.reasonCard}
                    key={reason.number}
                  >
                    <span>{reason.number}</span>

                    <div>
                      <h3>{reason.title}</h3>
                      <p>{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= KOLKATA STORY ================= */}
        <section className={styles.story}>
          <div className={styles.container}>
            <div className={styles.storyBox}>
              <div className={styles.storyImage}>
                <Image
                  src="/Projects/Anassa.webp"
                  alt="Residential property in Kolkata"
                  fill
                  className={styles.storyImageElement}
                />

                <div className={styles.storyImageOverlay} />

                <div className={styles.storyImageLabel}>
                  <span>ADJECTIVE</span>
                  <strong>Kolkata</strong>
                </div>
              </div>

              <div className={styles.storyContent}>
                <p className={styles.eyebrow}>
                  KOLKATA &amp; SURROUNDINGS
                </p>

                <h2>
                  Explore More Than
                  <span>Just a Property</span>
                </h2>

                <p>
                  From established neighbourhoods to rapidly developing
                  residential corridors, Kolkata offers property options
                  for different lifestyles and requirements.
                </p>

                <p>
                  Explore locations, discover residential projects and find
                  opportunities that fit the way you want to live.
                </p>

                <Link
                  href="/projects"
                  className={styles.storyButton}
                >
                  Explore Properties
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PROPERTY SEARCH STRIP ================= */}
        <section className={styles.searchStrip}>
          <div className={styles.container}>
            <div className={styles.searchInner}>
              <div className={styles.searchIcon}>
                <Search size={23} />
              </div>

              <div>
                <p>Looking for a property in Kolkata?</p>

                <span>
                  Explore residential projects and find your next home.
                </span>
              </div>

              <Link
                href="/projects"
                className={styles.searchButton}
              >
                Explore Now
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className={styles.cta}>
          <div className={styles.ctaPattern} />

          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <p className={styles.ctaEyebrow}>
                YOUR KOLKATA PROPERTY JOURNEY
              </p>

              <h2>
                Looking for a Property
                <span>in Kolkata?</span>
              </h2>

              <p>
                Let Adjective help you explore suitable residential
                properties and projects across Kolkata.
              </p>

              <div className={styles.ctaButtons}>
                <Link
                  href="/projects"
                  className={styles.ctaPrimary}
                >
                  Explore Projects
                  <ArrowUpRight size={17} />
                </Link>

                {/* Get in Touch - Opens Modal */}
                <button
                  type="button"
                  onClick={() => setContactModalOpen(true)}
                  className={styles.ctaSecondary}
                >
                  Get in Touch
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================= CONTACT MODAL ================= */}
      <ContactUsModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}