"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Search } from "lucide-react";
import { analyticsSearch } from "@/lib/analytics";

export function ArchiveSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const t = useTranslations("archive");
  function trackSearch(event: FormEvent<HTMLFormElement>) {
    const query = String(new FormData(event.currentTarget).get("q") || "").trim();
    if (query) analyticsSearch.search(query, false);
  }
  return (
    <form key={initialQuery} action="/prompts" className="archive-hero-search" role="search" onSubmit={trackSearch}>
      <Search size={18} aria-hidden="true" />
      <input name="q" aria-label={t("searchLabel")} placeholder={t("heroSearchPlaceholder")} defaultValue={initialQuery} autoComplete="off" />
      <button type="submit" aria-label={t("searchLabel")}><ArrowUpRight size={20} /></button>
    </form>
  );
}
