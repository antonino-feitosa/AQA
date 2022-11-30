# AQA

Desenvolvimento de aplicativo para aplicação e avaliação de questionários de modo automático.

As questões devem ser modeladas por uma linguagem de sintaxe e semântica simples indicando o tipo da questão (valor esperado, discursiva, associação, múltipla escolha e somente descrições que servem de orientações), a dificuldade da questão e a resposta esperada e sua justificativa. As questões devem ser elaboradas por texto, porém, deve suportar a inserção de imagens e de equações. Além disso, cada questionário deve iniciar por uma seção com um resumo teórico que inicialmente está oculto sendo revelado à desejo do usuário.

As questões serão modeladas em arquivos que serão carregados pela aplicação para gerar o questionário de modo que eles sejam independentes. Elas serão avaliadas de modo automático quando o usuário terminar finalizar o questionário. A pontuação será determinada pela teoria da resposta ao item incluindo as questões discursivas que serão avaliadas pela métrica BLEU. Assim, serão registradas as repostas e o tempo do usuário que serão utilizadas posteriormente para análises de progresso como também dados para teoria da resposta ao item.

Por fim, a interface inicial apresentará todos os questionários disponíveis com a opção de aplicação ou de análise estatística. Ao selecionar a aplicação, o usuário será direcionada para tela do questionário onde deve responder as questões. Ao finalizar, será apresentado o parecer e a pontuação obtida sendo registrado a data e as respostas do usuário e então retornando à tela inicial.

## Instruções

0. Pré-requisitos: node.js instalado.
1. Execute: node server.js
2. Abra o navegador em http://localhost:8080

Dependências: express, showdown.

## Próximos Passos

- [ ] Adaptar para npm;
- [ ] Urgente: refatorar criação dos inputs (geração do html está horrível);
- [ ] Adição de feedback das respostas incluindo pontuação;
- [ ] Página inicial listando os questionários disponíveis;
- [ ] Página para edição dos questionários;
- [ ] Página para visualização das estatísticas de um questionários;
- [ ] Avaliação por teoria de resposta ao item considerando as resoluções sequenciais dos - questionários e o intervalo de tempo entre as submissões;
- [ ] Avaliação das questões discursivas argumentativas pela métrica BLEU;
- [ ] Suporte à questões matemáticas com latex através de mathjs;
- [ ] Inserção de imagens e referências