### Skill Alexa de Eventos da Comunidade

Este é um skill desenvolvido usando o Alexa Skills Kit SDK para Node.js. O objetivo deste skill é fornecer aos usuários informações sobre eventos futuros e passados da comunidade Devs Norte.

#### Requisitos
- Node.js
- npm (Node Package Manager)

#### Instruções de Configuração
1. Clone este repositório para a sua máquina local.
2. Navegue até o diretório do projeto.
3. Execute `npm install` para instalar todas as dependências.
4. Certifique-se de ter credenciais da AWS configuradas com permissões adequadas.
5. Implante o skill no AWS Lambda usando `ask deploy`.
6. Habilite o skill no Console do Desenvolvedor Alexa.

#### Funcionalidades do Skill
- **GetFutureEventsIntent**: Invocado para obter informações sobre eventos futuros.
- **GetPastEventsIntent**: Invocado para obter informações sobre eventos passados.
- **AMAZON.HelpIntent**: Fornece orientação sobre como interagir com o skill.

#### Dependências
- **axios**: Usado para fazer requisições HTTP para buscar dados de eventos.
- **ask-sdk-core**: Usado para construir o skill Alexa.

<!-- #### Estrutura do Código
- **index.js**: Ponto de entrada principal para o skill.
- **util.js**: Contém funções utilitárias para buscar eventos e criar diretivas APL.
- **apl-document.json**: Define a estrutura do documento APL para renderizar informações sobre eventos. -->

#### Notas Adicionais
- Este skill utiliza a API do Sympla para buscar dados de eventos. Certifique-se de ter acesso e permissões adequadas à API.
- Personalize as variáveis `DOCUMENT_ID` e `datasource` em `index.js` para corresponder à estrutura do documento APL e aos requisitos de dados.

#### Uso
1. Chame o skill dizendo "Alexa, abrir Minha comunidaded".
2. Peça por eventos futuros ou passados dizendo "Me diga sobre os eventos futuros" ou "Me diga sobre os eventos passados".
3. Siga as instruções fornecidas pela Alexa para interagir mais com o skill.

#### Tratamento de Erros
- O skill inclui tratamento de erros para gerenciar graciosamente erros inesperados durante a execução.

#### Suporte
Para quaisquer problemas ou dúvidas, por favor abra uma issue no repositório do GitHub ou entre em contato com o desenvolvedor do skill.

#### Licença
Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).