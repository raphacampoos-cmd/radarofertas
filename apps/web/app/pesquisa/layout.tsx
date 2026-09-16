import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pesquisar Ofertas — RadarOfertas',
  description: 'Pesquisa as melhores ofertas em Portugal. Gaming, Casa, Suplementação.',
  robots: { index: false, follow: true },
}

export default function PesquisaLayout({ children }: { children: React.ReactNode }) {
  return children
}
