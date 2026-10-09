"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import { BookOpen, FolderOpen, Tags, Moon, Sun, Menu, Plus, ChevronDown, User, Settings, LogOut, Shield, Globe, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { useBranding } from "@/components/providers/branding-provider";
import { setLocale } from "@/lib/i18n/client";

export function ArchiveHeader() {
  const t = useTranslations("archive");
  const nav = useTranslations("nav");
  const pathname = usePathname() || "/";
  const locale = useLocale();
  const branding = useBranding();
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const languages = [{ code: "zh", label: "中文" }, { code: "en", label: "English" }, { code: "ja", label: "日本語" }, { code: "es", label: "Español" }, { code: "pt", label: "Português" }, { code: "fr", label: "Français" }, { code: "de", label: "Deutsch" }, { code: "it", label: "Italiano" }, { code: "ko", label: "한국어" }, { code: "tr", label: "Türkçe" }, { code: "az", label: "Azərbaycan dili" }, { code: "ar", label: "العربية" }, { code: "fa", label: "فارسی" }, { code: "ru", label: "Русский" }, { code: "he", label: "עברית" }, { code: "el", label: "Ελληνικά" }, { code: "nl", label: "Nederlands" }];
  const primary = [
    { href: "/prompts", label: nav("prompts"), icon: BookOpen },
    { href: "/categories", label: nav("categories"), icon: FolderOpen },
    { href: "/tags", label: nav("tags"), icon: Tags },
  ];
  const secondary = [
    { href: "/skills", label: nav("skills") },
    { href: "/taste", label: nav("taste") },
    { href: "/workflows", label: nav("workflows") },
    { href: "/promptmasters", label: nav("promptmasters") },
    { href: "/developers", label: nav("developers") },
  ];

  return (
    <header className="archive-header">
      <div className="container archive-header-inner">
        <Link href="/" className="archive-brand" aria-label={branding.name}>
          <Image src={branding.logo} alt="" width={42} height={42} priority />
          <span><span className="archive-brand-owner">{branding.name.split(" · ")[0]}<span className="archive-brand-dot">.</span></span><span className="archive-brand-title">{t("brandSubtitle")}</span></span>
        </Link>
        <nav className="archive-desktop-nav" aria-label={t("navigation")}>
          {primary.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="archive-nav-link" aria-current={pathname.startsWith(href) ? "page" : undefined}><Icon size={16} aria-hidden="true" />{label}</Link>
          ))}
          {session?.user && <Link href="/collection" className="archive-nav-link" aria-current={pathname === "/collection" ? "page" : undefined}><Bookmark size={16} aria-hidden="true" />{nav("collection")}</Link>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="archive-more">{nav("more")}<ChevronDown size={14} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="start">{secondary.map(item => <DropdownMenuItem key={item.href} asChild><Link href={item.href}>{item.label}</Link></DropdownMenuItem>)}</DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="archive-header-actions">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="archive-language" aria-label={t("language")}><Globe size={18} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">{languages.map(language => <DropdownMenuItem key={language.code} onClick={() => setLocale(language.code)} aria-current={locale === language.code ? "true" : undefined}>{language.label}</DropdownMenuItem>)}</DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="archive-theme-toggle" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label={t("toggleTheme")}><Sun className="archive-sun" size={18} /><Moon className="archive-moon" size={18} /></Button>
          {session?.user ? <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline" className="archive-account"><User size={16} /><span>{session.user.name || session.user.username}</span></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href={`/${session.user.username}`}><User size={16} />{nav("profile")}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/settings"><Settings size={16} />{nav("settings")}</Link></DropdownMenuItem>
              {session.user.role === "ADMIN" && <DropdownMenuItem asChild><Link href="/admin"><Shield size={16} />{nav("admin")}</Link></DropdownMenuItem>}
              <DropdownMenuSeparator /><DropdownMenuItem onClick={() => signOut()}><LogOut size={16} />{nav("logout")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : <Button asChild variant="outline" className="archive-login"><Link href="/login" aria-label={nav("login")}><User size={15} /><span>{nav("login")}</span></Link></Button>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="archive-mobile-menu" aria-label={t("menu")}><Menu size={21} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52">
              {primary.map(item => <DropdownMenuItem key={item.href} asChild><Link href={item.href}>{item.label}</Link></DropdownMenuItem>)}
              {session?.user && <DropdownMenuItem asChild><Link href="/collection">{nav("collection")}</Link></DropdownMenuItem>}
              <DropdownMenuSeparator />{secondary.map(item => <DropdownMenuItem key={item.href} asChild><Link href={item.href}>{item.label}</Link></DropdownMenuItem>)}
              <DropdownMenuSeparator /><DropdownMenuSub><DropdownMenuSubTrigger><Globe size={16} />{t("language")}</DropdownMenuSubTrigger><DropdownMenuSubContent>{languages.map(language => <DropdownMenuItem key={language.code} onClick={() => setLocale(language.code)}>{language.label}</DropdownMenuItem>)}</DropdownMenuSubContent></DropdownMenuSub><DropdownMenuItem asChild><Link href="/prompts/new"><Plus size={16} />{t("create")}</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
