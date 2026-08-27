'use client';

import { Globe } from 'lucide-react';
import { useTranslation } from '@lib/i18n/locale-provider';
import { locales, localeLabels, type Locale } from '@lib/i18n/translations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lib/components/ui/select';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
      <SelectTrigger
        size="sm"
        aria-label={t('language.label')}
        data-testid="language-switcher"
        className="w-auto gap-1.5"
      >
        <Globe className="size-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((l) => (
          <SelectItem key={l} value={l}>
            {localeLabels[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
