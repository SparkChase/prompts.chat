import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Sparkles, ArrowUpRight, Eye, BookOpen, Feather, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArchiveSearch } from "./archive-search";

export async function ArchiveHero({ home = false, query = "" }: { home?: boolean; query?: string }) {
  const t = await getTranslations("archive");
  return (
    <section className="archive-hero" aria-labelledby="archive-hero-title">
      <div className="archive-hero-copy">
        <p className="archive-hero-kicker"><span className="archive-kicker-line" aria-hidden="true" /><Sparkles size={13} aria-hidden="true" />{t("heroKicker")}</p>
        <h1 id="archive-hero-title">{t("heroTitle")}<br /><span>{t("heroTitleSecond")}</span></h1>
        <p className="archive-hero-description">{t("heroDescription")}</p>
        {home ? <div className="archive-hero-buttons"><Button asChild className="archive-primary-action"><Link href="/prompts"><BookOpen size={17} />{t("openArchive")}<ArrowUpRight size={16} /></Link></Button><Link href="/prompts/new" className="archive-text-link">{t("create")}<ArrowUpRight size={14} /></Link></div> : <ArchiveSearch initialQuery={query} />}
        <div className="archive-hero-notes"><span><Feather size={13} aria-hidden="true" />{t("heroNoteOne")}</span><span><Compass size={13} aria-hidden="true" />{t("heroNoteTwo")}</span></div>
      </div>
      <div className="archive-character" aria-label={t("characterAlt")}>
        <div className="archive-magic-seal" aria-hidden="true"><span /><span /><Eye size={24} strokeWidth={1} /><i className="archive-seal-star"><Sparkles size={22} /></i></div>
        <span className="archive-character-jp" aria-hidden="true">{t("characterJapanese")}</span>
        <Image src="/richard/rikka.webp" alt={t("characterAlt")} width={496} height={1035} className="archive-character-image" priority sizes="(max-width: 640px) 165px, (max-width: 1024px) 240px, 290px" />
        <div className="archive-character-caption"><span>{t("characterName")}</span><span>{t("characterRole")}</span></div>
        <span className="archive-character-star" aria-hidden="true"><Sparkles size={18} strokeWidth={1.4} /></span>
      </div>
    </section>
  );
}
