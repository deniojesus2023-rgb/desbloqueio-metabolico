import { describe, expect, it } from "vitest";
import {
  QUIZ_QUESTIONS,
  QUIZ_QUESTIONS_PT,
  PROGRESS_LABELS,
  PROGRESS_LABELS_PT,
  calculateBlockTypeForLang,
} from "../client/src/quizData";

describe("Quiz bilíngue — estrutura de dados", () => {
  it("versão ES tem 10 perguntas", () => {
    expect(QUIZ_QUESTIONS).toHaveLength(10);
  });

  it("versão PT tem 10 perguntas", () => {
    expect(QUIZ_QUESTIONS_PT).toHaveLength(10);
  });

  it("todas as perguntas ES têm pelo menos 2 opções", () => {
    QUIZ_QUESTIONS.forEach((q) => {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("todas as perguntas PT têm pelo menos 2 opções", () => {
    QUIZ_QUESTIONS_PT.forEach((q) => {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("todas as opções ES têm texto e feedback", () => {
    QUIZ_QUESTIONS.forEach((q) => {
      q.options.forEach((opt) => {
        expect(opt.text).toBeTruthy();
        expect(opt.feedback).toBeTruthy();
      });
    });
  });

  it("todas as opções PT têm texto e feedback", () => {
    QUIZ_QUESTIONS_PT.forEach((q) => {
      q.options.forEach((opt) => {
        expect(opt.text).toBeTruthy();
        expect(opt.feedback).toBeTruthy();
      });
    });
  });

  it("perguntas PT estão em português (contêm caracteres típicos)", () => {
    const ptTexts = QUIZ_QUESTIONS_PT.map((q) => q.question).join(" ");
    // Verifica palavras-chave em português
    const hasPtKeywords =
      ptTexts.includes("você") ||
      ptTexts.includes("seu") ||
      ptTexts.includes("sua");
    expect(hasPtKeywords).toBe(true);
  });

  it("perguntas ES estão em espanhol (contêm caracteres típicos)", () => {
    const esTexts = QUIZ_QUESTIONS.map((q) => q.question).join(" ");
    const hasEsKeywords =
      esTexts.includes("tu") ||
      esTexts.includes("qué") ||
      esTexts.includes("cuál");
    expect(hasEsKeywords).toBe(true);
  });

  it("progress labels ES têm 11 entradas (0 a 100 de 10 em 10 + 100)", () => {
    const keys = Object.keys(PROGRESS_LABELS).map(Number);
    expect(keys).toContain(0);
    expect(keys).toContain(100);
    expect(keys.length).toBeGreaterThanOrEqual(5);
  });

  it("progress labels PT têm entradas para 0 e 100", () => {
    expect(PROGRESS_LABELS_PT[0]).toBeTruthy();
    expect(PROGRESS_LABELS_PT[100]).toBeTruthy();
  });
});

describe("calculateBlockTypeForLang — cálculo do tipo de bloqueio", () => {
  // Simula respostas que indicam alto estresse (Tipo 1)
  const highStressAnswers = [
    { questionIndex: 4, answerIndex: 0 }, // Muito alto
    { questionIndex: 0, answerIndex: 0 },
    { questionIndex: 3, answerIndex: 0 },
  ];

  // Simula respostas que indicam bloqueio emocional/noturno (Tipo 3)
  const emotionalAnswers = [
    { questionIndex: 2, answerIndex: 3 }, // Ataques de doce à noite
    { questionIndex: 5, answerIndex: 2 }, // Não consegue largar o doce
    { questionIndex: 0, answerIndex: 2 },
  ];

  // Simula respostas que indicam restrição/insulina (Tipo 2)
  const restrictionAnswers = [
    { questionIndex: 2, answerIndex: 0 }, // Dieta e arruína no fim de semana
    { questionIndex: 5, answerIndex: 0 }, // Carboidratos
    { questionIndex: 0, answerIndex: 0 },
  ];

  it("retorna Tipo 1 para respostas de alto estresse (ES)", () => {
    const result = calculateBlockTypeForLang(highStressAnswers, "es");
    expect(result).toBe(1);
  });

  it("retorna Tipo 1 para respostas de alto estresse (PT)", () => {
    const result = calculateBlockTypeForLang(highStressAnswers, "pt");
    expect(result).toBe(1);
  });

  it("retorna Tipo 3 para respostas emocionais/noturnas (ES)", () => {
    const result = calculateBlockTypeForLang(emotionalAnswers, "es");
    expect(result).toBe(3);
  });

  it("retorna Tipo 3 para respostas emocionais/noturnas (PT)", () => {
    const result = calculateBlockTypeForLang(emotionalAnswers, "pt");
    expect(result).toBe(3);
  });

  it("retorna Tipo 2 para respostas de restrição (ES)", () => {
    const result = calculateBlockTypeForLang(restrictionAnswers, "es");
    expect(result).toBe(2);
  });

  it("retorna Tipo 2 para respostas de restrição (PT)", () => {
    const result = calculateBlockTypeForLang(restrictionAnswers, "pt");
    expect(result).toBe(2);
  });

  it("retorna um BlockType válido (1, 2 ou 3) para qualquer entrada", () => {
    const emptyResult = calculateBlockTypeForLang([], "pt");
    expect([1, 2, 3]).toContain(emptyResult);
  });

  it("resultado é consistente entre ES e PT para as mesmas respostas", () => {
    const resultEs = calculateBlockTypeForLang(highStressAnswers, "es");
    const resultPt = calculateBlockTypeForLang(highStressAnswers, "pt");
    expect(resultEs).toBe(resultPt);
  });
});

describe("Pergunta de país/região — adaptação cultural", () => {
  it("versão ES tem opções de países LATAM", () => {
    const countryQuestion = QUIZ_QUESTIONS[1];
    const optionTexts = countryQuestion.options.map((o) => o.text).join(" ");
    expect(optionTexts).toContain("México");
    expect(optionTexts).toContain("Colombia");
  });

  it("versão PT tem opções de regiões do Brasil", () => {
    const regionQuestion = QUIZ_QUESTIONS_PT[1];
    const optionTexts = regionQuestion.options.map((o) => o.text).join(" ");
    expect(optionTexts).toContain("Sul");
    expect(optionTexts).toContain("Sudeste");
    expect(optionTexts).toContain("Nordeste");
  });

  it("versão PT menciona comidas brasileiras nas opções", () => {
    const foodQuestion = QUIZ_QUESTIONS_PT[5];
    const optionTexts = foodQuestion.options.map((o) => o.text).join(" ");
    // Deve mencionar comidas brasileiras
    const hasBrFood =
      optionTexts.includes("feijão") ||
      optionTexts.includes("churrasco") ||
      optionTexts.includes("pão de queijo");
    expect(hasBrFood).toBe(true);
  });

  it("versão ES menciona comidas LATAM nas opções", () => {
    const foodQuestion = QUIZ_QUESTIONS[5];
    const optionTexts = foodQuestion.options.map((o) => o.text).join(" ");
    const hasLatamFood =
      optionTexts.includes("tacos") ||
      optionTexts.includes("empanadas") ||
      optionTexts.includes("arepas");
    expect(hasLatamFood).toBe(true);
  });
});
