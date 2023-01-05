
# Development Plan

- [x] Urgente: refatorar criação dos inputs (geração do html está horrível);
  - [x] Adicionar configuração json e carregar bibliotecas nos subdiretórios (MD file);
  - [x] Adaptar para npm;
- [x] Tratar dificuldade das questões.
- [x] Feedback da pontuação.
- [x] Adição de feedback das respostas incluindo pontuação;
- [x] Aleatorizar posição das opções de respostas das questões
- [x] Página inicial listando os questionários disponíveis;
- [ ] Mover código da página inicial para o cliente.
- [ ] Carregar lista de tópicos de um arquivo.
- [ ] Enviar o nome do arquivo da lista de tópicos como argumento para o servidor.
- [ ] Gravar histórico das avaliações
- [ ] Ponderação da pontuação considerando o histórico penalizando erros ao acaso
- [ ] Avaliações questões discursivas ponderando a presença de palavras chaves delimitadas por aspas.
- [ ] Apresentar a resposta correta como feedback caso não seja provido um.

# Issues

- [x] A aleatorização deve atuar somente nas alternativas de uma mesma questão. Ela está misturando alterantivas de diferentes questões.

# Furture Works

- [ ] Adicionar data da última avaliação do questionário;
- [ ] Registrar o tempo de resposta;
- [ ] Página para edição dos questionários;
- [ ] Página para visualização das estatísticas de um questionários;
- [ ] Avaliação por teoria de resposta ao item considerando as resoluções sequenciais dos - questionários e o intervalo de tempo entre as submissões;
- [ ] Avaliação das questões discursivas argumentativas pela métrica BLEU;
- [ ] Suporte à questões matemáticas com latex através de mathjs;
- [ ] Inserção de imagens e referências
