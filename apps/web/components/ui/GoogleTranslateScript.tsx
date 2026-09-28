'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export function GoogleTranslateScript() {
  useEffect(() => {
    // Definir callback global para inicialização do Google Translate Element
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google?.translate?.TranslateElement) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'pt',
            includedLanguages: 'bg,cs,da,de,el,en,es,et,fi,fr,ga,hr,hu,it,lt,lv,mt,nl,pl,pt,ro,sk,sl,sv',
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }
    }
  }, [])

  return (
    <>
      {/* Elemento oculto obrigatório para o motor de tradução */}
      <div id="google_translate_element" style={{ display: 'none' }} />
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  )
}
