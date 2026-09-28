export interface EULanguage {
  code: string
  name: string // Nome em Português
  nativeName: string // Nome na língua nativa
  flag: string
  country: string
}

// As 24 línguas oficiais da União Europeia
export const EU_LANGUAGES: EULanguage[] = [
  { code: 'pt', name: 'Português', nativeName: 'Português', flag: '🇵🇹', country: 'Portugal' },
  { code: 'es', name: 'Espanhol', nativeName: 'Español', flag: '🇪🇸', country: 'Espanha' },
  { code: 'en', name: 'Inglês', nativeName: 'English', flag: '🇬🇧', country: 'Irlanda / UE' },
  { code: 'fr', name: 'Francês', nativeName: 'Français', flag: '🇫🇷', country: 'França' },
  { code: 'de', name: 'Alemão', nativeName: 'Deutsch', flag: '🇩🇪', country: 'Alemanha' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', country: 'Itália' },
  { code: 'nl', name: 'Neerlandês', nativeName: 'Nederlands', flag: '🇳🇱', country: 'Países Baixos' },
  { code: 'pl', name: 'Polaco', nativeName: 'Polski', flag: '🇵🇱', country: 'Polónia' },
  { code: 'ro', name: 'Romeno', nativeName: 'Română', flag: '🇷🇴', country: 'Roménia' },
  { code: 'cs', name: 'Checo', nativeName: 'Čeština', flag: '🇨🇿', country: 'Chéquia' },
  { code: 'el', name: 'Grego', nativeName: 'Ελληνικά', flag: '🇬🇷', country: 'Grécia' },
  { code: 'hu', name: 'Húngaro', nativeName: 'Magyar', flag: '🇭🇺', country: 'Hungria' },
  { code: 'sv', name: 'Sueco', nativeName: 'Svenska', flag: '🇸🇪', country: 'Suécia' },
  { code: 'bg', name: 'Búlgaro', nativeName: 'Български', flag: '🇧🇬', country: 'Bulgária' },
  { code: 'da', name: 'Dinamarquês', nativeName: 'Dansk', flag: '🇩🇰', country: 'Dinamarca' },
  { code: 'fi', name: 'Finlandês', nativeName: 'Suomi', flag: '🇫🇮', country: 'Finlândia' },
  { code: 'sk', name: 'Eslovaco', nativeName: 'Slovenčina', flag: '🇸🇰', country: 'Eslováquia' },
  { code: 'hr', name: 'Croata', nativeName: 'Hrvatski', flag: '🇭🇷', country: 'Croácia' },
  { code: 'lt', name: 'Lituano', nativeName: 'Lietuvių', flag: '🇱🇹', country: 'Lituânia' },
  { code: 'sl', name: 'Esloveno', nativeName: 'Slovenščina', flag: '🇸🇮', country: 'Eslovénia' },
  { code: 'lv', name: 'Letão', nativeName: 'Latviešu', flag: '🇱🇻', country: 'Letónia' },
  { code: 'et', name: 'Estónio', nativeName: 'Eesti', flag: '🇪🇪', country: 'Estónia' },
  { code: 'ga', name: 'Irlandês', nativeName: 'Gaeilge', flag: '🇮🇪', country: 'Irlanda' },
  { code: 'mt', name: 'Maltês', nativeName: 'Malti', flag: '🇲🇹', country: 'Malta' },
]

export const DEFAULT_LANGUAGE: EULanguage = EU_LANGUAGES[0] // pt

export function getLanguageByCode(code: string): EULanguage {
  return EU_LANGUAGES.find((l) => l.code.toLowerCase() === code.toLowerCase()) || DEFAULT_LANGUAGE
}
