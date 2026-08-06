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
    displayName: profile.displayName ?? profile.name,
    availability: profile.availability[locale],
    location: profile.location[locale],
    languages: profile.languages[locale],
    summary: profile.summary[locale],
    education: profile.education[locale],
  };
}

function parsePeriodDate(value: string) {
  const [year, month = "01"] = value.split("-");
  return { year: Number(year), month: Number(month) };
}

export function formatExperiencePeriodDate(date: string, locale: Locale) {
  const { year, month } = parsePeriodDate(date);
  const parsed = new Date(year, month - 1, 1);

  if (locale === "pt") {
    const monthName = parsed.toLocaleDateString("pt-BR", { month: "long" });
    const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${capitalized}/${year}`;
  }

  return parsed.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function experienceDurationYears(start: string, end: string | null) {
  const startDate = parsePeriodDate(start);
  const endDate = end
    ? parsePeriodDate(end)
    : { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
  const months =
    (endDate.year - startDate.year) * 12 + (endDate.month - startDate.month);
  return Math.max(1, Math.round(months / 12));
}

export function getExperience(locale: Locale) {
  return experience.map((item) => ({
    ...item,
    role: item.role[locale],
    highlights: item.highlights[locale],
    period: {
      start: item.period.start,
      end: item.period.end,
      startLabel: formatExperiencePeriodDate(item.period.start, locale),
      endLabel: item.period.end
        ? formatExperiencePeriodDate(item.period.end, locale)
        : null,
      startYear: String(parsePeriodDate(item.period.start).year),
      endYear: item.period.end
        ? String(parsePeriodDate(item.period.end).year)
        : null,
    },
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
