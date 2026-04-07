# Desbloqueio Metabólico - TODO

## Design System
- [x] Atualizar paleta de cores (verde esmeralda) no index.css
- [x] Configurar tipografia Inter

## Banco de Dados
- [x] Criar tabela quiz_sessions (sessões do quiz)
- [x] Criar tabela quiz_answers (respostas por sessão)
- [x] Criar tabela conversions (conversões para vendas)
- [x] Migrar schema para o banco

## Quiz
- [x] Criar página de entrada do quiz (landing com headline + CTA)
- [x] Criar componente de pergunta com animação de transição
- [x] Implementar 10 perguntas qualificatórias em espanhol
- [x] Criar barra de progresso animada
- [x] Criar tela de opt-in (nome + email)
- [x] Criar tela de transição com loading animado
- [x] Salvar sessão e respostas no banco

## Página de Vendas
- [x] Criar página de vendas completa em espanhol
- [x] Seção Hero com headline do MUP
- [x] Seção do problema (Síndrome da Sobrevivência Celular)
- [x] Seção da solução (Protocolo de 3 Minutos)
- [x] Seção de Value Stack com produto mockup
- [x] Seção de preço com ancoragem
- [x] Seção de garantia
- [x] CTA final

## Painel Admin
- [x] Criar rota protegida /admin
- [x] Dashboard com métricas: total de sessões, taxa de conclusão do quiz, conversões
- [x] Gráfico de funil (Visitantes → Quiz → Opt-in → Vendas)
- [x] Tabela de leads com respostas do quiz
- [x] Filtros por data e país

## Testes
- [x] Testes unitários das rotas da API
- [x] Verificar responsividade mobile

## Melhorias de CRO

- [x] Quiz: Micro-feedback emocional após cada resposta
- [x] Quiz: Texto motivacional na barra de progresso por etapa
- [x] Quiz: Mover pergunta de país para posição 2
- [x] Quiz: Sistema de score e 3 tipos de resultado (Tipo 1, 2, 3)
- [x] Quiz: Loading personalizado com referência às respostas
- [x] Vendas: Headline personalizada com nome do usuário
- [x] Vendas: Contador de urgência regressivo de 15 minutos
- [x] Vendas: Depoimentos com fotos reais (geradas por IA)
- [x] Vendas: Seção de FAQ com 5 objeções principais
- [x] Vendas: Âncora de preço com comparação contextual
- [x] Admin: Filtro por data e país
- [x] Admin: Drop-off por pergunta do quiz
- [x] Admin: Receita separada por tipo (oferta, bump, upsell)

## Redesign Admin
- [x] Admin: Redesign minimalista preto e branco

## Integração Kiwify + Exit-Intent
- [x] Conectar link Kiwify Principal ($27) na página de vendas
- [x] Conectar link Kiwify Upsell 1 ($47) na página de upsell
- [x] Conectar link Kiwify Downsell ($17) na página de downsell
- [x] Conectar link Kiwify Upsell 2 ($27) na página de upsell 2
- [x] Implementar exit-intent popup com copy persuasiva na página de vendas
- [x] Configurar backredirect na Kiwify

## Versão Brasileira (PT-BR)

- [x] Pesquisa de mercado: maiores ofertas de emagrecimento no Brasil
- [x] Pesquisa de público: dores, frustrações e desejos do público BR
- [x] Criar MUP e MUS adaptados à cultura brasileira
- [x] Adaptar quiz para português com cultura BR (10 perguntas PT, referências BR: feijoada, churrasco, pão de queijo)
- [x] Adaptar página de vendas para português com copy BR (rota /vendas-br, upsell-br, obrigado-br)
- [x] Sistema de idioma único (PT-BR / ES) com detecção automática via navigator.language + param ?lang=pt|es

## Redesign Visual do Quiz
- [x] Fundo com gradiente verde escuro premium (quiz-bg)
- [x] Header com glassmorphism e badge âmbar "Pergunta X de Y"
- [x] Barra de progresso com porcentagem âmbar e label de contexto
- [x] Paleta dual: verde esmeralda + âmbar/dourado
- [x] Tipografia extrabold com hierarquia clara (headline branca, destaque âmbar)
- [x] Cards de opção com borda sólida, hover com slide lateral e letra destacada
- [x] Badge de confidencialidade abaixo dos cards
- [x] Stats com ícones e números em âmbar
- [x] Botão CTA com gradiente, sombra colorida e efeito hover
- [x] Spinner de loading com duplo anel animado
- [x] Inputs do opt-in com glassmorphism e focus verde
- [x] Card do opt-in com backdrop-filter blur
