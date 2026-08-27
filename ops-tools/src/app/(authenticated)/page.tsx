'use client';

import { useTranslation } from '@lib/i18n/locale-provider';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">{t('home.title')}</h1>
      <p className="text-muted-foreground">{t('home.subtitle')}</p>
    </div>
  );
}
