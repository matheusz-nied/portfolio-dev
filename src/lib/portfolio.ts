import profile from "../../content/portfolio/profile.json";
import experience from "../../content/portfolio/experience.json";
import projects from "../../content/portfolio/projects.json";
import skills from "../../content/portfolio/skills.json";
import aiProjects from "../../content/portfolio/ai-projects.json";
import type { Locale } from "@/i18n/routing";

export type LocalizedString = { pt: string; en: string };

export function t(obj: LocalizedString, locale: Locale): string {
  return obj[locale];
}

function localizeProject(item: (typeof projects)[number], locale: Locale) {
  return {
    ...item,
    title: item.title[locale],
    summary: item.summary[locale],
    problem: item.problem[locale],
    solution: item.solution[locale],
    role: item.role[locale],
    highlights: item.highlights[locale],
    result: item.result[locale],
  };
}

export function getProfile(locale: Locale) {
  return {
    ...profile,
    availability: profile.availability[locale],
    location: profile.location[locale],
    languages: profile.languages[locale],
    summary: profile.summary[locale],
    education: profile.education[locale],
  };
}

export function getExperience(locale: Locale) {
  return experience.map((item) => ({
    ...item,
    role: item.role[locale],
    highlights: item.highlights[locale],
  }));
}

export function getProjects(locale: Locale) {
  return projects.map((item) => localizeProject(item, locale));
}

export function getProject(id: string, locale: Locale) {
  const item = projects.find((p) => p.id === id);
  if (!item) return null;
  return localizeProject(item, locale);
}

export function getSkills(locale: Locale) {
  return skills.map((item) => ({
    id: item.id,
    category: item.category[locale],
    items: item.items,
  }));
}

export function getAiProjects(locale: Locale) {
  return aiProjects.map((item) => ({
    ...item,
    title: item.title[locale],
    description: item.description[locale],
  }));
}

export { profile, experience, projects, skills, aiProjects };
