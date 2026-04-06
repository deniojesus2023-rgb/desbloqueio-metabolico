export type QuizOption = {
  text: string;
  feedback: string; // micro-feedback shown after selecting this option
  score?: number;   // contributes to metabolic block type scoring
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: QuizOption[];
  highlight?: boolean;
  progressLabel?: string; // motivational text shown at this step
};

// Scoring: each answer contributes to one of 3 block types
// Type 1 = Cortisol/Stress block
// Type 2 = Insulin/Restriction block
// Type 3 = Emotional/Nocturnal block
export type BlockType = 1 | 2 | 3;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 0,
    question: "Si pudieras despertar mañana con solo UNO de estos resultados, ¿cuál elegirías?",
    progressLabel: "¡Empecemos!",
    options: [
      {
        text: "Un vientre plano y desinflado",
        feedback: "Ese es exactamente el síntoma del Bloqueo Metabólico. Vamos a identificarlo.",
        score: 2,
      },
      {
        text: "Energía de sobra y ropa más holgada",
        feedback: "Perfecto. La energía baja es una señal clara de que el metabolismo está bloqueado.",
        score: 1,
      },
      {
        text: "El peso que tenía hace 5 años",
        feedback: "Entendido. Recuperar ese peso es posible cuando desbloqueamos el metabolismo.",
        score: 3,
      },
      {
        text: "Todos los anteriores",
        feedback: "Eso nos dice que el bloqueo afecta múltiples sistemas. Sigamos analizando.",
        score: 2,
      },
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
      {
        text: "Hago dieta toda la semana, pero lo 'arruino' todo el fin de semana",
        feedback: "Eso es el ciclo de restricción-atracón. Una señal clara del Bloqueo Tipo 2.",
        score: 2,
      },
      {
        text: "Pierdo algunos kilos, pero el peso se estanca y recupero todo",
        feedback: "El efecto rebote es la respuesta del cuerpo al 'modo supervivencia'. Lo vamos a revertir.",
        score: 2,
      },
      {
        text: "Parece que, aunque coma poco, mi cuerpo 'retiene' la grasa en el abdomen",
        feedback: "Exactamente. Eso es el Síndrome de Supervivencia Celular actuando en tiempo real.",
        score: 3,
      },
      {
        text: "Tengo ataques incontrolables de ganas de comer dulce por las noches",
        feedback: "Los antojos nocturnos son una señal hormonal, no de falta de voluntad. Bloqueo Tipo 3.",
        score: 3,
      },
    ],
  },
  {
    id: 3,
    question: "¿Sientes que tu problema NO es falta de fuerza de voluntad, sino que tu cuerpo simplemente dejó de responder a las dietas tradicionales?",
    highlight: true,
    progressLabel: "Esta es la pregunta clave...",
    options: [
      {
        text: "¡Sí, eso es exactamente lo que siento!",
        feedback: "Eso confirma el diagnóstico. Tu cuerpo tiene un bloqueo real, no un problema de actitud.",
        score: 3,
      },
      {
        text: "A veces creo que la culpa es mía",
        feedback: "No es tu culpa. La ciencia confirma que el cuerpo bloquea la quema de grasa activamente.",
        score: 2,
      },
      {
        text: "No, simplemente no puedo seguir dietas",
        feedback: "Eso también es una señal. El cuerpo sabotea las dietas cuando está en modo supervivencia.",
        score: 1,
      },
    ],
  },
  {
    id: 4,
    question: "La ciencia demuestra que el estrés bloquea la quema de grasa. ¿Cómo está tu nivel de estrés y ansiedad en los últimos meses?",
    progressLabel: "Analizando tu perfil hormonal...",
    options: [
      {
        text: "Muy alto (siempre al límite)",
        feedback: "El cortisol elevado es el principal activador del Bloqueo Tipo 1. Dato importante.",
        score: 3,
      },
      {
        text: "Alto (muchas preocupaciones diarias)",
        feedback: "El estrés crónico mantiene el cortisol elevado y bloquea la quema de grasa abdominal.",
        score: 2,
      },
      {
        text: "Medio (puedo controlar la mayor parte del tiempo)",
        feedback: "Bien. El estrés moderado puede ser manejado con el protocolo de desbloqueo.",
        score: 1,
      },
      {
        text: "Bajo (estoy tranquila)",
        feedback: "Perfecto. Eso descarta el Bloqueo Tipo 1 y nos enfoca en los otros factores.",
        score: 0,
      },
    ],
  },
  {
    id: 5,
    question: "¿Cuál de estas opciones sería una pesadilla abandonar para siempre?",
    progressLabel: "Casi a la mitad...",
    options: [
      {
        text: "Pastas, panes y carbohidratos en general",
        feedback: "No tendrás que abandonarlos. El protocolo te permite comerlos sin acumular grasa.",
        score: 2,
      },
      {
        text: "Mis platos típicos favoritos (tacos, empanadas, arepas, etc.)",
        feedback: "Esos platos son parte de tu identidad. El protocolo fue diseñado para que los disfrutes.",
        score: 2,
      },
      {
        text: "Ese dulcecito después del almuerzo o por las noches",
        feedback: "El antojo de dulce es una señal hormonal del Bloqueo Tipo 3. Lo vamos a resolver.",
        score: 3,
      },
      {
        text: "No podría abandonar ninguno de ellos",
        feedback: "Perfecto. No tendrás que hacerlo. El protocolo trabaja con tu estilo de vida, no contra él.",
        score: 2,
      },
    ],
  },
  {
    id: 6,
    question: "Si la ciencia comprobara que intentar 'comer menos' es exactamente lo que hace que tu cuerpo almacene grasa, ¿estarías dispuesta a probar un enfoque totalmente diferente?",
    progressLabel: "¡Más de la mitad! Sigue así...",
    options: [
      {
        text: "Por supuesto, estoy cansada de pasar hambre",
        feedback: "Esa disposición es todo lo que necesitas. El protocolo hace el resto.",
        score: 3,
      },
      {
        text: "Depende de lo que tenga que hacer",
        feedback: "Justo. Son solo 3 minutos antes de las comidas. Eso es todo.",
        score: 2,
      },
      {
        text: "No, creo que solo comiendo menos se pierde peso",
        feedback: "Entendemos. Los próximos resultados pueden cambiar esa perspectiva.",
        score: 1,
      },
    ],
  },
  {
    id: 7,
    question: "Si descubrieras un truco simple de 3 minutos para hacer ANTES de las comidas, que te permite comer tus platos favoritos sin acumular grasa, ¿podrías hacerlo todos los días?",
    highlight: true,
    progressLabel: "¡Excelente! Ya casi terminamos...",
    options: [
      {
        text: "¡Sí, 3 minutos es muy fácil!",
        feedback: "Perfecto. La consistencia es el único requisito del protocolo.",
        score: 3,
      },
      {
        text: "Tal vez, si me acuerdo",
        feedback: "Te daremos un recordatorio visual simple para que nunca lo olvides.",
        score: 2,
      },
      {
        text: "No, no tengo tiempo ni para eso",
        feedback: "Entendemos. Pero 3 minutos es menos que preparar un café. Vale la pena intentarlo.",
        score: 1,
      },
    ],
  },
  {
    id: 8,
    question: "Si este truco funcionara para ti, ¿en cuánto tiempo te gustaría ver la balanza bajar?",
    progressLabel: "Casi listo...",
    options: [
      {
        text: "En los primeros 7 días (quiero ver rápido para motivarme)",
        feedback: "Muchas personas sienten el abdomen más desinflado ya en la primera semana.",
        score: 3,
      },
      {
        text: "En las primeras 2 semanas",
        feedback: "Ese es un plazo muy realista con el protocolo de desbloqueo.",
        score: 2,
      },
      {
        text: "En el primer mes",
        feedback: "Perfecto. Con consistencia, los resultados en el primer mes son notables.",
        score: 2,
      },
      {
        text: "No me importa el tiempo, mientras el resultado sea definitivo",
        feedback: "Esa mentalidad es la más poderosa. Los resultados definitivos vienen con el desbloqueo real.",
        score: 3,
      },
    ],
  },
  {
    id: 9,
    question: "¿Cuánto has gastado en dietas, nutricionistas, suplementos o tés que no dieron resultados permanentes?",
    progressLabel: "¡Último paso!",
    options: [
      {
        text: "Más de $500 dólares",
        feedback: "Eso confirma que el problema no era el esfuerzo, sino el enfoque. Vamos a cambiarlo.",
        score: 3,
      },
      {
        text: "Entre $100 y $500 dólares",
        feedback: "Ese dinero no fue en vano — te enseñó lo que no funciona. Ahora veremos lo que sí.",
        score: 2,
      },
      {
        text: "Menos de $100 dólares",
        feedback: "Bien. Eso significa que aún no encontraste el enfoque correcto. Hoy cambia eso.",
        score: 1,
      },
      {
        text: "Nunca gasté, solo lo intento sola",
        feedback: "Eso requiere aún más valentía. Y el protocolo fue diseñado para funcionar sin ayuda externa.",
        score: 1,
      },
    ],
  },
];

// Progress motivational labels by percentage
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

// Calculate block type from answers
export function calculateBlockType(answers: { questionIndex: number; answerIndex: number }[]): BlockType {
  // Scoring based on specific answer patterns
  let stressScore = 0;    // Type 1: Cortisol/Stress
  let restrictScore = 0;  // Type 2: Insulin/Restriction
  let emotionalScore = 0; // Type 3: Emotional/Nocturnal

  answers.forEach(({ questionIndex, answerIndex }) => {
    const q = QUIZ_QUESTIONS[questionIndex];
    if (!q) return;
    const opt = q.options[answerIndex];
    if (!opt) return;

    // Q4 (stress level) → Type 1
    if (questionIndex === 4) {
      stressScore += (opt.score ?? 0) * 2;
    }
    // Q2 (frustration pattern) → Type 2 or 3
    else if (questionIndex === 2) {
      if (answerIndex === 0 || answerIndex === 1) restrictScore += 3;
      if (answerIndex === 2) restrictScore += 2;
      if (answerIndex === 3) emotionalScore += 3;
    }
    // Q5 (what they can't give up) → Type 3
    else if (questionIndex === 5) {
      if (answerIndex === 2) emotionalScore += 3;
      else restrictScore += (opt.score ?? 0);
    }
    // General scoring
    else {
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
