"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check, ArrowDown, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ArchiveExample() {
  const t = useTranslations("archive");
  const [expanded, setExpanded] = useState(false);
  const [topic, setTopic] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const prompt = t("examplePrompt", { topic: topic.trim() || t("exampleDefaultTopic") });

  async function copyExample() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  }

  return (
    <section className="archive-example" aria-labelledby="archive-example-title">
      <div className="archive-example-intro"><span className="archive-example-icon"><BookOpen size={20} strokeWidth={1.6} /></span><div><p className="archive-example-label">{t("exampleLabel")}</p><h3 id="archive-example-title">{t("exampleTitle")}</h3><p>{t("exampleDescription")}</p></div><Button variant="ghost" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="archive-example-content" className="archive-example-toggle">{expanded ? t("collapse") : t("tryExample")}<ArrowDown size={16} className={expanded ? "rotate-180" : ""} /></Button></div>
      {expanded && <div id="archive-example-content" className="archive-example-content"><div className="archive-example-fields"><Label htmlFor="archive-example-topic">{t("exampleInputLabel")}</Label><Input id="archive-example-topic" value={topic} onChange={event => { setTopic(event.target.value); setCopied(false); }} placeholder={t("exampleDefaultTopic")} /><p><Sparkles size={13} aria-hidden="true" />{t("exampleHint")}</p><Button onClick={copyExample} className="archive-example-copy">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? t("copied") : t("copyExample")}</Button><p role="status" className="archive-copy-status">{copyFailed ? t("copyFailed") : copied ? t("copySuccess") : ""}</p></div><textarea className="archive-example-preview" value={prompt} readOnly aria-label={t("preview")} onFocus={event => event.currentTarget.select()} /></div>}
    </section>
  );
}
