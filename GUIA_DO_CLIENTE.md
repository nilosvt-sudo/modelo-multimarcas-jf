# 🚗 Manual de Gestão de Estoque — Painel Administrativo

Este guia foi preparado para que a equipe da revenda/concessionária possa gerenciar, cadastrar, editar e remover veículos do site sem depender de programadores.

---

## 🔐 1. Como Acessar o Painel

1. Acesse o endereço do site adicionando `/admin` no final:
   * **Exemplo:** `https://seusite.com.br/admin` (ou `http://localhost:3000/admin` em testes locais).
2. Na tela de **Acesso Restrito**, digite a senha de administrador:
   * **Senha padrão inicial:** `admin123` *(pode ser alterada no arquivo `.env` com a variável `ADMIN_PASSWORD`)*.
3. Clique em **Entrar no Painel**.

---

## ➕ 2. Como Cadastrar um Novo Carro

1. No topo da tela do painel, clique no botão laranja **"+ Novo Veículo"**.
2. Preencha as informações do veículo:
   * **Marca, Modelo e Versão** (Ex: *Toyota*, *Corolla*, *2.0 Altis Premium Hybrid*).
   * **Ano Fabricação / Ano Modelo** (Ex: *2023 / 2024*).
   * **Preço de Venda** e **Tabela FIPE** (opcional para destacar vantagem).
   * **Km rodados, Câmbio, Combustível, Cor e Final da Placa**.
3. **Fotos do Veículo:**
   * **Foto de Capa:** Clique em *"Escolher foto do celular / computador"* e selecione a foto principal da frente do carro.
   * **Galeria de Fotos:** Clique em *"Adicionar fotos à galeria"* e selecione múltiplas fotos de uma vez (traseira, interior, painel, bancos, motor).
4. **Opcionais e Acessórios:**
   * Marque os itens que o carro possui (Ar digital, Câmera de ré, Couro, Teto solar, etc.).
5. **Status:**
   * Mantenha como **"Disponível"**.
6. Clique em **"Cadastrar Veículo"**.
   * Pronto! O veículo já estará visível na página inicial e na aba de estoque (`/veiculos`).

---

## ✏️ 3. Como Alterar Preço, Editar ou Marcar como Vendido

* **Alterar Status Imediatamente:**
  * Na tabela de estoque do painel, você pode alternar rapidamente o status entre **Disponível**, **Reservado** ou **Vendido**.
* **Editar Informações ou Fotos:**
  * Clique no botão **Editar** (ícone de lápis) no card do veículo. Altere o valor, descrição ou fotos e clique em salvar.
* **Excluir do Estoque:**
  * Se o carro não faz mais parte da loja, clique no ícone da **Lixeira** para removê-lo.

---

## 👥 4. Outras Abas do Painel

* **Propostas & Leads:** Veja todos os clientes que enviaram mensagem pelo WhatsApp ou preencheram proposta de financiamento no site.
* **Test Drive:** Agendamentos solicitados pelos clientes com data, horário e preferência de atendimento.
* **Avaliações de Usados:** Propostas de clientes que querem dar o carro usado na troca.

---

## 🛠️ Para o Programador: Conectando o Banco na Nuvem (Deploy)

Para que o site funcione 100% online quando hospedado (por exemplo, na **Vercel**):

1. **Crie um banco PostgreSQL gratuito:**
   * Recomendado: [Supabase](https://supabase.com) ou [Neon.tech](https://neon.tech).
2. **Copie a string de conexão (Connection String):**
   * Formato: `postgresql://postgres:[SENHA]@[HOST]:5432/[BANCO]?sslmode=require`
3. **Configure as Variáveis de Ambiente na Vercel (Environment Variables):**
   * `DATABASE_URL` = sua connection string do Supabase/Neon.
   * `ADMIN_PASSWORD` = a senha que você definirá para o cliente acessar o `/admin`.
   * `NEXT_PUBLIC_APP_URL` = o domínio oficial da loja (Ex: `https://modelomultimarcasjf.com.br`).
4. **Pronto!** O site executará as migrações e criará a tabela de veículos automaticamente na primeira carga.
