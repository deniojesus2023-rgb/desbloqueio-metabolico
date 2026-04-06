export type QuizOption = {
  text: string;
  feedback: string;
  score?: number;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: QuizOption[];
  highlight?: boolean;
  progressLabel?: string;
};

export type BlockType = 1 | 2 | 3;

// ─── VERSÃO PT-BR ───────────────────────────────────────────────────────────

export const QUIZ_QUESTIONS_PT: QuizQuestion[] = [
  {
    id: 0,
    question: "Se você pudesse acordar amanhã com apenas UM desses resultados, qual escolheria?",
    progressLabel: "Vamos começar!",
    options: [
      { text: "Barriga chapada e desinchada", feedback: "Esse é exatamente o sintoma da Trava Metabólica. Vamos identificá-la.", score: 2 },
      { text: "Energia de sobra e roupa mais folgada", feedback: "Perfeito. Energia baixa é um sinal claro de que o metabolismo está travado.", score: 1 },
      { text: "O peso que eu tinha há 5 anos", feedback: "Entendido. Recuperar esse peso é possível quando desbloqueamos o metabolismo.", score: 3 },
      { text: "Todos os anteriores", feedback: "Isso nos diz que a trava afeta múltiplos sistemas. Vamos continuar analisando.", score: 2 },
    ],
  },
  {
    id: 1,
    question: "Você mora em qual região do Brasil?",
    progressLabel: "Personalizando sua avaliação...",
    options: [
      { text: "Sul 🏔️", feedback: "Perfeito. Vamos adaptar o protocolo à sua cultura alimentar.", score: 0 },
      { text: "Sudeste 🏙️", feedback: "Perfeito. Vamos adaptar o protocolo à sua cultura alimentar.", score: 0 },
      { text: "Nordeste ☀️", feedback: "Perfeito. Vamos adaptar o protocolo à sua cultura alimentar.", score: 0 },
      { text: "Centro-Oeste 🌾", feedback: "Perfeito. Vamos adaptar o protocolo à sua cultura alimentar.", score: 0 },
      { text: "Norte 🌿", feedback: "Perfeito. Vamos adaptar o protocolo à sua cultura alimentar.", score: 0 },
    ],
  },
  {
    id: 2,
    question: "Qual dessas situações frustrantes acontece mais com você?",
    progressLabel: "Você está no caminho certo...",
    options: [
      { text: "Faço dieta a semana toda, mas 'estrago tudo' no fim de semana", feedback: "Isso é o ciclo restrição-compulsão. Um sinal claro da Trava Tipo 2.", score: 2 },
      { text: "Perco alguns quilos, mas o peso estagna e recupero tudo", feedback: "O efeito sanfona é a resposta do corpo ao 'modo sobrevivência'. Vamos reverter isso.", score: 2 },
      { text: "Parece que, mesmo comendo pouco, meu corpo 'segura' a gordura na barriga", feedback: "Exatamente. Isso é a Trava Metabólica do Estresse Crônico agindo em tempo real.", score: 3 },
      { text: "Tenho ataques incontroláveis de vontade de comer doce à noite", feedback: "A vontade de doce à noite é um sinal hormonal, não falta de força de vontade. Trava Tipo 3.", score: 3 },
    ],
  },
  {
    id: 3,
    question: "Você sente que o seu problema NÃO é falta de força de vontade, mas que o seu corpo simplesmente parou de responder às dietas tradicionais?",
    highlight: true,
    progressLabel: "Essa é a pergunta-chave...",
    options: [
      { text: "Sim, é exatamente isso que eu sinto!", feedback: "Isso confirma o diagnóstico. Seu corpo tem uma trava real, não um problema de atitude.", score: 3 },
      { text: "Às vezes acho que a culpa é minha", feedback: "Não é sua culpa. A ciência confirma que o corpo bloqueia ativamente a queima de gordura.", score: 2 },
      { text: "Não, simplesmente não consigo seguir dietas", feedback: "Isso também é um sinal. O corpo sabota as dietas quando está em modo sobrevivência.", score: 1 },
    ],
  },
  {
    id: 4,
    question: "A ciência comprova que o estresse bloqueia a queima de gordura. Como está seu nível de estresse e ansiedade nos últimos meses?",
    progressLabel: "Analisando seu perfil hormonal...",
    options: [
      { text: "Muito alto (sempre no limite)", feedback: "O cortisol elevado é o principal ativador da Trava Tipo 1. Dado importante.", score: 3 },
      { text: "Alto (muitas preocupações diárias)", feedback: "O estresse crônico mantém o cortisol elevado e bloqueia a queima de gordura abdominal.", score: 2 },
      { text: "Médio (consigo controlar na maior parte do tempo)", feedback: "Bom. O estresse moderado pode ser manejado com o protocolo de desbloqueio.", score: 1 },
      { text: "Baixo (estou tranquila)", feedback: "Perfeito. Isso descarta a Trava Tipo 1 e nos foca nos outros fatores.", score: 0 },
    ],
  },
  {
    id: 5,
    question: "Qual dessas opções seria um pesadelo abandonar para sempre?",
    progressLabel: "Quase na metade...",
    options: [
      { text: "Arroz com feijão, pão e carboidratos em geral", feedback: "Você não vai precisar abandoná-los. O protocolo permite comê-los sem acumular gordura.", score: 2 },
      { text: "Meus pratos favoritos (churrasco, feijoada, pão de queijo, etc.)", feedback: "Esses pratos fazem parte da sua identidade. O protocolo foi feito para que você os aproveite.", score: 2 },
      { text: "Aquele docinho depois do almoço ou à noite", feedback: "A vontade de doce é um sinal hormonal da Trava Tipo 3. Vamos resolver isso.", score: 3 },
      { text: "Não conseguiria abandonar nenhum deles", feedback: "Perfeito. Você não vai precisar. O protocolo trabalha com o seu estilo de vida, não contra ele.", score: 2 },
    ],
  },
  {
    id: 6,
    question: "Se a ciência comprovasse que tentar 'comer menos' é exatamente o que faz o seu corpo estocar gordura, você estaria disposta a tentar uma abordagem completamente diferente?",
    progressLabel: "Mais da metade! Continue assim...",
    options: [
      { text: "Com certeza, estou cansada de passar fome", feedback: "Essa disposição é tudo que você precisa. O protocolo faz o resto.", score: 3 },
      { text: "Depende do que eu teria que fazer", feedback: "Justo. São apenas 3 minutos antes das refeições. Só isso.", score: 2 },
      { text: "Não, acho que só comendo menos se perde peso", feedback: "Entendemos. Os próximos resultados podem mudar essa perspectiva.", score: 1 },
    ],
  },
  {
    id: 7,
    question: "Se você descobrisse um truque simples de 3 minutos para fazer ANTES das refeições, que te permite comer seus pratos favoritos sem acumular gordura, você conseguiria fazer isso todo dia?",
    highlight: true,
    progressLabel: "Excelente! Quase terminando...",
    options: [
      { text: "Sim, 3 minutos é muito fácil!", feedback: "Perfeito. A consistência é o único requisito do protocolo.", score: 3 },
      { text: "Talvez, se eu me lembrar", feedback: "Vamos te dar um lembrete visual simples para que nunca esqueça.", score: 2 },
      { text: "Não, não tenho tempo nem para isso", feedback: "Entendemos. Mas 3 minutos é menos que preparar um café. Vale a pena tentar.", score: 1 },
    ],
  },
  {
    id: 8,
    question: "Se esse truque funcionasse para você, em quanto tempo gostaria de ver a balança baixar?",
    progressLabel: "Quase pronto...",
    options: [
      { text: "Nos primeiros 7 dias (quero ver rápido para me motivar)", feedback: "Muitas pessoas sentem a barriga mais desinchada já na primeira semana.", score: 3 },
      { text: "Nas primeiras 2 semanas", feedback: "Esse é um prazo muito realista com o protocolo de desbloqueio.", score: 2 },
      { text: "No primeiro mês", feedback: "Perfeito. Com consistência, os resultados no primeiro mês são notáveis.", score: 2 },
      { text: "Não me importo com o tempo, desde que o resultado seja definitivo", feedback: "Essa mentalidade é a mais poderosa. Os resultados definitivos vêm com o desbloqueio real.", score: 3 },
    ],
  },
  {
    id: 9,
    question: "Quanto você já gastou em dietas, nutricionistas, suplementos ou chás que não deram resultado permanente?",
    progressLabel: "Último passo!",
    options: [
      { text: "Mais de R$ 1.000", feedback: "Isso confirma que o problema não era o esforço, mas a abordagem. Vamos mudar isso.", score: 3 },
      { text: "Entre R$ 300 e R$ 1.000", feedback: "Esse dinheiro não foi em vão — te ensinou o que não funciona. Agora veremos o que funciona.", score: 2 },
      { text: "Menos de R$ 300", feedback: "Bom. Isso significa que ainda não encontrou a abordagem certa. Hoje isso muda.", score: 1 },
      { text: "Nunca gastei, só tentei sozinha", feedback: "Isso exige ainda mais coragem. E o protocolo foi feito para funcionar sem ajuda externa.", score: 1 },
    ],
  },
];

export const PROGRESS_LABELS_PT: Record<number, string> = {
  0: "Vamos começar!",
  10: "Você está no caminho certo...",
  20: "Personalizando sua avaliação...",
  30: "Analisando seu perfil hormonal...",
  40: "Quase na metade...",
  50: "Mais da metade! Continue assim...",
  60: "Identificando sua trava principal...",
  70: "Excelente! Quase terminando...",
  80: "Quase pronto...",
  90: "Último passo!",
  100: "Análise concluída!",
};

// ─── VERSÃO ES (LATAM) ───────────────────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 0,
    question: "Si pudieras despertar mañana con solo UNO de estos resultados, ¿cuál elegirías?",
    progressLabel: "¡Empecemos!",
    options: [
      { text: "Un vientre plano y desinflado", feedback: "Ese es exactamente el síntoma del Bloqueo Metabólico. Vamos a identificarlo.", score: 2 },
      { text: "Energía de sobra y ropa más holgada", feedback: "Perfecto. La energía baja es una señal clara de que el metabolismo está bloqueado.", score: 1 },
      { text: "El peso que tenía hace 5 años", feedback: "Entendido. Recuperar ese peso es posible cuando desbloqueamos el metabolismo.", score: 3 },
      { text: "Todos los anteriores", feedback: "Eso nos dice que el bloqueo afecta múltiples sistemas. Sigamos analizando.", score: 2 },
    ],
  },
  {
    id: 1,
    question: "¿A qué país perteneces?",
    progressLabel: "Personalizando tu evaluación...",
    options: [
      { text: "México 🇲🇽", feedback: "Perfecto. Adaptaremos el protocolo a tu cultura alimentaria.", score: 0 },
      { text: "Colombia 🇨🇴", feedback: "Perfecto. Adaptaremos el protocolo a tu cultura alimentaria.", score: 0 },
      { text: "Argentina 🇦🇷", feedback: "Perfecto. Adaptaremos el protocolo a tu cultura alimentaria.", score: 0 },
      { text: "Chile 🇨🇱", feedback: "Perfecto. Adaptaremos el protocolo a tu cultura alimentaria.", score: 0 },
      { text: "Perú 🇵🇪", feedback: "Perfecto. Adaptaremos el protocolo a tu cultura alimentaria.", score: 0 },
      { text: "Otro país de Latinoamérica 🌎", feedback: "Perfecto. Adaptaremos el protocolo a tu cultura alimentaria.", score: 0 },
    ],
  },
  {
    id: 2,
    question: "¿Cuál de estas situaciones frustrantes te pasa más seguido?",
    progressLabel: "Vas por buen camino...",
    options: [
      { text: "Hago dieta toda la semana, pero lo 'arruino' todo el fin de semana", feedback: "Eso es el ciclo de restricción-atracón. Una señal clara del Bloqueo Tipo 2.", score: 2 },
      { text: "Pierdo algunos kilos, pero el peso se estanca y recupero todo", feedback: "El efecto rebote es la respuesta del cuerpo al 'modo supervivencia'. Lo vamos a revertir.", score: 2 },
      { text: "Parece que, aunque coma poco, mi cuerpo 'retiene' la grasa en el abdomen", feedback: "Exactamente. Eso es el Síndrome de Supervivencia Celular actuando en tiempo real.", score: 3 },
      { text: "Tengo ataques incontrolables de ganas de comer dulce por las noches", feedback: "Los antojos nocturnos son una señal hormonal, no de falta de voluntad. Bloqueo Tipo 3.", score: 3 },
    ],
  },
  {
    id: 3,
    question: "¿Sientes que tu problema NO es falta de fuerza de voluntad, sino que tu cuerpo simplemente dejó de responder a las dietas tradicionales?",
    highlight: true,
    progressLabel: "Esta es la pregunta clave...",
    options: [
      { text: "¡Sí, eso es exactamente lo que siento!", feedback: "Eso confirma el diagnóstico. Tu cuerpo tiene un bloqueo real, no un problema de actitud.", score: 3 },
      { text: "A veces creo que la culpa es mía", feedback: "No es tu culpa. La ciencia confirma que el cuerpo bloquea la quema de grasa activamente.", score: 2 },
      { text: "No, simplemente no puedo seguir dietas", feedback: "Eso también es una señal. El cuerpo sabotea las dietas cuando está en modo supervivencia.", score: 1 },
    ],
  },
  {
    id: 4,
    question: "La ciencia demuestra que el estrés bloquea la quema de grasa. ¿Cómo está tu nivel de estrés y ansiedad en los últimos meses?",
    progressLabel: "Analizando tu perfil hormonal...",
    options: [
      { text: "Muy alto (siempre al límite)", feedback: "El cortisol elevado es el principal activador del Bloqueo Tipo 1. Dato importante.", score: 3 },
      { text: "Alto (muchas preocupaciones diarias)", feedback: "El estrés crónico mantiene el cortisol elevado y bloquea la quema de grasa abdominal.", score: 2 },
      { text: "Medio (puedo controlar la mayor parte del tiempo)", feedback: "Bien. El estrés moderado puede ser manejado con el protocolo de desbloqueo.", score: 1 },
      { text: "Bajo (estoy tranquila)", feedback: "Perfecto. Eso descarta el Bloqueo Tipo 1 y nos enfoca en los otros factores.", score: 0 },
    ],
  },
  {
    id: 5,
    question: "¿Cuál de estas opciones sería una pesadilla abandonar para siempre?",
    progressLabel: "Casi a la mitad...",
    options: [
      { text: "Pastas, panes y carbohidratos en general", feedback: "No tendrás que abandonarlos. El protocolo te permite comerlos sin acumular grasa.", score: 2 },
      { text: "Mis platos típicos favoritos (tacos, empanadas, arepas, etc.)", feedback: "Esos platos son parte de tu identidad. El protocolo fue diseñado para que los disfrutes.", score: 2 },
      { text: "Ese dulcecito después del almuerzo o por las noches", feedback: "El antojo de dulce es una señal hormonal del Bloqueo Tipo 3. Lo vamos a resolver.", score: 3 },
      { text: "No podría abandonar ninguno de ellos", feedback: "Perfecto. No tendrás que hacerlo. El protocolo trabaja con tu estilo de vida, no contra él.", score: 2 },
    ],
  },
  {
    id: 6,
    question: "Si la ciencia comprobara que intentar 'comer menos' es exactamente lo que hace que tu cuerpo almacene grasa, ¿estarías dispuesta a probar un enfoque totalmente diferente?",
    progressLabel: "¡Más de la mitad! Sigue así...",
    options: [
      { text: "Por supuesto, estoy cansada de pasar hambre", feedback: "Esa disposición es todo lo que necesitas. El protocolo hace el resto.", score: 3 },
      { text: "Depende de lo que tenga que hacer", feedback: "Justo. Son solo 3 minutos antes de las comidas. Eso es todo.", score: 2 },
      { text: "No, creo que solo comiendo menos se pierde peso", feedback: "Entendemos. Los próximos resultados pueden cambiar esa perspectiva.", score: 1 },
    ],
  },
  {
    id: 7,
    question: "Si descubrieras un truco simple de 3 minutos para hacer ANTES de las comidas, que te permite comer tus platos favoritos sin acumular grasa, ¿podrías hacerlo todos los días?",
    highlight: true,
    progressLabel: "¡Excelente! Ya casi terminamos...",
    options: [
      { text: "¡Sí, 3 minutos es muy fácil!", feedback: "Perfecto. La consistencia es el único requisito del protocolo.", score: 3 },
      { text: "Tal vez, si me acuerdo", feedback: "Te daremos un recordatorio visual simple para que nunca lo olvides.", score: 2 },
      { text: "No, no tengo tiempo ni para eso", feedback: "Entendemos. Pero 3 minutos es menos que preparar un café. Vale la pena intentarlo.", score: 1 },
    ],
  },
  {
    id: 8,
    question: "Si este truco funcionara para ti, ¿en cuánto tiempo te gustaría ver la balanza bajar?",
    progressLabel: "Casi listo...",
    options: [
      { text: "En los primeros 7 días (quiero ver rápido para motivarme)", feedback: "Muchas personas sienten el abdomen más desinflado ya en la primera semana.", score: 3 },
      { text: "En las primeras 2 semanas", feedback: "Ese es un plazo muy realista con el protocolo de desbloqueo.", score: 2 },
      { text: "En el primer mes", feedback: "Perfecto. Con consistencia, los resultados en el primer mes son notables.", score: 2 },
      { text: "No me importa el tiempo, mientras el resultado sea definitivo", feedback: "Esa mentalidad es la más poderosa. Los resultados definitivos vienen con el desbloqueo real.", score: 3 },
    ],
  },
  {
    id: 9,
    question: "¿Cuánto has gastado en dietas, nutricionistas, suplementos o tés que no dieron resultados permanentes?",
    progressLabel: "¡Último paso!",
    options: [
      { text: "Más de $500 dólares", feedback: "Eso confirma que el problema no era el esfuerzo, sino el enfoque. Vamos a cambiarlo.", score: 3 },
      { text: "Entre $100 y $500 dólares", feedback: "Ese dinero no fue en vano — te enseñó lo que no funciona. Ahora veremos lo que sí.", score: 2 },
      { text: "Menos de $100 dólares", feedback: "Bien. Eso significa que aún no encontraste el enfoque correcto. Hoy cambia eso.", score: 1 },
      { text: "Nunca gasté, solo lo intento sola", feedback: "Eso requiere aún más valentía. Y el protocolo fue diseñado para funcionar sin ayuda externa.", score: 1 },
    ],
  },
];

export const PROGRESS_LABELS: Record<number, string> = {
  0: "¡Empecemos!",
  10: "Vas por buen camino...",
  20: "Personalizando tu evaluación...",
  30: "Analizando tu perfil hormonal...",
  40: "Casi a la mitad...",
  50: "¡Más de la mitad! Sigue así...",
  60: "Identificando tu bloqueo principal...",
  70: "¡Excelente! Ya casi terminamos...",
  80: "Casi listo...",
  90: "¡Último paso!",
  100: "¡Análisis completado!",
};

// ─── FUNÇÃO DE CÁLCULO DO TIPO DE BLOQUEIO ───────────────────────────────────

export function calculateBlockType(answers: { questionIndex: number; answerIndex: number }[]): BlockType {
  let stressScore = 0;
  let restrictScore = 0;
  let emotionalScore = 0;

  answers.forEach(({ questionIndex, answerIndex }) => {
    const questions = answers.length > 0 ? QUIZ_QUESTIONS : QUIZ_QUESTIONS_PT;
    const q = questions[questionIndex];
    if (!q) return;
    const opt = q.options[answerIndex];
    if (!opt) return;

    if (questionIndex === 4) {
      stressScore += (opt.score ?? 0) * 2;
    } else if (questionIndex === 2) {
      if (answerIndex === 0 || answerIndex === 1) restrictScore += 3;
      if (answerIndex === 2) restrictScore += 2;
      if (answerIndex === 3) emotionalScore += 3;
    } else if (questionIndex === 5) {
      if (answerIndex === 2) emotionalScore += 3;
      else restrictScore += (opt.score ?? 0);
    } else {
      const score = opt.score ?? 0;
      stressScore += score * 0.3;
      restrictScore += score * 0.4;
      emotionalScore += score * 0.3;
    }
  });

  if (stressScore >= restrictScore && stressScore >= emotionalScore) return 1;
  if (emotionalScore >= restrictScore) return 3;
  return 2;
}

export function calculateBlockTypeForLang(
  answers: { questionIndex: number; answerIndex: number }[],
  lang: "pt" | "es"
): BlockType {
  const questions = lang === "pt" ? QUIZ_QUESTIONS_PT : QUIZ_QUESTIONS;
  let stressScore = 0;
  let restrictScore = 0;
  let emotionalScore = 0;

  answers.forEach(({ questionIndex, answerIndex }) => {
    const q = questions[questionIndex];
    if (!q) return;
    const opt = q.options[answerIndex];
    if (!opt) return;

    if (questionIndex === 4) {
      stressScore += (opt.score ?? 0) * 2;
    } else if (questionIndex === 2) {
      if (answerIndex === 0 || answerIndex === 1) restrictScore += 3;
      if (answerIndex === 2) restrictScore += 2;
      if (answerIndex === 3) emotionalScore += 3;
    } else if (questionIndex === 5) {
      if (answerIndex === 2) emotionalScore += 3;
      else restrictScore += (opt.score ?? 0);
    } else {
      const score = opt.score ?? 0;
      stressScore += score * 0.3;
      restrictScore += score * 0.4;
      emotionalScore += score * 0.3;
    }
  });

  if (stressScore >= restrictScore && stressScore >= emotionalScore) return 1;
  if (emotionalScore >= restrictScore) return 3;
  return 2;
}
