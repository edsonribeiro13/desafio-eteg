
# Form de cadastro Eteg

Está é uma funcionalidade desenvolvida para o cadastro de clientes juntamente com algumas informações destes

## Tecnologias Utilizadas

- **Next.js**: Framework React para construção de aplicações web escaláveis e rápidas.  
  [Documentação Next.js](https://nextjs.org/docs)

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.  
  [Documentação React](https://reactjs.org/docs/getting-started.html)

- **React Hook Form**: Biblioteca para manipulação de formulários em React, facilitando a validação e a gestão de estados.  
  [Documentação React Hook Form](https://react-hook-form.com/)

- **Yup**: Biblioteca para validação de esquemas de dados, usada em conjunto com o React Hook Form.  
  [Documentação Yup](https://github.com/jquense/yup)

- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional usado para persistir os dados da aplicação.  
  [Documentação PostgreSQL](https://www.postgresql.org/docs/)

- **Docker e Docker Compose**: Ferramentas para containerização e orquestração de serviços, utilizadas para facilitar o ambiente de desenvolvimento e produção.  
  [Documentação Docker](https://docs.docker.com/)  
  [Documentação Docker Compose](https://docs.docker.com/compose/)

## Como Rodar o Projeto

### Pré-requisitos

- **Docker** e **Docker Compose** instalados na sua máquina. Você pode instalá-los seguindo a [documentação do Docker](https://docs.docker.com/get-docker/).
  
### Passos

1. Clone o repositório para o seu ambiente local:

   ```bash
   git clone git@github.com:edsonribeiro13/desafio-eteg.git
   cd eteg-form
   ```

2. Crie o contêiner usando o Docker Compose:

   ```bash
   docker-compose up --d
   ```

3. O aplicativo React será iniciado na porta `3000` da sua máquina local. Acesse pelo navegador:

   ```
   http://localhost:3000
   ```

4. O banco de dados PostgreSQL estará acessível na porta `5432`.

### Estrutura do Docker Compose

O arquivo `docker-compose.yml` contém a configuração para o ambiente de desenvolvimento com os seguintes serviços:

- **react-app**: O serviço que executa o frontend do React, usando a imagem `node:23.6.0` para o ambiente de desenvolvimento. Este serviço depende do banco de dados e expõe a porta `3000`.
  - **Comando**: Executa `yarn install`, `yarn build` e `yarn start` para instalar dependências, construir e iniciar o aplicativo.
  - **Ambiente**: Configura a variável `CHOKIDAR_USEPOLLING=true` para garantir que a detecção de alterações de arquivos funcione corretamente no Docker.

- **db**: O serviço de banco de dados PostgreSQL, usando a imagem `postgres:15`. Ele é configurado com variáveis de ambiente para o usuário, senha e nome do banco de dados.
  - **Volumes**: Utiliza o volume `postgres_data` para persistência de dados.

### Estrutura do Projeto

O projeto possui a seguinte estrutura:

```
/public
  /favicon.ico
  /favicon-32x32.png
  /favicon-16x16.png
  /favicon.svg
  ...
/src
  /components
  /pages
  /styles
  ...
docker-compose.yml
next.config.js
package.json
yarn.lock
README.md
```

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).