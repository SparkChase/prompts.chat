"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { BookOpen, Plus, SearchX, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArchiveExample } from "./archive-example";

export function ArchiveEmptyState({ filtered }: { filtered: boolean }) {
  const t = useTranslations("archive");
  return (
    <div className="archive-empty-wrap">
      <section className="archive-empty">
        <div className="archive-empty-symbol" aria-hidden="true">{filtered ? <SearchX size={28} strokeWidth={1.4} /> : <BookOpen size={28} strokeWidth={1.4} />}<span /></div>
        <div className="archive-empty-copy"><h2>{filtered ? t("noResultsTitle") : t("emptyTitle")}</h2><p>{filtered ? t("noResultsDescription") : t("emptyDescription")}</p><Button asChild variant="outline" className="archive-empty-action"><Link href={filtered ? "/prompts" : "/prompts/new"}>{filtered ? <ArrowUpRight size={15} /> : <Plus size={15} />}{filtered ? t("clearSearch") : t("createFirst")}</Link></Button></div>
      </section>
      {!filtered && <ArchiveExample />}
    </div>
  );
}
