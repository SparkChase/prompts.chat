"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Eye, ArrowUpRight } from "lucide-react";

export function ArchiveFooter() {
  const t = useTranslations("archive");
  return <footer className="archive-footer"><div className="container"><p><Eye size={16} strokeWidth={1.5} aria-hidden="true" /><span>{t("footerNote")}</span></p><div><span>{t("footerOwner")}</span><Link href="https://github.com/f/prompts.chat" target="_blank" rel="noopener noreferrer">{t("sourceCode")}<ArrowUpRight size={12} /></Link><Link href="https://www.anime-chu-2.com/tv2nd/character/rikka/" target="_blank" rel="noopener noreferrer">{t("characterCredit")}<ArrowUpRight size={12} /></Link></div></div></footer>;
}
