import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PortfolioNav } from "@/components/portfolio/PortfolioNav";
import { PortfolioFooter } from "@/components/portfolio/PortfolioFooter";
import { StarfieldBackground } from "@/components/portfolio/StarfieldBackground";
import { Hero } from "@/components/portfolio/Hero";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { AiSection } from "@/components/portfolio/AiSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { RecruiterMode } from "@/components/easter-eggs/RecruiterMode";
import { SecretTerminalProvider } from "@/components/easter-eggs/SecretTerminal";
import {
  getExperience,
  getProjects,
  getSkills,
  getAiProjects,
  getProfile,
} from "@/lib/portfolio";
import { getPersonJsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const profile = getProfile(locale as Locale);

  return {
    title: profile.name + " — " + profile.title,
    description: profile.summary,
    openGraph: {
      title: profile.name + " — Full-Stack & AI Engineer",
      description: profile.summary,
      type: "website",
      locale: locale === "pt" ? "pt_BR" : "en_US",
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const experience = getExperience(loc);
  const projects = getProjects(loc);
  const skills = getSkills(loc);
  const aiProjects = getAiProjects(loc);
  const jsonLd = getPersonJsonLd(loc);

  return (
    <div className="theme-portfolio relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StarfieldBackground />
      <div className="relative z-10">
        <SecretTerminalProvider>
          <PortfolioNav />
          <main>
            <Hero />
            <div className="mx-auto max-w-5xl">
              <ExperienceSection items={experience} />
              <ProjectsSection items={projects} />
              <SkillsSection items={skills} />
              <AiSection items={aiProjects} />
              <ContactSection />
            </div>
          </main>
          <PortfolioFooter />
          <RecruiterMode locale={loc} />
        </SecretTerminalProvider>
      </div>
    </div>
  );
}
