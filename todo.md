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

## Redesign Teal Mobile-First (referência app médico)
- [x] Fundo branco/cinza claro (#F8FAFB) com cards brancos elevados
- [x] Cor de destaque teal (#00BFA5 / #26C6DA) substituindo verde escuro
- [x] Header teal sólido com logo branca e contador de progresso
- [x] Barra de progresso teal com cantos arredondados
- [x] Cards de opção com sombra suave, hover teal e ícone circular
- [x] Tipografia escura (#1A1A2E) limpa e hierárquica
- [x] Botão CTA teal arredondado (border-radius: 50px)
- [x] Otimização mobile-first: padding, touch targets mínimos 48px
- [x] Inputs com borda teal no focus e label flutuante
- [x] Animação de seleção com checkmark teal

## Correções e Melhorias Visuais (pós-mobile test)
- [ ] Corrigir logo no header do quiz (wordmark branco visível sobre fundo teal)
- [ ] Aplicar design system teal na página de vendas BR (/vendas-br)
- [ ] Aplicar design system teal na página de vendas ES (/vendas)

## Otimização Alfred Quiz — Alta Conversão
- [ ] Reduzir para 4 perguntas com arco emocional (identidade → comportamento → problema → urgência)
- [ ] Resultado imediato na tela (sem e-mail antes do resultado)
- [ ] Opt-in pós-resultado com nome do perfil personalizado
- [ ] 3 perfis de resultado com copy de absolvição específica
- [ ] Tela de loading com "analisando seu perfil" + barra de progresso
- [ ] Tela de resultado com diagnóstico + timer de escassez + CTA

## Persona de Autoridade + Urgência Real
- [x] Criar persona: Ana Paula Ferreira, 47 anos, professora de BH, mãe de José e Laura
- [x] História de origem: anos tentando de tudo, descoberta do protocolo por acidente
- [x] Implementar seção "Quem criou isso" na VendasBR.tsx com história e avatar AP
- [x] Implementar urgência real: barra de 37/100 vagas no grupo de suporte (BR e ES)
- [x] Implementar mesma persona adaptada na Vendas.tsx (ES-LATAM)

## Quiz 2.0 — Qualificação Profunda Mercado Americano
- [ ] Varredura: BetterMe, Noom, ColonBroom, Ryan Levesque Ask Method
- [ ] Estrutura: perguntas encadeadas com arco emocional de qualificação
- [ ] Personalização: fluxo diferente por tipo de resposta (não só resultado)
- [ ] Implementar novo Quiz.tsx com 6-8 perguntas encadeadas
- [ ] Tela de resultado ultra-personalizada por perfil

## Redesign Página de Vendas — Modelagem $100M+
- [ ] Varredura swipefiles americanos: Agora, ClickFunnels, Organifi, Dr. Axe, Clickbank
- [ ] Identificar estrutura invisível da página vencedora
- [ ] Modelar copy PT-BR com nova estrutura validada
- [ ] Reescrever VendasBR.tsx com estrutura modelada
- [ ] Reescrever Vendas.tsx ES-LATAM com mesma estrutura

## Melhorias Página de Vendas + Fonte Inter
- [x] Gerar foto da Ana Paula com IA (mulher brasileira, 47 anos, professora, BH)
- [x] Aplicar fonte Inter em todo o funil (index.html + index.css)
- [x] Adicionar foto da Ana Paula na seção de autoridade da VendasBR.tsx
- [x] Criar seção "Antes e Depois" com 3 cards na VendasBR.tsx
- [x] Replicar metáfora do termostato na Vendas.tsx (ES-LATAM)
- [x] Replicar evento gatilho da Ana Paula na Vendas.tsx (ES-LATAM)
- [x] Adicionar seção "Antes e Depois" na Vendas.tsx (ES-LATAM)

## Melhorias Solicitadas (07/04/2026)

- [x] Remover imagem da mulher (hero image 16/9) da fase landing do Quiz.tsx
- [x] Destacar a logo no header do Quiz — aumentar tamanho, adicionar símbolo visual mais proeminente
- [x] Otimização mobile: melhorar espaçamentos, tipografia e layout responsivo na fase landing
- [x] Reestruturar VendasBR.tsx com modelo SwipeFile: Hero + Benefícios (3 itens) + Como Funciona (3 passos) + Depoimentos + Oferta + CTA

## Aplicação do Design System Desbloqueio Metabólico

- [x] Atualizar index.html com fonte Montserrat (substituir Inter)
- [x] Reescrever index.css com tokens completos do design system (cores teal, sombras tonalizadas, espaçamentos 4px, gradiente, componentes CSS)
- [x] Reescrever Quiz.tsx com design system aplicado (dm-header, dm-btn-primary, dm-option, dm-card, dm-pill, dm-tag, dm-progress)
- [x] Reescrever VendasBR.tsx com design system aplicado (dm-header, dm-btn-primary, dm-btn-white, dm-card, dm-tag, dm-gradient-text)

## Ajuste de Border Radius

- [x] Alterar border-radius de todos os botões para 5px (CSS global + componentes inline)

## Integração Stripe — Checkout Embutido

- [x] Ativar feature Stripe no projeto (webdev_add_feature)
- [x] Configurar chaves da API (pk_test + sk_test)
- [x] Criar procedimentos tRPC para criar PaymentIntent e processar pagamentos
- [x] Implementar checkout embutido com Stripe Elements na VendasBR.tsx
- [x] Implementar order bump no checkout (checkbox que soma ao valor)
- [x] Implementar upsell one-click (cobrar sem pedir cartão novamente)
- [x] Implementar downsell one-click
- [x] Implementar checkout embutido na Vendas.tsx (ES-LATAM)
- [x] Testar fluxo completo: pagamento → order bump → upsell → downsell

## PIX + E-mails Automáticos + Página de Confirmação

- [x] Adicionar PIX como método de pagamento no Stripe (payment_method_types: pix)
- [x] Atualizar StripeCheckout.tsx para exibir opção PIX + Cartão
- [x] Implementar e-mails automáticos pós-compra via notificação do sistema
- [x] Criar página de confirmação de pedido (/confirmacao-br e /confirmacion)
- [x] Resumo da compra com itens adquiridos e valores
- [x] Orientações sobre próximos passos pós-compra
- [x] Redirecionar para página de confirmação após último passo do funil
