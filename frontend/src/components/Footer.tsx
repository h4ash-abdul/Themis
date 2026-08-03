"use client";

import { useTranslation } from "@/lib/i18n";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-24 pt-6 border-t border-neutral-800 text-xs text-neutral-400 font-semibold drop-shadow-md font-mono flex justify-between shrink-0">
      <div>{t("footer.status")}</div>
      <div>{t("footer.encrypted")}</div>
    </footer>
  );
}
