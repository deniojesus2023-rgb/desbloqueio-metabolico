// Quiz Data v3.0 — Arco Emocional de Qualificação Profunda
// Framework: BetterMe + ColonBroom + Noom + Ryan Levesque Ask Method
// Estrutura: Positivo → Neutro → Negativo → Alívio (7 perguntas)

export type Language = 'pt' | 'es';

export interface QuizOption {
  id: string;
  emoji: string;
  text: string;
  blockType?: 'cortisol' | 'insulina' | 'hormonal';
}

export interface QuizQuestion {
  id: string;
  phase: 'positive' | 'neutral' | 'negative' | 'relief';
  multiple?: boolean;
  question: string;
  subtitle?: string;
  options: QuizOption[];
  dynamicByAnswer?: {
    questionId: string;
    variants: Record<string, QuizOption[]>;
    defaultOptions: QuizOption[];
  };
}

export interface BlockProfile {
  type: 'cortisol' | 'insulina' | 'hormonal';
  name: string;
  badge: string;
  color: string;
  blockPercentage: number;
  mechanism: string;
  absolution: string;
  insights: string[];
}

// ─── PERGUNTAS PT-BR ──────────────────────────────────────────────────────────

export const quizQuestionsPT: QuizQuestion[] = [
  {
    id: 'q1_identity',
    phase: 'positive',
    question: 'Esse ano, eu sou alguém que...',
    subtitle: 'Escolha a opção que mais combina com você',
    options: [
      { id: 'a', emoji: '🌟', text: 'Finalmente vai descobrir o que está impedindo meu corpo de emagrecer' },
      { id: 'b', emoji: '💪', text: 'Está pronta para entender meu metabolismo de verdade' },
      { id: 'c', emoji: '🔥', text: 'Merece acordar com energia e se sentir bem no próprio corpo' },
      { id: 'd', emoji: '🎯', text: 'Vai encontrar uma solução que funcione para o MEU corpo, não para qualquer um' },
    ],
  },
  {
    id: 'q2_commitment',
    phase: 'positive',
    question: 'Quando penso em emagrecer, eu me sinto...',
    subtitle: 'Seja honesta — todas as respostas são válidas',
    options: [
      { id: 'a', emoji: '🌱', text: 'Determinada a encontrar o que realmente funciona para mim' },
      { id: 'b', emoji: '🔍', text: 'Curiosa para entender por que meu corpo reage diferente do que esperava' },
      { id: 'c', emoji: '💡', text: 'Pronta para tentar uma abordagem diferente de tudo que já tentei' },
      { id: 'd', emoji: '⚡', text: 'Motivada, mas preciso de direção — não quero errar de novo' },
    ],
  },
  {
    id: 'q3_situation',
    phase: 'neutral',
    question: 'Nos últimos 6 meses, meu peso...',
    subtitle: 'Isso nos ajuda a identificar seu tipo de bloqueio',
    options: [
      { id: 'a', emoji: '📈', text: 'Aumentou mesmo sem comer mais do que antes', blockType: 'cortisol' },
      { id: 'b', emoji: '🔄', text: 'Fica subindo e descendo — perco e recupero sempre', blockType: 'hormonal' },
      { id: 'c', emoji: '🧱', text: 'Travou completamente — não sobe, mas também não desce', blockType: 'insulina' },
      { id: 'd', emoji: '😔', text: 'Continua igual mesmo quando faço dieta e exercício', blockType: 'insulina' },
    ],
  },
  {
    id: 'q4_attempts',
    phase: 'neutral',
    question: 'Já tentei emagrecer com...',
    subtitle: 'Pode marcar mais de uma opção',
    multiple: true,
    options: [
      { id: 'a', emoji: '🥗', text: 'Dietas restritivas (low carb, cetogênica, etc.)' },
      { id: 'b', emoji: '🏃', text: 'Academia e exercícios intensos' },
      { id: 'c', emoji: '💊', text: 'Remédios ou suplementos para emagrecer' },
      { id: 'd', emoji: '🍵', text: 'Chás, detox e produtos naturais' },
      { id: 'e', emoji: '📱', text: 'Apps de contagem de calorias' },
      { id: 'f', emoji: '🩺', text: 'Acompanhamento médico ou nutricional' },
    ],
  },
  {
    id: 'q5_frustration',
    phase: 'negative',
    question: 'O que mais me frustra é...',
    subtitle: 'Escolha o que mais ressoa com você',
    options: [],
    dynamicByAnswer: {
      questionId: 'q3_situation',
      variants: {
        a: [
          { id: 'a', emoji: '😤', text: 'Fazer tudo certo e não ver resultado nenhum' },
          { id: 'b', emoji: '😞', text: 'Sentir que meu corpo está trabalhando contra mim' },
          { id: 'c', emoji: '😢', text: 'Olhar no espelho e não me reconhecer mais' },
          { id: 'd', emoji: '🤯', text: 'Não entender o que está acontecendo com meu metabolismo' },
        ],
        b: [
          { id: 'a', emoji: '😤', text: 'Perder peso e recuperar tudo de volta em semanas' },
          { id: 'b', emoji: '😞', text: 'Não conseguir manter o resultado que conquistei com tanto esforço' },
          { id: 'c', emoji: '😢', text: 'Sentir que nunca vou conseguir estabilizar meu peso de vez' },
          { id: 'd', emoji: '🤯', text: 'Ficar presa nesse ciclo de perder e ganhar sem fim' },
        ],
        c: [
          { id: 'a', emoji: '😤', text: 'Meu corpo parou de responder — parece que nada funciona mais' },
          { id: 'b', emoji: '😞', text: 'Fazer dieta, malhar e a balança não mover um grama' },
          { id: 'c', emoji: '😢', text: 'Sentir que meu metabolismo está quebrado e não tem conserto' },
          { id: 'd', emoji: '🤯', text: 'Cada vez precisar de mais esforço para manter o mesmo resultado' },
        ],
        d: [
          { id: 'a', emoji: '😤', text: 'Comer menos que todo mundo e engordar mais' },
          { id: 'b', emoji: '😞', text: 'Ver outras pessoas emagrecerem fazendo menos do que eu' },
          { id: 'c', emoji: '😢', text: 'Sentir que meu corpo é diferente e as soluções normais não são para mim' },
          { id: 'd', emoji: '🤯', text: 'Seguir todas as regras e não ver nenhuma diferença' },
        ],
      },
      defaultOptions: [
        { id: 'a', emoji: '😤', text: 'Fazer tudo certo e não ver resultado nenhum' },
        { id: 'b', emoji: '😞', text: 'Sentir que meu corpo está trabalhando contra mim' },
        { id: 'c', emoji: '😢', text: 'Olhar no espelho e não me reconhecer mais' },
        { id: 'd', emoji: '🤯', text: 'Não entender o que está acontecendo com meu metabolismo' },
      ],
    },
  },
  {
    id: 'q6_impact',
    phase: 'negative',
    question: 'Isso está afetando minha vida porque...',
    subtitle: 'Pode marcar mais de uma opção',
    multiple: true,
    options: [
      { id: 'a', emoji: '👗', text: 'Evito sair, usar certas roupas ou aparecer em fotos' },
      { id: 'b', emoji: '😴', text: 'Me sinto cansada o tempo todo, sem energia para o que importa' },
      { id: 'c', emoji: '💔', text: 'Afeta minha autoestima e como me sinto nas relações' },
      { id: 'd', emoji: '🏥', text: 'Estou preocupada com minha saúde a longo prazo' },
      { id: 'e', emoji: '😔', text: 'Sinto que perdi o controle do meu próprio corpo' },
    ],
  },
  {
    id: 'q7_desire',
    phase: 'relief',
    question: 'O que eu realmente quero é...',
    subtitle: 'Escolha o que mais representa seu desejo',
    options: [
      { id: 'a', emoji: '✨', text: 'Entender por que meu corpo não responde e ter uma solução personalizada' },
      { id: 'b', emoji: '🎯', text: 'Uma abordagem que funcione para o MEU tipo de metabolismo, não uma dieta genérica' },
      { id: 'c', emoji: '🌅', text: 'Me sentir leve, com energia e bem no meu corpo — sem passar fome' },
      { id: 'd', emoji: '🔓', text: 'Destravar o que está bloqueando meu metabolismo de uma vez por todas' },
    ],
  },
];

// ─── PERGUNTAS ES-LATAM ───────────────────────────────────────────────────────

export const quizQuestionsES: QuizQuestion[] = [
  {
    id: 'q1_identity',
    phase: 'positive',
    question: 'Este año, soy alguien que...',
    subtitle: 'Elige la opción que más te representa',
    options: [
      { id: 'a', emoji: '🌟', text: 'Por fin va a descubrir qué está impidiendo que mi cuerpo adelgace' },
      { id: 'b', emoji: '💪', text: 'Está lista para entender mi metabolismo de verdad' },
      { id: 'c', emoji: '🔥', text: 'Merece despertar con energía y sentirse bien en su propio cuerpo' },
      { id: 'd', emoji: '🎯', text: 'Va a encontrar una solución que funcione para MI cuerpo, no para cualquiera' },
    ],
  },
  {
    id: 'q2_commitment',
    phase: 'positive',
    question: 'Cuando pienso en adelgazar, me siento...',
    subtitle: 'Sé honesta — todas las respuestas son válidas',
    options: [
      { id: 'a', emoji: '🌱', text: 'Decidida a encontrar lo que realmente funciona para mí' },
      { id: 'b', emoji: '🔍', text: 'Curiosa por entender por qué mi cuerpo reacciona diferente a lo esperado' },
      { id: 'c', emoji: '💡', text: 'Lista para probar un enfoque diferente a todo lo que ya intenté' },
      { id: 'd', emoji: '⚡', text: 'Motivada, pero necesito dirección — no quiero equivocarme otra vez' },
    ],
  },
  {
    id: 'q3_situation',
    phase: 'neutral',
    question: 'En los últimos 6 meses, mi peso...',
    subtitle: 'Esto nos ayuda a identificar tu tipo de bloqueo',
    options: [
      { id: 'a', emoji: '📈', text: 'Aumentó aunque no como más que antes', blockType: 'cortisol' },
      { id: 'b', emoji: '🔄', text: 'Sube y baja — pierdo y recupero siempre', blockType: 'hormonal' },
      { id: 'c', emoji: '🧱', text: 'Se bloqueó completamente — no sube, pero tampoco baja', blockType: 'insulina' },
      { id: 'd', emoji: '😔', text: 'Sigue igual aunque haga dieta y ejercicio', blockType: 'insulina' },
    ],
  },
  {
    id: 'q4_attempts',
    phase: 'neutral',
    question: 'Ya intenté adelgazar con...',
    subtitle: 'Puedes marcar más de una opción',
    multiple: true,
    options: [
      { id: 'a', emoji: '🥗', text: 'Dietas restrictivas (low carb, cetogénica, etc.)' },
      { id: 'b', emoji: '🏃', text: 'Gimnasio y ejercicios intensos' },
      { id: 'c', emoji: '💊', text: 'Medicamentos o suplementos para adelgazar' },
      { id: 'd', emoji: '🍵', text: 'Tés, detox y productos naturales' },
      { id: 'e', emoji: '📱', text: 'Apps de conteo de calorías' },
      { id: 'f', emoji: '🩺', text: 'Seguimiento médico o nutricional' },
    ],
  },
  {
    id: 'q5_frustration',
    phase: 'negative',
    question: 'Lo que más me frustra es...',
    subtitle: 'Elige lo que más resuena contigo',
    options: [],
    dynamicByAnswer: {
      questionId: 'q3_situation',
      variants: {
        a: [
          { id: 'a', emoji: '😤', text: 'Hacer todo bien y no ver ningún resultado' },
          { id: 'b', emoji: '😞', text: 'Sentir que mi cuerpo trabaja en mi contra' },
          { id: 'c', emoji: '😢', text: 'Mirarme al espejo y no reconocerme más' },
          { id: 'd', emoji: '🤯', text: 'No entender qué está pasando con mi metabolismo' },
        ],
        b: [
          { id: 'a', emoji: '😤', text: 'Perder peso y recuperarlo todo en semanas' },
          { id: 'b', emoji: '😞', text: 'No poder mantener el resultado que logré con tanto esfuerzo' },
          { id: 'c', emoji: '😢', text: 'Sentir que nunca voy a estabilizar mi peso definitivamente' },
          { id: 'd', emoji: '🤯', text: 'Quedarme atrapada en este ciclo de perder y ganar sin fin' },
        ],
        c: [
          { id: 'a', emoji: '😤', text: 'Mi cuerpo dejó de responder — parece que nada funciona más' },
          { id: 'b', emoji: '😞', text: 'Hacer dieta, entrenar y la balanza no moverse ni un gramo' },
          { id: 'c', emoji: '😢', text: 'Sentir que mi metabolismo está roto y no tiene arreglo' },
          { id: 'd', emoji: '🤯', text: 'Cada vez necesitar más esfuerzo para mantener el mismo resultado' },
        ],
        d: [
          { id: 'a', emoji: '😤', text: 'Comer menos que todos y engordar más' },
          { id: 'b', emoji: '😞', text: 'Ver a otras personas adelgazar haciendo menos que yo' },
          { id: 'c', emoji: '😢', text: 'Sentir que mi cuerpo es diferente y las soluciones normales no son para mí' },
          { id: 'd', emoji: '🤯', text: 'Seguir todas las reglas y no ver ninguna diferencia' },
        ],
      },
      defaultOptions: [
        { id: 'a', emoji: '😤', text: 'Hacer todo bien y no ver ningún resultado' },
        { id: 'b', emoji: '😞', text: 'Sentir que mi cuerpo trabaja en mi contra' },
        { id: 'c', emoji: '😢', text: 'Mirarme al espejo y no reconocerme más' },
        { id: 'd', emoji: '🤯', text: 'No entender qué está pasando con mi metabolismo' },
      ],
    },
  },
  {
    id: 'q6_impact',
    phase: 'negative',
    question: 'Esto está afectando mi vida porque...',
    subtitle: 'Puedes marcar más de una opción',
    multiple: true,
    options: [
      { id: 'a', emoji: '👗', text: 'Evito salir, usar ciertas ropas o aparecer en fotos' },
      { id: 'b', emoji: '😴', text: 'Me siento cansada todo el tiempo, sin energía para lo que importa' },
      { id: 'c', emoji: '💔', text: 'Afecta mi autoestima y cómo me siento en mis relaciones' },
      { id: 'd', emoji: '🏥', text: 'Estoy preocupada por mi salud a largo plazo' },
      { id: 'e', emoji: '😔', text: 'Siento que perdí el control de mi propio cuerpo' },
    ],
  },
  {
    id: 'q7_desire',
    phase: 'relief',
    question: 'Lo que realmente quiero es...',
    subtitle: 'Elige lo que más representa tu deseo',
    options: [
      { id: 'a', emoji: '✨', text: 'Entender por qué mi cuerpo no responde y tener una solución personalizada' },
      { id: 'b', emoji: '🎯', text: 'Un enfoque que funcione para MI tipo de metabolismo, no una dieta genérica' },
      { id: 'c', emoji: '🌅', text: 'Sentirme liviana, con energía y bien en mi cuerpo — sin pasar hambre' },
      { id: 'd', emoji: '🔓', text: 'Desbloquear lo que está bloqueando mi metabolismo de una vez por todas' },
    ],
  },
];

// ─── PERFIS DE RESULTADO PT-BR ────────────────────────────────────────────────

export const blockProfilesPT: Record<string, BlockProfile> = {
  cortisol: {
    type: 'cortisol',
    name: 'A Acumuladora de Estresse',
    badge: 'Tipo 1 — A Acumuladora de Estresse',
    color: '#E53E3E',
    blockPercentage: 73,
    mechanism: 'Cortisol Elevado',
    absolution: 'Seus padrões indicam que o estresse crônico está elevando seu cortisol — o hormônio que literalmente ordena ao seu corpo para guardar gordura na barriga. Não é falta de força de vontade. É bioquímica. E tem solução.',
    insights: [
      'Seu corpo está em modo de sobrevivência — não de emagrecimento',
      'As dietas restritivas que você tentou provavelmente aumentaram seu cortisol',
      'O protocolo correto para o SEU tipo age em 3 minutos por dia',
    ],
  },
  insulina: {
    type: 'insulina',
    name: 'A Resistente Crônica',
    badge: 'Tipo 2 — A Resistente Crônica',
    color: '#2B6CB0',
    blockPercentage: 68,
    mechanism: 'Resistência à Insulina',
    absolution: 'Seus padrões mostram resistência à insulina — seu corpo está produzindo insulina em excesso, o que bloqueia a queima de gordura mesmo quando você come pouco. Não é sua culpa. É uma resposta metabólica. E tem solução.',
    insights: [
      'Contar calorias não funciona para o seu tipo de bloqueio',
      'Seu metabolismo está travado em modo de armazenamento',
      'O protocolo correto para o SEU tipo reativa a queima em dias',
    ],
  },
  hormonal: {
    type: 'hormonal',
    name: 'A Sabotera Hormonal',
    badge: 'Tipo 3 — A Sabotera Hormonal',
    color: '#6B46C1',
    blockPercentage: 71,
    mechanism: 'Desequilíbrio Hormonal',
    absolution: 'Seus padrões indicam desequilíbrio hormonal — estrogênio, progesterona e cortisol fora de sincronia, o que faz seu corpo reter gordura como mecanismo de proteção. Não é sua idade. É hormônio. E tem solução.',
    insights: [
      'O efeito sanfona é uma resposta hormonal, não falta de disciplina',
      'Exercícios intensos podem estar piorando seu desequilíbrio',
      'O protocolo correto para o SEU tipo reequilibra em semanas',
    ],
  },
};

// ─── PERFIS DE RESULTADO ES-LATAM ─────────────────────────────────────────────

export const blockProfilesES: Record<string, BlockProfile> = {
  cortisol: {
    type: 'cortisol',
    name: 'Bloqueo de Cortisol',
    badge: 'Tipo 1 — Bloqueo del Estrés',
    color: '#E53E3E',
    blockPercentage: 73,
    mechanism: 'Cortisol Elevado',
    absolution: 'Tus patrones indican que el estrés crónico está elevando tu cortisol — la hormona que literalmente le ordena a tu cuerpo guardar grasa en el abdomen. No es falta de fuerza de voluntad. Es bioquímica. Y tiene solución.',
    insights: [
      'Tu cuerpo está en modo supervivencia — no en modo adelgazamiento',
      'Las dietas restrictivas que intentaste probablemente aumentaron tu cortisol',
      'El protocolo correcto para TU tipo actúa en 3 minutos al día',
    ],
  },
  insulina: {
    type: 'insulina',
    name: 'Bloqueo de Insulina',
    badge: 'Tipo 2 — Bloqueo Metabólico',
    color: '#2B6CB0',
    blockPercentage: 68,
    mechanism: 'Resistencia a la Insulina',
    absolution: 'Tus patrones muestran resistencia a la insulina — tu cuerpo está produciendo insulina en exceso, lo que bloquea la quema de grasa incluso cuando comes poco. No es tu culpa. Es una respuesta metabólica. Y tiene solución.',
    insights: [
      'Contar calorías no funciona para tu tipo de bloqueo',
      'Tu metabolismo está bloqueado en modo almacenamiento',
      'El protocolo correcto para TU tipo reactiva la quema en días',
    ],
  },
  hormonal: {
    type: 'hormonal',
    name: 'Bloqueo Hormonal',
    badge: 'Tipo 3 — Bloqueo Hormonal',
    color: '#6B46C1',
    blockPercentage: 71,
    mechanism: 'Desequilibrio Hormonal',
    absolution: 'Tus patrones indican desequilibrio hormonal — estrógeno, progesterona y cortisol fuera de sincronía, lo que hace que tu cuerpo retenga grasa como mecanismo de protección. No es tu edad. Son las hormonas. Y tiene solución.',
    insights: [
      'El efecto rebote es una respuesta hormonal, no falta de disciplina',
      'Los ejercicios intensos pueden estar empeorando tu desequilibrio',
      'El protocolo correcto para TU tipo reequilibra en semanas',
    ],
  },
};

// ─── TEXTOS DE INTERFACE PT-BR ────────────────────────────────────────────────

export const uiTextsPT = {
  startBadge: 'AVALIAÇÃO METABÓLICA GRATUITA',
  startTitle: 'Descubra qual Bloqueio Metabólico está impedindo você de emagrecer',
  startSubtitle: 'Mesmo comendo pouco e fazendo exercício.',
  startBenefits: ['Sem dietas restritivas', 'Sem passar fome', 'Só 3 minutos por dia'],
  startStats: [
    { value: '47.000+', label: 'Perfis analisados' },
    { value: '89%', label: 'Identificam o bloqueio' },
    { value: '< 3 min', label: 'Para completar' },
  ],
  startCta: 'Iniciar Avaliação Gratuita',
  startTrust: '🔒 Seus dados estão seguros. Sem spam.',
  progressLabel: (current: number, total: number) => `Pergunta ${current} de ${total}`,
  multipleHint: 'Pode selecionar mais de uma opção',
  nextButton: 'Próxima →',
  continueButton: 'Continuar →',
  phaseLabels: {
    positive: 'Sobre você',
    neutral: 'Seu histórico',
    negative: 'Sua situação',
    relief: 'Seu objetivo',
  },
  loadingTexts: [
    'Analisando seu perfil metabólico...',
    'Identificando padrões de bloqueio...',
    'Cruzando com 47.000+ perfis similares...',
    'Seu diagnóstico está pronto.',
  ],
  resultTitle: 'Seu Diagnóstico:',
  resultBlockLabel: 'Nível de Bloqueio Metabólico',
  resultInsightsTitle: 'O que isso significa para você:',
  optinTitle: 'Seu protocolo foi gerado — mas este acesso expira em breve',
  optinSubtitle: 'Identificamos exatamente o que está bloqueando seu metabolismo. Seu protocolo personalizado está pronto. Mas este acesso tem validade — preencha agora enquanto está disponível.',
  optinNamePlaceholder: 'Seu nome',
  optinEmailPlaceholder: 'Seu melhor e-mail',
  optinCta: 'Acessar meu protocolo agora →',
  optinTrust: '🔒 Seus dados estão 100% seguros. Sem spam.',
};

// ─── TEXTOS DE INTERFACE ES-LATAM ─────────────────────────────────────────────

export const uiTextsES = {
  startBadge: 'EVALUACIÓN METABÓLICA GRATUITA',
  startTitle: 'Descubre qué Bloqueo Metabólico te está impidiendo adelgazar',
  startSubtitle: 'Aunque comas poco y hagas ejercicio.',
  startBenefits: ['Sin dietas restrictivas', 'Sin pasar hambre', 'Solo 3 minutos al día'],
  startStats: [
    { value: '47.000+', label: 'Perfiles analizados' },
    { value: '89%', label: 'Identifican el bloqueo' },
    { value: '< 3 min', label: 'Para completar' },
  ],
  startCta: 'Iniciar Evaluación Gratuita',
  startTrust: '🔒 Tus datos están seguros. Sin spam.',
  progressLabel: (current: number, total: number) => `Pregunta ${current} de ${total}`,
  multipleHint: 'Puedes seleccionar más de una opción',
  nextButton: 'Siguiente →',
  continueButton: 'Continuar →',
  phaseLabels: {
    positive: 'Sobre ti',
    neutral: 'Tu historial',
    negative: 'Tu situación',
    relief: 'Tu objetivo',
  },
  loadingTexts: [
    'Analizando tu perfil metabólico...',
    'Identificando patrones de bloqueo...',
    'Cruzando con 47.000+ perfiles similares...',
    'Tu diagnóstico está listo.',
  ],
  resultTitle: 'Tu Diagnóstico:',
  resultBlockLabel: 'Nivel de Bloqueo Metabólico',
  resultInsightsTitle: 'Lo que esto significa para ti:',
  optinTitle: 'Recibe tu protocolo personalizado de desbloqueo',
  optinSubtitle: 'Basado en tu diagnóstico, te enviaremos el protocolo exacto para tu tipo de bloqueo.',
  optinNamePlaceholder: 'Tu nombre',
  optinEmailPlaceholder: 'Tu mejor email',
  optinCta: 'Quiero mi protocolo gratuito →',
  optinTrust: '🔒 Tus datos están 100% seguros. Sin spam.',
};

// ─── FUNÇÃO DE CÁLCULO DO TIPO DE BLOQUEIO ────────────────────────────────────

export function calculateBlockType(answers: Record<string, string | string[]>): 'cortisol' | 'insulina' | 'hormonal' {
  const q3 = answers['q3_situation'];
  if (q3 === 'a') return 'cortisol';
  if (q3 === 'b') return 'hormonal';
  return 'insulina';
}
