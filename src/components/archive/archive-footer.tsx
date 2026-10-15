"use client";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";

export function ArchiveFooter() {
  const t = useTranslations("archive");
  return <footer className="archive-footer"><div className="container"><p><Eye size={16} strokeWidth={1.5} aria-hidden="true" /><span>{t("footerNote")}</span></p><div><span>{t("footerOwner")}</span></div></div></footer>;
}
