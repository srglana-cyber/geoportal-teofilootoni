# Geoportal Municipal de Teófilo Otoni - MG (WebGIS)

Sistema Integrado de Informações Geoespaciais do Município de Teófilo Otoni (MG), estruturado para publicação em nuvem via **Vercel** (`vercel.app`) e compatível com execução offline em qualquer navegador (`file:///`), com visualização interativa de **41 camadas vetoriais temáticas oficiais** padronizadas no referencial **SIRGAS 2000 (EPSG:4674)**.

---

## 🏛️ Concepção e Elaboração

* **Autoria e Concepção**: **Prof. Sérgio Lana - Doutor em Geografia**
* **Instituição**: **Instituto Federal de Educação, Ciência e Tecnologia do Norte de Minas Gerais (IFNMG) – Campus Teófilo Otoni**
* **Área de Atuação**: Professor EBTT, Doutor em Geografia (Tratamento da Informação Espacial), Pesquisador em Geovisualização, Cartografia Histórica e Estrada de Ferro Bahia e Minas (EFBM).
* **Currículo Lattes (CNPq)**: [http://lattes.cnpq.br/2773267607623633](http://lattes.cnpq.br/2773267607623633)

---

## 🛰️ Fontes Oficiais das Camadas Vetoriais

As 41 camadas geoespaciais integradas no geoportal têm como fontes oficiais:

1. **INDE (Infraestrutura Nacional de Dados Espaciais)**
   * Catálogo nacional unificado integrando bases do **IBGE** (limite municipal, distritos, setores censitários, localidades), **CPRM / Serviço Geológico do Brasil** (geologia/litologia com simbologia oficial, domínios de geodiversidade, poços tubulares SIAGAS, setorização de risco geológico de deslizamento e enxurrada), **DNIT** (rodovias federais do SNV), **INCRA** (assentamentos), **SPU** (imóveis da União) e **FUNAI** (terras indígenas).
2. **IDE-SISEMA (MG)**
   * Infraestrutura de Dados Espaciais do Sistema Estadual de Meio Ambiente e Recursos Hídricos de Minas Gerais. Disponibiliza a delimitação da APA do Alto do Mucuri (**IEF-MG**), cobertura vegetal e fitofisionomias, ottobacias hidrográficas e rede de drenagem (**IGAM / ANA**), rodovias estaduais (**DER-MG**) e os imóveis rurais cadastrados no **SICAR / CAR-MG**.
3. **IFNMG (Instituto Federal do Norte de Minas Gerais - Campus Teófilo Otoni)**
   * Levantamentos técnico-científicos, diagnóstico e inventário de **Nascentes Urbanas**, bens e patrimônios territoriais, estações ferroviárias e a reconstituição cartográfica do traçado histórico e regional da **Estrada de Ferro Bahia e Minas (EFBM)** (trecho municipal, margem da linha, morro feijão bebido), fruto das pesquisas acadêmicas do Prof. Dr. Sérgio Lana Morais.
4. **Prefeitura Municipal de Teófilo Otoni**
   * Delimitação oficial dos 39 bairros urbanos, malha viária e estradas vicinais municipais, postos de combustíveis, estabelecimentos de saúde, hospitais SUS e unidades básicas de saúde.

---

## 📂 Estrutura de Arquivos do Projeto

```text
webGIS TO/
│
├── index.html                  # Aplicação WebGIS principal (HTML5 responsivo e acessível)
├── vercel.json                 # Configuração de hospedagem, CORS e headers do Vercel
├── README.md                   # Documentação completa do geoportal e guia de deploy
├── iniciar_local.bat           # Executável para testar localmente com 1 clique (porta 8080)
│
├── assets/
│   └── logo_ifnmg.jpg          # Logomarca oficial do IFNMG Campus Teófilo Otoni
│
├── css/
│   └── style.css               # Folha de estilos moderna, responsiva para Desktop, Tablets e Smartphones
│
├── js/
│   ├── layers-config.js        # Definição das 41 camadas, metadados, fontes, estilos temáticos e legendas
│   └── app.js                  # Lógica WebGIS: Leaflet, basemaps, customizador de estilos, inspetor único e geocolaboração
│
└── data/                       # 41 camadas GeoJSON e wrappers .JS resilientes:
    ├── limite_municipal.geojson / .js
    ├── distritos.geojson / .js
    ├── bairros.geojson / .js
    ├── sede_municipal.geojson / .js
    ├── localidades.geojson / .js
    ├── setores_censitarios.geojson / .js
    ├── bacia_rio_todos_os_santos.geojson / .js
    ├── hidrografia_todos_os_santos.geojson / .js
    ├── curso_dagua.geojson / .js
    ├── nascentes_urbanas.geojson / .js
    ├── pocos.geojson / .js
    ├── unidades_conservacao.geojson / .js
    ├── vegetacao.geojson / .js
    ├── terras_indigenas.geojson / .js
    ├── assentamentos_incra.geojson / .js
    ├── imoveis_rurais.geojson / .js
    ├── geologia.geojson / .js
    ├── geodiversidade.geojson / .js
    ├── geomorfologia.geojson / .js
    ├── pedologia.geojson / .js
    ├── acidentes_geograficos.geojson / .js
    ├── risco_geologico.geojson / .js
    ├── risco_geologico2.geojson / .js
    ├── rodovias_federais.geojson / .js
    ├── rodovias_estaduais.geojson / .js
    ├── logradouros_estradas_vicinais.geojson / .js
    ├── deslocamentos.geojson / .js
    ├── tracado_efbm.geojson / .js
    ├── trecho_ferroviario_efbm.geojson / .js
    ├── escolas.geojson / .js
    ├── estabelecimentos_saude.geojson / .js
    ├── bens_tombados.geojson / .js
    ├── comunidades_quilombolas.geojson / .js
    ├── efbm_margem_linha.geojson / .js
    ├── efbm_morro_feijao_bebido.geojson / .js
    ├── efbm_patrimonios.geojson / .js
    ├── estacoes_ferroviarias.geojson / .js
    ├── hospitais_sus.geojson / .js
    ├── imoveis_uniao.geojson / .js
    ├── postos_combustiveis.geojson / .js
    └── unidades_basicas_saude.geojson / .js
```

---

## 🛠️ Principais Recursos e Funcionalidades

1. **Responsividade Completa (Desktop, Tablet e Smartphone)**:
   * **Desktop**: Barra lateral esquerda com rolagem suave contínua, mapa central com controles flutuantes e inspetor de atributos à direita.
   * **Tablets e Celulares**: Barra lateral transforma-se em gaveta deslizante (*off-canvas drawer*) acionada pelo menu hambúrguer; o inspetor de atributos torna-se um elegante *bottom sheet* na porção inferior.
2. **Simbologia Temática Cartográfica Oficial**:
   * **Unidades Geológicas**: 12 litologias classificadas conforme código e cores do Serviço Geológico do Brasil (CPRM/SGB) — aluviões, granitos, enderbitos, charnockitos, etc.
   * **Compartimentos Geomorfológicos**: 6 classes de relevo (planícies fluviais, depressões, serranias, blocos montanhosos).
   * **Pedologia (Solos)**: Classes de solos do IBGE/Embrapa (Latossolos, Argissolos, Gleissolos, Afloramentos de Rocha).
   * **Riscos Geológicos**: Setorização oficial de risco alto (laranja) e muito alto (vermelho).
   * **Distritos Municipais**: 6 cores distintas para a sede e os 5 distritos rurais.
3. **Legendas Dinâmicas Automaticamente Exibidas**:
   * Ao ativar qualquer camada temática, sua legenda classificada surge imediatamente abaixo do controle da camada.
4. **Personalização de Simbologia pelo Usuário**:
   * Botão de paleta de cores (`fa-palette`) em cada camada, permitindo alterar preenchimento, contorno, espessura e opacidade em tempo real, com botão de restauração do padrão cartográfico.
5. **Seletor de Mapas Base no Canto Inferior Direito**:
   * Imagens de Satélite de alta resolução e Relevo Topográfico acessíveis de forma limpa acima da barra de coordenadas HUD.
6. **Inspetor Exclusivo de Atributos ("Detalhes do Objeto")**:
   * Ao clicar sobre qualquer feição no mapa, as informações abrem exclusivamente no painel lateral/inferior "Detalhes do Objeto", sem popups duplicados.
7. **Exportação KML e Importação GeoJSON**:
   * Botão direto para baixar qualquer camada em formato `.kml` para o Google Earth.
   * Ferramenta para o usuário carregar suas próprias camadas GeoJSON locais no mapa.
8. **Módulo de Geocolaboração Cidadã**:
   * Permite marcar impactos socioambientais (descarte irregular de lixo, erosão, queimadas, poluição hídrica), inserir fotos/vídeos e exportar relatos em KML.

---

## 🚀 Como Colocar Online no Vercel (`vercel.app`)

### Método 1: Publicação via GitHub (Recomendado)

1. Crie um novo repositório em sua conta do [GitHub](https://github.com/new), por exemplo: `geoportal-teofilo-otoni`.
2. Faça o upload dos arquivos desta pasta (`webGIS TO`) para o repositório.
3. Acesse o painel da [Vercel](https://vercel.com) com sua conta.
4. Clique em **"Add New..."** ➔ **"Project"** e importe o repositório.
5. As configurações padrão da Vercel serão aplicadas automaticamente (`Other`, `./`, sem build).
6. Clique em **"Deploy"**. Em segundos o Geoportal estará online em `https://geoportal-teofilo-otoni.vercel.app`.

### Método 2: Publicação Direta via Vercel CLI

```bash
# 1. Instalar o Vercel CLI (se necessário)
npm i -g vercel

# 2. Entrar na pasta do geoportal
cd "D:\SHAPES\Teofilo_Otoni\webGIS TO"

# 3. Publicar em produção
vercel deploy --prod
```

---

## 💻 Como Visualizar Localmente no Computador (Offline)

1. **Clique Duplo em `index.html`**:
   * Graças à arquitetura com carregadores JS em `data/`, a aplicação roda diretamente no protocolo `file:///` sem necessidade de servidor web.
2. **Ou via `iniciar_local.bat`**:
   * Inicia um servidor HTTP local na porta 8080 e abre o navegador automaticamente.
