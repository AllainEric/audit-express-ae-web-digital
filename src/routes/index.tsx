import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  Clock3,
  LoaderCircle,
  Mail,
  MessageCircle,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Video,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { blink } from '@/blink/client'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Audit Express gratuit · AE WEB DIGITAL' },
      { name: 'description', content: 'En 30 minutes, identifiez où votre TPE perd du temps et repartez avec 3 actions concrètes, gratuitement.' },
    ],
  }),
  component: AuditExpress,
})

const benefits = [
  { number: '01', icon: Clock3, title: 'Vos heures et clients perdus, chiffrés.', text: 'Nous isolons les tâches qui absorbent votre temps et les moments où des opportunités clients passent à côté.' },
  { number: '02', icon: BarChart3, title: 'Le chiffre d’affaires qui échappe', text: 'Devis oubliés, demandes sans suite et clients mal relancés : vous voyez ce qui se perd et pourquoi.' },
  { number: '03', icon: Target, title: '3 actions à lancer cette semaine', text: 'Un plan priorisé pour récupérer du temps et ne plus laisser de clients vous échapper.' },
]

const testimonials = [
  { quote: "Je pensais que le digital n’était pas pour moi. Éric m'a aidée à y voir clair en une seule session. Aujourd'hui, mes clientes me trouvent facilement en ligne.", name: 'Sophie M.', role: "Gérante d'un salon de coiffure" },
  { quote: "Pas de jargon, pas de pression. Juste des conseils concrets et une vraie stratégie adaptée à mon activité. J'ai enfin une direction claire.", name: 'Laurent D.', role: 'Artisan menuisier' },
  { quote: "En 3 mois d'accompagnement, j'ai structuré toute ma présence en ligne. Le retour sur investissement a été immédiat.", name: 'Nathalie R.', role: "Dirigeante d'une boutique de décoration" },
]

const faqItems = [
  ['C’est vraiment gratuit, où est le piège ?', 'Il n’y en a pas. L’audit est une première conversation utile. Si notre façon de travailler vous aide, 1 à 2 dirigeants sur 10 choisissent ensuite de poursuivre avec nous. La majorité repart simplement avec ses 3 actions.'],
  ['Je n’ai pas 30 minutes à perdre.', 'C’est précisément le symptôme que nous cherchons. Des créneaux sont disponibles tôt le matin, à 7h30, ou après 18h30. Une demi-heure maintenant peut éviter des mois de rattrapage.'],
  ['Je n’y connais rien en informatique.', 'Parfait. Nous parlons de vos journées, de vos clients et de vos habitudes — jamais de jargon. Vous n’avez rien à préparer ni à installer.'],
  ['Allez-vous essayer de me vendre quelque chose ?', 'Non. Une règle simple : aucun pitch commercial pendant l’appel. Les 30 minutes servent à votre organisation, pas à vous convaincre.'],
  ['Ma boîte est trop petite.', 'L’offre est pensée pour les TPE de 1 à 10 salariés : artisans, commerçants, indépendants et petites équipes où chaque heure compte.'],
]

const sectorBenchmarks = [
  { id: 'artisan', label: 'Artisan / bâtiment', hours: 6, hourlyValue: 55 },
  { id: 'commerce', label: 'Commerce de proximité', hours: 5, hourlyValue: 45 },
  { id: 'service', label: 'Prestataire de services', hours: 7, hourlyValue: 70 },
  { id: 'liberal', label: 'Profession libérale', hours: 6, hourlyValue: 85 },
  { id: 'other', label: 'Autre activité', hours: 4, hourlyValue: 50 },
]

function SiteAudit() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState('')

  const analyzeSite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedUrl = url.trim()
    if (!/^https?:\/\/[^\s]+$/i.test(normalizedUrl)) {
      setError('Entrez une URL publique complète, par exemple https://votre-site.fr')
      return
    }
    setError('')
    if (!blink.auth.isAuthenticated()) {
      blink.auth.login(window.location.href)
      return
    }
    setReport('')
    setIsAnalyzing(true)
    try {
      const scraped = await blink.data.scrape(normalizedUrl)
      const { text } = await blink.ai.generateText({
        prompt: `Tu es un consultant senior en audit de sites web pour des TPE françaises. Analyse le site suivant et rédige un audit actionnable en français. Donne exactement les sections suivantes : 1) Résumé en 2 phrases, 2) 3 points forts, 3) 5 problèmes ou risques prioritaires, 4) 3 actions à lancer cette semaine, 5) une note globale sur 10 avec justification. Sois concret, bienveillant et ne prétends pas connaître des données qui ne figurent pas dans le contenu. URL : ${normalizedUrl}\n\nContenu extrait :\n${scraped.markdown.slice(0, 12000)}`,
        model: 'openai/gpt-4.1-mini',
        maxTokens: 900,
      })
      setReport(text)
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : 'Impossible d’analyser ce site pour le moment.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return <Reveal><div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 shadow-xl shadow-primary/5 sm:p-8"><div className="max-w-3xl"><p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">Nouveau · Audit de votre site</p><h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Obtenez un premier diagnostic en quelques minutes.</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Entrez l’URL publique de votre site. Nous repérons les forces, les freins à la conversion et les 3 actions les plus utiles à lancer en premier.</p><form onSubmit={analyzeSite} className="mt-6 flex flex-col gap-3 sm:flex-row"><label htmlFor="site-url" className="sr-only">URL de votre site</label><input id="site-url" type="text" inputMode="url" required aria-describedby="site-url-help site-url-error" value={url} onChange={(event) => { setUrl(event.target.value); if (error) setError('') }} placeholder="https://votre-site.fr" className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" /><Button type="submit" disabled={isAnalyzing} className="h-12 sm:px-6">{isAnalyzing ? <><LoaderCircle className="size-4 animate-spin" /> Analyse en cours…</> : <>Analyser mon site <ArrowRight className="size-4" /></>}</Button></form>{error && <p id="site-url-error" role="alert" className="mt-3 text-sm font-medium text-destructive">{error}</p>}<p id="site-url-help" className="mt-3 text-xs text-muted-foreground">Votre site doit être accessible publiquement. Aucun mot de passe n’est demandé.</p></div>{report && <article className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-7"><div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">Résultat de l’analyse</p><h4 className="mt-1 text-xl font-semibold text-foreground">Votre audit express</h4></div><a href={url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">Voir le site <ArrowRight className="inline size-3.5" /></a></div><div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{report}</div></article>}</div></Reveal>
}

function SavingsCalculator() {
  const [sectorId, setSectorId] = useState('artisan')
  const sector = sectorBenchmarks.find((item) => item.id === sectorId) ?? sectorBenchmarks[0]
  const monthlyValue = sector.hours * sector.hourlyValue * 4.33

  return <Reveal><div className="rounded-2xl border border-[#615FFF]/35 bg-background p-6 shadow-xl shadow-primary/5 sm:p-8"><div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><div><p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">Calculez votre potentiel</p><h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Combien de temps pourriez-vous récupérer ?</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Choisissez votre secteur pour obtenir une estimation concrète, basée sur les tâches administratives et les relances généralement répétées dans votre activité.</p><label htmlFor="sector" className="mt-6 block text-sm font-medium text-foreground">Votre secteur d’activité</label><select id="sector" value={sectorId} onChange={(event) => setSectorId(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"><option value="artisan">Artisan / bâtiment</option><option value="commerce">Commerce de proximité</option><option value="service">Prestataire de services</option><option value="liberal">Profession libérale</option><option value="other">Autre activité</option></select></div><div className="rounded-xl border border-border bg-card p-5 sm:p-6"><p className="text-sm text-muted-foreground">Dans votre secteur, le potentiel estimé est de</p><div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-5xl font-semibold tracking-[-0.07em] text-primary sm:text-6xl">{sector.hours} h</span><span className="text-sm font-medium text-foreground">récupérées par semaine</span></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-lg bg-background p-4"><p className="text-xs text-muted-foreground">Par mois</p><p className="mt-1 text-lg font-semibold text-foreground">{Math.round(sector.hours * 4.33)} h</p></div><div className="rounded-lg bg-background p-4"><p className="text-xs text-muted-foreground">Valeur indicative</p><p className="mt-1 text-lg font-semibold text-foreground">{Math.round(monthlyValue).toLocaleString('fr-FR')} € / mois</p></div></div><p className="mt-4 text-xs leading-5 text-muted-foreground">Estimation indicative : {sector.hourlyValue} € de valeur par heure récupérée. L’audit mesure votre situation réelle et priorise les gains les plus rapides.</p></div></div></div></Reveal>
}

function SectionLabel({ children }: { children: string }) {
  return <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent"><span className="h-px w-8 bg-accent" />{children}</p>
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}>{children}</motion.div>
}

function BookingForm() {
  const recapItems = [
    { icon: Clock3, title: 'Du temps récupéré', text: 'Nous repérons les tâches qui peuvent vous rendre plusieurs heures chaque semaine.' },
    { icon: Target, title: '3 priorités concrètes', text: 'Vous repartez avec un plan simple, chiffré et directement applicable.' },
    { icon: MessageCircle, title: 'Un échange sans jargon', text: 'Vous avancez avec des réponses adaptées à votre métier, pas une solution générique.' },
  ]

  return <div className="rounded-2xl border border-border bg-card p-5 shadow-xl shadow-background/20 sm:p-8">
    <div className="mb-6"><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">Réservation</p><h3 className="mt-2 text-2xl font-semibold text-foreground">Choisissez votre créneau</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Renseignez vos coordonnées directement dans Calendly pour recevoir la confirmation et synchroniser automatiquement le rendez-vous avec le CRM.</p></div>
    <iframe title="Calendrier de réservation AE WEB DIGITAL" src="https://calendly.com/allaineric/decouverte?hide_gdpr_banner=1" className="h-[680px] w-full rounded-xl border border-border bg-background" loading="lazy" />
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-muted-foreground">Vos données sont traitées par Calendly pour organiser le rendez-vous.</p><a href="https://calendly.com/allaineric/decouverte" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline">Ouvrir le calendrier dans un nouvel onglet <ArrowRight className="size-4" /></a></div>
    <div className="mt-10 overflow-hidden rounded-2xl border border-[#615FFF]/30 bg-[#615FFF]/10 p-5 sm:p-6"><p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">Confirmation personnalisée</p><h4 className="mt-2 text-xl font-semibold tracking-tight text-foreground">Recevez le récapitulatif de votre audit par email.</h4><p className="mt-2 text-sm leading-6 text-muted-foreground">Après avoir réservé votre créneau dans Calendly, indiquez votre adresse pour recevoir les bénéfices de l’audit et les prochaines étapes.</p></div>
    <div className="mt-10 overflow-hidden rounded-2xl border border-[#615FFF]/30 bg-[#615FFF]/10 p-5 sm:p-6">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">Après votre réservation</p>
        <h4 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Vous saurez exactement quoi faire ensuite.</h4>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {recapItems.map((item, index) => <motion.div key={item.title} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }} className="rounded-xl border border-border bg-card/80 p-4"><item.icon className="size-5 text-accent" /><p className="mt-3 text-sm font-semibold text-foreground">{item.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p></motion.div>)}
        </div>
      </motion.div>
    </div>
  </div>
}

type ChatMessage = { role: 'assistant' | 'user'; text: string }

const chatbotReplies = [
  { keywords: ['prix', 'gratuit', 'coût', 'cout', 'tarif'], answer: 'L’Audit Express est gratuit et sans engagement. Il dure 30 minutes en visio, sans carte bancaire ni préparation particulière.' },
  { keywords: ['durée', 'duree', 'temps', 'minutes'], answer: 'L’échange dure exactement 30 minutes. Des créneaux sont disponibles tôt le matin ou après 18h30.' },
  { keywords: ['secteur', 'activité', 'activite', 'artisan', 'commerce'], answer: 'L’audit est conçu pour les TPE de 1 à 10 salariés : artisans, commerçants, indépendants, professions libérales et prestataires de services.' },
  { keywords: ['obtenir', 'reçois', 'recois', 'après', 'apres', 'résultat', 'resultat'], answer: 'Vous repartez avec 3 actions prioritaires, chiffrées et adaptées à votre activité pour récupérer du temps et mieux suivre vos opportunités.' },
]

function getChatbotReply(message: string) {
  const normalizedMessage = message.toLowerCase()
  const match = chatbotReplies.find((item) => item.keywords.some((keyword) => normalizedMessage.includes(keyword)))
  return match?.answer ?? 'Je peux vous renseigner sur le prix, la durée, les secteurs concernés ou ce que vous obtenez après l’audit. Que souhaitez-vous savoir ?'
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', text: 'Bonjour. Je peux répondre à vos questions sur l’Audit Express et vous aider à savoir s’il correspond à votre activité.' }])

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return
    setMessages((current) => [...current, { role: 'user', text: trimmedInput }, { role: 'assistant', text: getChatbotReply(trimmedInput) }])
    setInput('')
  }

  const openBooking = () => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })

  return <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
    {isOpen && <motion.div initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-background/40" role="dialog" aria-label="Assistant Audit Express">
      <div className="flex items-center justify-between border-b border-border bg-primary p-4 text-primary-foreground"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15"><Bot className="size-5" /></span><div><p className="text-sm font-semibold">Assistant Audit Express</p><p className="text-xs text-primary-foreground/70">Réponse immédiate</p></div></div><button type="button" onClick={() => setIsOpen(false)} className="rounded-md p-1 transition-colors hover:bg-primary-foreground/15" aria-label="Fermer le chatbot"><X className="size-4" /></button></div>
      <div className="max-h-72 space-y-3 overflow-y-auto p-4" aria-live="polite">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-5 ${message.role === 'user' ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-background text-muted-foreground'}`}>{message.text}</p></div>)}</div>
      <div className="border-t border-border p-3"><button type="button" onClick={openBooking} className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20">Réserver mon audit <ArrowRight className="size-3.5" /></button><form onSubmit={sendMessage} className="flex gap-2"><label htmlFor="chatbot-message" className="sr-only">Votre question</label><input id="chatbot-message" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Posez votre question…" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" /><button type="submit" className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95" aria-label="Envoyer la question"><ArrowRight className="size-4" /></button></form></div>
    </motion.div>}
    <button type="button" onClick={() => setIsOpen((current) => !current)} className="flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-transform hover:scale-105 active:scale-95" aria-expanded={isOpen} aria-label={isOpen ? 'Fermer le chatbot' : 'Ouvrir le chatbot'}><Bot className="size-5" /><span className="hidden sm:inline">Une question ?</span></button>
  </div>
}

function AuditExpress() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const scrollToBooking = () => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })
  return <main className="min-h-dvh overflow-hidden bg-background text-foreground pb-20 md:pb-0">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"><a href="#top" className="flex items-center gap-2" aria-label="AE WEB DIGITAL, accueil"><span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground">AE</span><span className="text-sm font-bold tracking-[0.12em] text-foreground">AE WEB <span className="text-primary">DIGITAL</span></span></a><div className="hidden items-center gap-5 text-xs text-muted-foreground lg:flex"><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-accent" />30 min · 0 € · Visio</span><a href="mailto:contact@aewebdigital.com" className="hover:text-foreground">contact@aewebdigital.com</a></div><Button onClick={scrollToBooking} size="sm" className="hidden sm:inline-flex">Réserver mon audit <ArrowRight className="size-3.5" /></Button><button onClick={scrollToBooking} className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:hidden" aria-label="Réserver mon audit"><ArrowRight className="size-4" /></button></div></header>

    <section id="top" className="relative mx-auto flex min-h-dvh max-w-7xl items-center px-5 pb-16 pt-28 sm:px-8 lg:pt-32"><div className="absolute left-1/2 top-24 -z-0 size-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" aria-hidden="true" /><div className="relative z-10 w-full"><Reveal><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"><Sparkles className="size-3.5" />Audit Express · 30 minutes · 0 €</div><h1 className="max-w-4xl text-[clamp(2.8rem,6vw,5.65rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground">En 30 minutes, sachez exactement où votre entreprise <span className="text-primary">perd du temps et des clients.</span></h1><p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Un échange avec un consultant qui a dirigé ses propres TPE pendant 15 ans. Vous repartez avec 3 actions concrètes pour récupérer du temps, mieux suivre vos opportunités et éviter de laisser des clients partir. Sans budget, sans compétence technique.</p><div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"><Button onClick={scrollToBooking} size="lg" className="h-13 w-full px-6 text-base shadow-xl shadow-primary/25 sm:w-auto">Réserver mon Audit Express <ArrowRight className="size-5" /></Button><span className="text-xs text-muted-foreground">Gratuit · sans engagement · 30 min chrono</span></div><ul className="mt-8 grid max-w-3xl gap-3 text-sm text-muted-foreground sm:grid-cols-3 sm:gap-5"><li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-accent" />Aucune vente pendant l’appel</li><li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-accent" />3 actions écrites et chiffrées</li><li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-accent" />Créneaux avant 8h ou après 18h</li></ul></Reveal></div></section>

    <section className="border-y border-border bg-card/45"><div className="mx-auto grid max-w-7xl divide-y divide-border px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-y-0"><div className="flex gap-3 py-5 lg:px-7 lg:first:pl-0"><Clock3 className="mt-0.5 size-5 text-accent" /><div><p className="text-sm font-semibold">30 minutes</p><p className="mt-1 text-xs text-muted-foreground">Pas une de plus</p></div></div><div className="flex gap-3 py-5 sm:pl-7 lg:px-7"><ShieldCheck className="mt-0.5 size-5 text-accent" /><div><p className="text-sm font-semibold">100 % gratuit</p><p className="mt-1 text-xs text-muted-foreground">Aucune carte demandée</p></div></div><div className="flex gap-3 py-5 sm:pl-7 lg:px-7"><Video className="mt-0.5 size-5 text-primary" /><div><p className="text-sm font-semibold">En visio</p><p className="mt-1 text-xs text-muted-foreground">Depuis votre bureau</p></div></div><div className="flex gap-3 py-5 sm:pl-7 lg:pr-0"><MessageCircle className="mt-0.5 size-5 text-primary" /><div><p className="text-sm font-semibold">Zéro jargon</p><p className="mt-1 text-xs text-muted-foreground">On parle métier</p></div></div></div></section>

    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-32"><Reveal><SectionLabel>Le vrai problème</SectionLabel><h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Votre entreprise tourne. Mais vous passez vos soirées à rattraper la journée et vos clients vous échappent.</h2></Reveal><Reveal delay={0.1} className="lg:pt-10"><div className="max-w-xl space-y-6 text-base leading-7 text-muted-foreground"><p>Relance de devis manuelle. Demandes clients sans réponse. Même information saisie dans trois outils. Ces petites frictions vous prennent du temps et donnent à vos prospects une raison d’aller ailleurs.</p><div className="border-l-2 border-primary pl-5 text-lg font-medium leading-7 text-foreground"><span className="text-primary">Ce n’est pas un problème de motivation.</span> C’est un problème de suivi et d’organisation. Et les heures comme les clients perdus ne reviennent pas.</div><p>Un devis non relancé, une réponse trop tardive ou une demande oubliée, c’est du chiffre d’affaires déjà perdu. L’audit Express vous aide à mettre un chiffre et un premier geste sur ce qui vous échappe.</p></div></Reveal><Reveal className="lg:col-span-2" delay={0.18}><div className="grid gap-6 rounded-2xl border border-primary/25 bg-primary/10 p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8"><div className="text-6xl font-semibold tracking-[-0.08em] text-primary sm:text-7xl">+9h</div><div><p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">Le bénéfice concret</p><h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Jusqu’à une journée de travail récupérée chaque semaine.</h3><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">Ces heures ne disparaissent pas dans un nouveau tableau de bord : elles redeviennent du temps pour répondre à vos clients, relancer vos devis, développer votre activité ou simplement terminer votre journée à l’heure.</p></div></div></Reveal></section>

    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16"><SiteAudit /></section>
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16"><SavingsCalculator /></section>

    <section className="bg-card/55"><div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"><Reveal><SectionLabel>Ce que vous obtenez</SectionLabel><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">À la fin des 30 minutes, vous avez quelque chose à faire.</h2><p className="max-w-xs text-sm leading-6 text-muted-foreground">Pas un rapport de 40 pages. Un plan lisible, adapté à votre réalité.</p></div></Reveal><div className="mt-12 grid gap-4 lg:grid-cols-3">{benefits.map((benefit, index) => <Reveal key={benefit.number} delay={index * 0.08}><article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 sm:p-6"><div className="flex items-start gap-4"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><benefit.icon className="size-5" /></div><div className="min-w-0"><span className="font-mono text-xs text-muted-foreground">{benefit.number}</span><h3 className="mt-2 text-lg font-semibold leading-snug">{benefit.title}</h3></div></div><p className="mt-5 text-sm leading-6 text-muted-foreground">{benefit.text}</p></article></Reveal>)}</div><div className="mt-10"><Button onClick={scrollToBooking} variant="outline" className="border-[#615FFF] bg-[#615FFF] text-white hover:border-[#615FFF]/90 hover:bg-[#615FFF]/90 hover:text-white">Je réserve mes 30 minutes <ArrowRight className="size-4" /></Button></div></div></section>

    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><Reveal><SectionLabel>Le déroulé</SectionLabel><h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Un audit simple, en trois temps.</h2><p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground">La méthode est préparée pour repérer à la fois les heures qui disparaissent et les clients qui ne sont pas suffisamment suivis. Vous n’avez rien à installer, aucun document à envoyer et aucun jargon à comprendre.</p></Reveal><div className="relative grid gap-4"><div className="absolute bottom-8 left-[1.15rem] top-8 hidden w-px bg-border sm:block" aria-hidden="true" />{[['01', 'Avant l’échange', 'Vous choisissez votre créneau', 'Calendly vous propose les disponibilités. Vous renseignez vos coordonnées et recevez immédiatement le lien visio par email.'], ['02', 'Pendant les 30 minutes', 'Nous faisons le tri ensemble', 'Je vous pose des questions ciblées sur vos journées, vos clients et vos outils pour repérer les tâches qui vous font perdre du temps.'], ['03', 'Après l’audit', 'Vous repartez avec un plan clair', 'Vous recevez vos 3 actions prioritaires, chiffrées et adaptées à votre réalité, à lancer dès cette semaine.']].map(([number, title, heading, text], index) => <Reveal key={number} delay={index * 0.08}><div className="relative flex gap-5 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:gap-6 sm:p-6"><span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-card font-mono text-xs font-semibold text-accent">{number}</span><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-accent">{title}</p><h3 className="mt-2 text-lg font-semibold">{heading}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{text}</p></div></div></Reveal>)}</div></div></section>

    <section className="bg-card/55"><div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"><Reveal><SectionLabel>Témoignages</SectionLabel><h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Ils ont structuré leur croissance</h2></Reveal><div className="mt-12 grid gap-5 lg:grid-cols-3">{testimonials.map((testimonial, index) => <Reveal key={testimonial.name} delay={index * 0.08}><article className="flex h-full flex-col rounded-2xl border border-border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 sm:p-8"><div className="flex gap-1 text-accent" aria-label="5 étoiles">{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} className="size-5 fill-current" aria-hidden="true" />)}</div><blockquote className="mt-8 flex-1 text-xl leading-[1.55] text-muted-foreground">“{testimonial.quote}”</blockquote><footer className="mt-8 border-t border-border pt-6"><p className="text-xl font-semibold text-foreground">{testimonial.name}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{testimonial.role}</p></footer></article></Reveal>)}</div></div></section>

    <section className="bg-primary text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-center lg:py-28"><Reveal><p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-foreground/70">Cas client réel · 2026</p><p className="mt-5 text-7xl font-semibold tracking-[-0.08em] sm:text-9xl">+9h</p><p className="mt-2 max-w-xs text-lg font-medium">récupérées chaque semaine, soit plus d’une journée de travail.</p></Reveal><Reveal delay={0.12}><blockquote className="max-w-2xl border-l border-primary-foreground/30 pl-6 text-xl leading-8 sm:pl-10 sm:text-3xl sm:leading-[1.3]">“Je passais mes dimanches soirs à relancer mes devis et à rattraper ma comptabilité. Aujourd’hui c’est automatique et je récupère mes week-ends.”<footer className="mt-6 text-sm font-normal text-primary-foreground/70">Dirigeante TPE · 6 salariés · accompagnement 2026</footer></blockquote></Reveal></div></section>

    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"><div className="grid gap-8 rounded-2xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-2 lg:p-14"><Reveal><SectionLabel>Soyons clairs</SectionLabel><h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Un bon audit commence par un bon match.</h2><p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground">Cette offre n’est pas pour tout le monde. Et c’est volontaire.</p></Reveal><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-accent/30 bg-accent/5 p-5"><h3 className="flex items-center gap-2 font-semibold text-accent"><Check className="size-4" />C’est pour vous si</h3><ul className="mt-5 space-y-3 text-sm leading-5 text-muted-foreground"><li>TPE de 1 à 10 salariés</li><li>Vous répétez les mêmes tâches</li><li>Des devis restent sans relance</li><li>Vos outils ne communiquent pas</li></ul></div><div className="rounded-xl border border-border bg-background p-5"><h3 className="flex items-center gap-2 font-semibold text-muted-foreground"><X className="size-4" />Ce n’est pas pour vous si</h3><ul className="mt-5 space-y-3 text-sm leading-5 text-muted-foreground"><li>Vous cherchez juste un logo</li><li>Vous voulez un devis sans parler métier</li><li>Vous attendez une solution miracle</li><li>Vous ne voulez rien changer</li></ul></div></div></div></section>

    <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8 lg:pb-32"><Reveal><SectionLabel>Questions fréquentes</SectionLabel><h2 className="mb-10 text-3xl font-semibold tracking-tight sm:text-5xl">Avant de réserver, les vraies questions.</h2></Reveal><div className="divide-y divide-border border-y border-border">{faqItems.map(([question, answer], index) => <div key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} className="flex w-full items-center justify-between gap-6 py-5 text-left font-medium transition-colors hover:text-primary"><span>{question}</span><ChevronDown className={`size-5 shrink-0 text-muted-foreground transition-transform ${openFaq === index ? 'rotate-180 text-primary' : ''}`} /></button>{openFaq === index && <div className="max-w-2xl pb-5 pr-10 text-sm leading-6 text-muted-foreground">{answer}</div>}</div>)}</div></section>

    <section id="reservation" className="border-t border-border bg-card/60"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:py-32"><Reveal><SectionLabel>Dernière étape</SectionLabel><h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Trente minutes maintenant, pour récupérer du temps et arrêter de laisser des clients vous échapper.</h2><p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">Réservez votre audit gratuit. Vous saurez quoi améliorer, dans quel ordre, pour protéger votre temps et votre chiffre d’affaires.</p><div className="mt-8 grid gap-4 text-sm text-muted-foreground"><p className="flex gap-3"><MousePointer2 className="size-4 shrink-0 text-accent" />Choix du créneau en 2 minutes</p><p className="flex gap-3"><Mail className="size-4 shrink-0 text-accent" />Confirmation par email</p><p className="flex gap-3"><ShieldCheck className="size-4 shrink-0 text-accent" />Aucun engagement, aucune carte</p></div></Reveal><Reveal delay={0.1}><BookingForm /></Reveal></div></section>

    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:pb-32"><Reveal><div className="rounded-[1.75rem] border border-border bg-card px-6 py-16 text-center shadow-sm sm:px-12 sm:py-20 lg:px-20"><h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">Arrêtez de perdre du temps et de laisser vos clients partir.</h2><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">En 30 minutes, identifiez vos principales fuites et repartez avec un plan concret pour récupérer vos heures et vos opportunités commerciales.</p><Button onClick={scrollToBooking} size="lg" className="mt-9 h-13 px-7 text-base shadow-xl shadow-primary/20">Réserver mon audit gratuitement <ArrowRight className="size-5" /></Button></div></Reveal></section>

    <section className="border-y border-border bg-card/45"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-14"><Reveal><p className="text-center font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Ils nous font confiance</p><div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-7 sm:grid-cols-3 lg:grid-cols-5"><span className="text-center text-lg font-black uppercase leading-none tracking-[-0.06em] text-foreground/75 sm:text-xl">OpenClassrooms</span><span className="text-center text-lg font-semibold tracking-[-0.03em] text-foreground/65 sm:text-xl">romwerse</span><span className="text-center text-lg font-semibold tracking-[-0.04em] text-foreground/75 sm:text-xl">Matchers</span><span className="text-center text-lg font-bold tracking-[-0.04em] text-foreground/70 sm:text-xl">Aptik <span className="block text-[0.55em] font-medium uppercase tracking-[0.08em]">Roetencoles</span></span><span className="col-span-2 text-center text-lg font-black uppercase tracking-[-0.04em] text-foreground/70 sm:col-span-1 sm:text-xl">Activat<span className="font-medium">eur</span></span></div></Reveal></div></section>

    <footer className="border-t border-border"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-muted-foreground sm:px-8 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold text-foreground">AE WEB DIGITAL</p><p className="mt-2 text-xs">Créer · Innover · Développer</p></div><p className="max-w-sm text-xs leading-5">Éric Allain · Consultant en transition numérique pour TPE<br />Paris 75014 · <a className="hover:text-foreground" href="mailto:contact@aewebdigital.com">contact@aewebdigital.com</a></p><div className="flex gap-4 text-xs"><a href="mailto:contact@aewebdigital.com" className="hover:text-foreground">Mentions légales</a><span>© 2026 AE WEB DIGITAL</span></div></div></footer>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-xl md:hidden"><Button onClick={scrollToBooking} className="h-11 w-full shadow-lg shadow-primary/25">Réserver mon Audit Express <ArrowRight className="size-4" /></Button></div>
    <Chatbot />
  </main>
}
