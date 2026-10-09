import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getConfig } from "@/lib/config";
import { getConfiguredProviderIds, getProviderMetadata } from "@/lib/auth/provider-metadata";
import { AuthContent } from "@/components/auth/auth-content";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function LoginPage() {
  const t = await getTranslations("auth");
  const config = await getConfig();
  const tArchive = await getTranslations("archive");
  const providers = getConfiguredProviderIds(config);
  const hasCredentials = providers.includes("credentials");
  const hasOnlyCredentials = providers.length === 1 && hasCredentials;
  const useCloneBranding = config.homepage?.useCloneBranding ?? false;
  const { displayNames, logos } = getProviderMetadata(providers);

  if (useCloneBranding) {
    return (
      <div className="archive-auth-shell">
        <div className="archive-auth-visual" aria-hidden="true">
          <p className="archive-auth-copy">{tArchive("loginKicker")}</p>
          <div className="archive-character">
            <div className="archive-magic-seal"><span /><span /><Eye size={24} /></div>
            <Image src="/richard/rikka.webp" alt="" width={496} height={1035} className="archive-character-image" sizes="244px" />
          </div>
        </div>
        <div className="archive-auth-panel">
          <h1>{t("login")}</h1>
          <p>{tArchive("loginDescription")}</p>
          <AuthContent providers={providers} mode="login" useCloneBranding providerDisplayNames={displayNames} providerLogos={logos} />
          <Link href="/prompts" className="archive-text-link mt-7"><ArrowLeft size={14} />{tArchive("loginBack")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center py-8">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold">{t("login")}</h1>
          <p className="text-xs text-muted-foreground">
            {hasOnlyCredentials ? t("loginDescription") : t("loginDescriptionOAuth")}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <AuthContent providers={providers} mode="login" useCloneBranding={useCloneBranding} providerDisplayNames={displayNames} providerLogos={logos} />
        </div>
        {hasCredentials && (
          <p className="text-center text-xs text-muted-foreground">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-foreground hover:underline">{t("register")}</Link>
          </p>
        )}
      </div>
    </div>
  );
}
