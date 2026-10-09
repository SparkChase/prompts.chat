import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight, BookOpen, FolderOpen, Plus } from "lucide-react";
import { ArchiveHero } from "./archive-hero";
import { ArchiveExample } from "./archive-example";

export async function ArchiveHome() {
  const t = await getTranslations("archive");
  const items = [{ href: "/prompts", title: "homeLibrary", description: "homeLibraryDescription", icon: BookOpen }, { href: "/categories", title: "homeCategories", description: "homeCategoriesDescription", icon: FolderOpen }, { href: "/prompts/new", title: "homeCreate", description: "homeCreateDescription", icon: Plus }];
  return <div className="container archive-home"><ArchiveHero home /><section className="archive-home-bottom"><div><h2 className="archive-section-title">{t("homeStart")}</h2><div className="archive-home-links">{items.map(({ href, title, description, icon: Icon }) => <Link key={href} href={href}><span className="archive-home-link-icon"><Icon size={18} /></span><span><strong>{t(title)}</strong><span>{t(description)}</span></span><ArrowUpRight size={17} /></Link>)}</div></div><div><h2 className="archive-section-title">{t("homeTry")}</h2><ArchiveExample /></div></section></div>;
}
