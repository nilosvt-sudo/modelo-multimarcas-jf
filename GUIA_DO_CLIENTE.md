# 🚗 Manual de Gestão da Loja — Painel Administrativo

Este guia foi preparado para a equipe de vendas e administração da concessionária multimarcas gerenciar o estoque de veículos, fotos, valores, propostas de financiamento, avaliações de usados na troca e agendamentos de test drive diretamente pelo painel administrativo, sem depender de suporte técnico.

---

## 🔐 1. Como Acessar o Painel

1. Acesse o endereço do site adicionando `/admin` no final:
   * **Exemplo:** `https://seusite.com.br/admin` (ou `http://localhost:3000/admin` em testes locais).
2. Na tela de **Acesso Restrito**, digite a senha de administrador:
   * **Senha padrão inicial:** `admin123` *(pode ser alterada no arquivo `.env` com a variável `ADMIN_PASSWORD`)*.
3. Clique em **Entrar no Painel**.

---

## ➕ 2. Como Cadastrar um Novo Veículo no Estoque

1. No topo da tela do painel, clique no botão azul **"+ Novo Veículo"**.
2. Preencha as informações do automóvel:
   * **Marca** (Ex: *Toyota*, *Jeep*, *BMW*, *Volkswagen*, *Honda*, *Chevrolet*).
   * **Modelo e Versão** (Ex: *Corolla Altis Hybrid 1.8*, *Compass Limited 1.3 Turbo*).
   * **Ano Fabricação / Modelo** (Ex: *2023 / 2024*).
   * **Quilometragem (Km)** (Ex: *24.500*).
   * **Preço de Venda** (Ex: *149900.00*).
   * **Câmbio** (*Automático*, *Manual*, *CVT*, *Dupla Embreagem*).
   * **Combustível** (*Flex*, *Gasolina*, *Diesel*, *Híbrido*, *Elétrico*).
   * **Carroceria** (*SUV*, *Sedan*, *Hatch*, *Pickup*, *Cupê*, *Esportivo*).
   * **Cor** (Ex: *Branco Perolizado*, *Cinza Grafite*, *Preto Metálico*).
3. **Fotos do Veículo:**
   * **Foto de Capa:** Clique em *"Escolher foto do celular / computador"* e selecione a foto principal em alta resolução.
   * **Galeria de Fotos:** Adicione fotos de interior, painel, porta-malas e motor.
4. **Opcionais e Destaques:**
   * Marque os itens inclusos (Teto Solar Panorâmico, Painel Digital, Câmera 360°, Bancos em Couro, Piloto Automático Adaptativo, etc.).
5. **Garantia & Laudo:**
   * Marque *Laudo Cautelar Aprovado* e *Único Dono* se aplicável.
6. Clique em **"Salvar Veículo"**.
   * Pronto! O carro já aparecerá instantaneamente no estoque do site e no simulador de parcelas.

---

## ✏️ 3. Como Alterar Preços, Editar ou Dar Baixa em Veículos Vendidos

* **Editar Informações ou Preço:**
  * Clique no botão **Editar** (ícone de lápis) no card do veículo. Altere o valor ou km e clique em salvar.
* **Marcar como Vendido ou Excluir:**
  * Altere o status para **"Vendido"** ou clique no ícone da **Lixeira** para remover do estoque ativo.

---

## 👥 4. Módulos de Vendas & Gestão de Leads

* **Simulações de Financiamento:** Visualize propostas com entrada, parcelas calculadas, banco selecionado e dados do cliente para aprovação de crédito.
* **Avaliações de Usados na Troca:** Receba detalhes do carro do cliente (marca, ano, km, fotos) para gerar uma contraproposta de compra ou entrada.
* **Agendamentos de Test Drive:** Visualize clientes que reservaram test drive com dia, horário e preferência (Showroom ou Delivery).
* **Depoimentos de Compradores:** Modere e publique novas avaliações de clientes satisfeitos para fortalecer a prova social da loja.

---

## 🛠️ Para o Desenvolvedor: Deploy na Nuvem (Vercel)

Para hospedar o site 100% online com banco de dados em nuvem:

1. **Crie um banco PostgreSQL gratuito (ex: Neon.tech ou Supabase)**.
2. Copie a `DATABASE_URL` para as variáveis de ambiente na Vercel.
3. Configure `ADMIN_PASSWORD` com a senha desejada para a concessionária.
