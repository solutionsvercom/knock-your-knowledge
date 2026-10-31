import { getBlogBySlug, slugifyTitle } from "@/data/courseBlogs";
import { internshipPageForId } from "@/config/pricing";

export function courseHref(title) {
  const slug = slugifyTitle(title);
  return slug && getBlogBySlug(slug) ? `/Blog/${slug}` : null;
}

export function courseImgAlt(title) {
  return title ? `${title} course` : "";
}

export function bundleImgAlt(title) {
  return title ? `${title} cover` : "";
}

export function internshipImgAlt(title) {
  return title ? `${title} programme` : "";
}

export function internshipHref(item) {
  const page = internshipPageForId(item?.id);
  return page ? `/Internships/${page.slug}` : null;
}

export function internshipLabel(item) {
  return internshipPageForId(item?.id)?.navTitle || item?.title || "Internship programme";
}
