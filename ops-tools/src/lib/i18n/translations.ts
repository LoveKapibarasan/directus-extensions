export const locales = ['en', 'ja', 'de'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

const en = {
  'app.title': 'CitrineOS Ops Tools',
  'group.locations': 'Locations',
  'group.tariffs': 'Tariffs',
  'group.payments': 'Payments',
  'group.users': 'Users',
  'group.subscriptions': 'Subscriptions',
  'group.operators': 'Operators',
  'group.tools': 'Tools',
  'group.external': 'External',
  'nav.locations': 'Locations',
  'nav.evses': 'EVSEs',
  'nav.connectors': 'Connectors',
  'nav.tariffs': 'Tariffs',
  'nav.checkouts': 'Checkouts',
  'nav.meterValueHistory': 'Meter Value History',
  'nav.users': 'Users',
  'nav.subscriptionPlans': 'Plans',
  'nav.rfidSubscriptions': 'RFID Subscriptions',
  'nav.rfidCards': 'RFID Cards',
  'nav.operators': 'Operators',
  'nav.operatorInfos': 'Operator Infos',
  'nav.exportTransactions': 'Export Transactions',
  'nav.consistencyCheck': 'Consistency Check',
  'nav.operatorUi': 'Operator UI',
  'header.signOut': 'Sign out',
  'home.title': 'CitrineOS Ops Tools',
  'home.subtitle': 'Pick a section from the sidebar to get started.',
  'language.label': 'Language',
} as const;

const ja: Record<keyof typeof en, string> = {
  'app.title': 'CitrineOS Ops Tools',
  'group.locations': '拠点',
  'group.tariffs': '料金プラン',
  'group.payments': '決済',
  'group.users': 'ユーザー',
  'group.subscriptions': 'サブスクリプション',
  'group.operators': 'オペレーター',
  'group.tools': 'ツール',
  'group.external': '外部リンク',
  'nav.locations': '拠点',
  'nav.evses': 'EVSE',
  'nav.connectors': 'コネクタ',
  'nav.tariffs': '料金プラン',
  'nav.checkouts': '決済',
  'nav.meterValueHistory': 'メーター値履歴',
  'nav.users': 'ユーザー',
  'nav.subscriptionPlans': 'プラン',
  'nav.rfidSubscriptions': 'RFIDサブスクリプション',
  'nav.rfidCards': 'RFIDカード',
  'nav.operators': 'オペレーター',
  'nav.operatorInfos': 'オペレーター情報',
  'nav.exportTransactions': '取引エクスポート',
  'nav.consistencyCheck': '整合性チェック',
  'nav.operatorUi': 'オペレーターUI',
  'header.signOut': 'サインアウト',
  'home.title': 'CitrineOS Ops Tools',
  'home.subtitle': 'サイドバーからセクションを選択してください。',
  'language.label': '言語',
};

const de: Record<keyof typeof en, string> = {
  'app.title': 'CitrineOS Ops Tools',
  'group.locations': 'Standorte',
  'group.tariffs': 'Tarife',
  'group.payments': 'Zahlungen',
  'group.users': 'Benutzer',
  'group.subscriptions': 'Abonnements',
  'group.operators': 'Betreiber',
  'group.tools': 'Werkzeuge',
  'group.external': 'Extern',
  'nav.locations': 'Standorte',
  'nav.evses': 'EVSEs',
  'nav.connectors': 'Anschlüsse',
  'nav.tariffs': 'Tarife',
  'nav.checkouts': 'Zahlungen',
  'nav.meterValueHistory': 'Zählerstandshistorie',
  'nav.users': 'Benutzer',
  'nav.subscriptionPlans': 'Tarifpläne',
  'nav.rfidSubscriptions': 'RFID-Abonnements',
  'nav.rfidCards': 'RFID-Karten',
  'nav.operators': 'Betreiber',
  'nav.operatorInfos': 'Betreiberinformationen',
  'nav.exportTransactions': 'Transaktionen exportieren',
  'nav.consistencyCheck': 'Konsistenzprüfung',
  'nav.operatorUi': 'Operator-UI',
  'header.signOut': 'Abmelden',
  'home.title': 'CitrineOS Ops Tools',
  'home.subtitle': 'Wählen Sie einen Bereich aus der Seitenleiste, um zu beginnen.',
  'language.label': 'Sprache',
};

export type TranslationKey = keyof typeof en;

export const translations: Record<Locale, Record<TranslationKey, string>> = { en, ja, de };

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  de: 'Deutsch',
};
