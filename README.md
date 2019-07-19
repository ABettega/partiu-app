# Partiu!
  
## O que é o Partiu!?
[O Partiu!](https://partiu--app.herokuapp.com) nasceu para atender um público que cresce a cada dia. Os nossos usuários vão desde gastrônomos a famílias inteiras, cada um com um interesse diferente. Nós temos o objetivo de atender a todos.

### Como funciona?
O usuário, já na tela inicial, preenche seu orçamento disponível para a viagem, as datas em que poderá viajar, e por fim os interesses que o levam a viajar. O **Partiu!** faz buscas em sites parceiros para encontrar a melhor experiência para o usuário, para mostrar roteiros selecionados baseados no interesse do usuário.

## Detalhes do desenvolvimento
### Features
- Utilização das seguintes APIs:
  - [Hipmunk](https://rapidapi.com/apidojo/api/hipmunk1) para buscas de vôos
  - [Kayak](https://rapidapi.com/apidojo/api/kajak) para buscas de hotéis
  - [Currency Converter](https://rapidapi.com/natkapral/api/currency-converter5) para mudar de USD para BRL
- Utilização da biblioteca [async](https://caolan.github.io/async/v3/) para chamadas simultâneas e assíncronas das APIs
- Front-end com [Bootstrap](https://getbootstrap.com/)
- Social Login com Facebook via [Passport](http://www.passportjs.org/docs/facebook/)
### Challenges
O sistema, por natureza de utilizar as APIs para seu funcionamento, é instável. As APIs falham muito, às vezes travando o sitema e às vezes não trazendo nenhum resultado, ou resultados inconsistentes. Esses problemas seriam resolvidos ao utilizar uma API profissional, paga.
### Roadmap
- [x] Setup básico do sistema, mostrar os inputs de orçamento e datas
- [x] Realizar a busca pela API de vôos
- [x] Montar um itinerário de vôos para o cliente
- [x] Realizar a busca pela API de hotéis
- [x] Integrar o hotel selecionado com o itinerário selecionado
- [x] Otimizar a busca para realizar as buscas assincronamente
- [x] Basic Login
- [x] Facebook Login
- [x] Front-end
- [ ] Validação de email do usuário
- [ ] Opção de favoritar um roteiro
- [ ] Possibilidade de reservar um roteiro pelo próprio sistema
- [ ] Mostrar atividades possíveis e lugares a visitar nos resultados (API Trip Advisor)
### O que faltou
O gerenciamento de tempo foi um sério problema para a equipe, com features abandonadas por falta de tempo de desenvolvimento. Atualmente, por exemplo, o login não tem utilidade alguma, e não existe a possibilidade de fazer a reserva pela tela de resultados. Também por falta de tempo não foi possível implementar a API do Trip Advisor para implementar atividades no destino, como lugares a visitar e restaurantes de alta qualidade.
