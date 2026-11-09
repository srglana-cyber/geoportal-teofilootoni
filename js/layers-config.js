/**
 * GEOPORTAL MUNICIPAL DE TEÓFILO OTONI - MG
 * Configuração de Camadas Vetoriais e Metadados
 * 
 * Concepção e Elaboração: Prof. Sérgio Lana - Doutor em Geografia
 * Instituição: Instituto Federal do Norte de Minas Gerais (IFNMG) - Campus Teófilo Otoni
 * Currículo Lattes: http://lattes.cnpq.br/2773267607623633
 * Fontes: INDE, IDE-SISEMA (MG), IFNMG, Prefeitura Municipal de Teófilo Otoni
 */

const GEOPORTAL_CONFIG = {
  municipality: {
    name: "Teófilo Otoni",
    state: "Minas Gerais (MG)",
    center: [-17.8625, -41.5096], // Sede Municipal
    bounds: [
      [-18.0418, -41.6724], // Sudoeste
      [-17.3302, -41.0403]  // Nordeste
    ],
    initialZoom: 11
  },

  author: {
    name: "Prof. Sérgio Lana - Doutor em Geografia",
    title: "Professor do Ensino Básico, Técnico e Tecnológico — IFNMG (Campus Teófilo Otoni)",
    institution: "Instituto Federal do Norte de Minas Gerais (IFNMG)",
    campus: "Campus Teófilo Otoni",
    lattesUrl: "http://lattes.cnpq.br/2773267607623633",
    lattesId: "2773267607623633"
  },

  sources: {
    INDE: {
      name: "INDE - Infraestrutura Nacional de Dados Espaciais",
      badge: "INDE",
      color: "#059669",
      description: "Infraestrutura oficial que integra dados geoespaciais de órgãos federais e estaduais do Brasil (IBGE, CPRM, INCRA, FUNAI, DNIT, ANA)."
    },
    SISEMA: {
      name: "IDE-SISEMA - Infraestrutura de Dados Espaciais de MG",
      badge: "IDE-SISEMA (MG)",
      color: "#2563eb",
      description: "Sistema Estadual de Meio Ambiente e Recursos Hídricos de Minas Gerais (IEF, IGAM, FEAM, SICAR-MG)."
    },
    IFNMG: {
      name: "IFNMG - Campus Teófilo Otoni",
      badge: "IFNMG",
      color: "#16a34a",
      description: "Pesquisas acadêmicas, levantamentos cartográficos e georreferenciamento histórico (Estrada de Ferro Bahia e Minas - EFBM, infraestrutura educacional e estudos regionais do Prof. Sérgio Lana)."
    },
    PMTO: {
      name: "Prefeitura Municipal de Teófilo Otoni",
      badge: "Prefeitura de Teófilo Otoni",
      color: "#d97706",
      description: "Cadastros municipais, delimitações urbanas de bairros, logradouros e diagnóstico ambiental local."
    }
  },

  categories: [
    {
      id: "admin",
      title: "Divisão Político-Administrativa",
      icon: "fa-landmark-flag",
      description: "Limites territoriais, distritos, bairros e divisões censitárias"
    },
    {
      id: "ambiental",
      title: "Meio Ambiente & Recursos Hídricos",
      icon: "fa-leaf",
      description: "Bacias hidrográficas, nascentes, poços, vegetação, CAR e conservação"
    },
    {
      id: "geologia",
      title: "Geologia, Geomorfologia & Riscos",
      icon: "fa-mountain-sun",
      description: "Litologia, compartimentos do relevo, pedologia e áreas de risco geológico"
    },
    {
      id: "infra",
      title: "Infraestrutura, Transporte & Mobilidade",
      icon: "fa-road",
      description: "Malha rodoviária, vias vicinais, fluxos e traçado histórico da EFBM"
    },
    {
      id: "social",
      title: "Equipamentos Públicos & Serviços",
      icon: "fa-building-columns",
      description: "Rede escolar, estabelecimentos de saúde e infraestrutura de atendimento"
    },
    {
      id: "patrimonio_cultural",
      title: "Patrimônio Cultural, Histórico & Comunidades Tradicionais",
      icon: "fa-landmark",
      description: "Bens tombados, acervo e estações da EFBM, terras indígenas, quilombolas e assentamentos rurais"
    }
  ],

  layers: [
    // -------------------------------------------------------------------------
    // 1. DIVISÃO POLÍTICO-ADMINISTRATIVA
    // -------------------------------------------------------------------------
    {
      id: "limite_municipal",
      title: "Limite Municipal de Teófilo Otoni",
      category: "admin",
      source: "INDE",
      subsource: "IBGE (Malha Municipal)",
      url: "./data/limite_municipal.geojson",
      jsFile: "./data/limite_municipal.js",
      geomType: "polygon",
      active: true, // ÚNICA CAMADA ATIVA INICIALMENTE
      count: 1,
      style: {
        color: "#dc2626",       // Vermelho Carmim cartográfico oficial do IBGE para limites municipais
        weight: 3.5,
        opacity: 1,
        fill: false,
        fillColor: "transparent",
        fillOpacity: 0,
        dashArray: "8, 5"       // Traçado cartográfico oficial de limite municipal
      },
      legend: {
        type: "line",
        items: [
          { label: "Limite Municipal Oficial de Teófilo Otoni (IBGE)", color: "#dc2626", dash: true }
        ]
      },
      popupTitle: "Município de Teófilo Otoni",
      titleField: "name_muni",
      fields: [
        { key: "name_muni", label: "Município" },
        { key: "code_muni", label: "Código IBGE" },
        { key: "abbrev_state", label: "Estado (UF)" },
        { key: "name_region", label: "Região" }
      ]
    },
    {
      id: "distritos",
      title: "Distritos Municipais (6 Distritos)",
      category: "admin",
      source: "INDE",
      subsource: "IBGE / Prefeitura de Teófilo Otoni",
      url: "./data/distritos.geojson",
      jsFile: "./data/distritos.js",
      geomType: "polygon",
      active: false,
      count: 6,
      thematic: true,
      multiColorGradient: "linear-gradient(135deg, #818cf8, #34d399, #fbbf24, #fb7185, #38bdf8, #a78bfa)",
      classify: {
        field: "NOMEDISTRI",
        categories: {
          "Teófilo Otoni": {
            label: "Distrito Sede (Teófilo Otoni)",
            color: "#4338ca",
            fillColor: "#818cf8",
            fillOpacity: 0.45,
            weight: 2
          },
          "Topázio": {
            label: "Topázio",
            color: "#047857",
            fillColor: "#34d399",
            fillOpacity: 0.45,
            weight: 2
          },
          "Pedro Versiani": {
            label: "Pedro Versiani",
            color: "#b45309",
            fillColor: "#fbbf24",
            fillOpacity: 0.45,
            weight: 2
          },
          "Crispim Jacques": {
            label: "Crispim Jacques",
            color: "#be123c",
            fillColor: "#fb7185",
            fillOpacity: 0.45,
            weight: 2
          },
          "Mucuri": {
            label: "Mucuri",
            color: "#0369a1",
            fillColor: "#38bdf8",
            fillOpacity: 0.45,
            weight: 2
          },
          "Rio Pretinho": {
            label: "Rio Pretinho",
            color: "#6d28d9",
            fillColor: "#a78bfa",
            fillOpacity: 0.45,
            weight: 2
          }
        },
        default: {
          color: "#475569",
          fillColor: "#94a3b8",
          fillOpacity: 0.4,
          weight: 2
        }
      },
      style: {
        color: "#4338ca",
        weight: 2,
        opacity: 0.95,
        fillColor: "#818cf8",
        fillOpacity: 0.45
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Teófilo Otoni (Sede)", color: "#4338ca", fillColor: "#818cf8" },
          { label: "Topázio", color: "#047857", fillColor: "#34d399" },
          { label: "Pedro Versiani", color: "#b45309", fillColor: "#fbbf24" },
          { label: "Crispim Jacques", color: "#be123c", fillColor: "#fb7185" },
          { label: "Mucuri", color: "#0369a1", fillColor: "#38bdf8" },
          { label: "Rio Pretinho", color: "#6d28d9", fillColor: "#a78bfa" }
        ]
      },
      popupTitle: "Distrito Municipal",
      titleField: "NOMEDISTRI",
      fields: [
        { key: "NOMEDISTRI", label: "Nome do Distrito" },
        { key: "IBGE_DIST", label: "Código IBGE Distrito" },
        { key: "MUNICípIO", label: "Município" }
      ]
    },
    {
      id: "bairros",
      title: "Bairros Urbanos",
      category: "admin",
      source: "PMTO",
      subsource: "Prefeitura Municipal / IBGE",
      url: "./data/bairros.geojson",
      jsFile: "./data/bairros.js",
      geomType: "polygon",
      active: false,
      count: 39,
      style: {
        color: "#7c3aed",
        weight: 1.8,
        opacity: 0.9,
        fillColor: "#8b5cf6",
        fillOpacity: 0.2
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Perímetro dos 39 Bairros", color: "#7c3aed", fillColor: "#8b5cf6" }
        ]
      },
      popupTitle: "Bairro",
      titleField: "name_neighborhood",
      fields: [
        { key: "name_neighborhood", label: "Nome do Bairro" },
        { key: "code_neighborhood", label: "Código do Bairro" },
        { key: "name_district", label: "Distrito" },
        { key: "name_muni", label: "Município" }
      ]
    },
    {
      id: "sede_municipal",
      title: "Sede Municipal (Marco Zero)",
      category: "admin",
      source: "INDE",
      subsource: "IBGE",
      url: "./data/sede_municipal.geojson",
      jsFile: "./data/sede_municipal.js",
      geomType: "point",
      active: false,
      count: 1,
      pointStyle: {
        icon: "fa-landmark",
        markerColor: "#dc2626",
        iconColor: "#ffffff",
        radius: 10
      },
      legend: {
        type: "point",
        items: [
          { label: "Marco Zero / Sede Municipal", color: "#dc2626", icon: "fa-landmark" }
        ]
      },
      popupTitle: "Sede Municipal",
      titleField: "name_muni",
      fields: [
        { key: "name_muni", label: "Sede" },
        { key: "code_muni", label: "Código IBGE" },
        { key: "abbrev_state", label: "UF" },
        { key: "year", label: "Ano de Referência" }
      ]
    },
    {
      id: "localidades",
      title: "Localidades, Vilas e Povoados",
      category: "admin",
      source: "INDE",
      subsource: "IBGE (Base de Localidades 2010)",
      url: "./data/localidades.geojson",
      jsFile: "./data/localidades.js",
      geomType: "point",
      active: false,
      count: 10,
      pointStyle: {
        icon: "fa-location-dot",
        markerColor: "#059669",
        iconColor: "#ffffff",
        radius: 7
      },
      legend: {
        type: "point",
        items: [
          { label: "Vilas, Povoados e Comunidades", color: "#059669", icon: "fa-location-dot" }
        ]
      },
      popupTitle: "Localidade / Povoado",
      titleField: "NOME",
      fields: [
        { key: "NOME", label: "Nome" },
        { key: "TIPO", label: "Classificação (Vila/Povoado/Cidade)" },
        { key: "MUN", label: "Município" },
        { key: "FONTE", label: "Fonte dos Dados" }
      ]
    },
    {
      id: "setores_censitarios",
      title: "Setores Censitários (IBGE)",
      category: "admin",
      source: "INDE",
      subsource: "IBGE Censo Demográfico",
      url: "./data/setores_censitarios.geojson",
      jsFile: "./data/setores_censitarios.js",
      geomType: "polygon",
      active: false,
      count: 267,
      style: {
        color: "#64748b",
        weight: 1,
        opacity: 0.8,
        fillColor: "#94a3b8",
        fillOpacity: 0.15
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Malha de Setores Censitários", color: "#64748b", fillColor: "#94a3b8" }
        ]
      },
      popupTitle: "Setor Censitário",
      titleField: "code_tract",
      fields: [
        { key: "code_tract", label: "Código do Setor" },
        { key: "situacao", label: "Situação (Urbana/Rural)" },
        { key: "name_neighborhood", label: "Bairro" },
        { key: "name_district", label: "Distrito" },
        { key: "area_km2", label: "Área (km²)", format: v => (v ? Number(v).toFixed(3) + " km²" : "-") }
      ]
    },
    {
      id: "imoveis_uniao",
      title: "Imóveis e Terrenos da União (SPU)",
      category: "admin",
      source: "INDE",
      subsource: "Secretaria do Patrimônio da União (SPU / Geocatálogo)",
      url: "./data/imoveis_uniao.geojson",
      jsFile: "./data/imoveis_uniao.js",
      geomType: "point",
      active: false,
      count: 48,
      pointStyle: {
        icon: "fa-building-shield",
        markerColor: "#0284c7",
        iconColor: "#ffffff",
        radius: 6
      },
      legend: {
        type: "point",
        items: [
          { label: "Patrimônio Imobiliário da União (SPU)", color: "#0284c7", icon: "fa-building-shield" }
        ]
      },
      popupTitle: "Imóvel da União",
      titleField: "tipoimovel",
      fields: [
        { key: "tipoimovel", label: "Tipo do Imóvel" },
        { key: "conceituac", label: "Conceituação / Regime" },
        { key: "classeimov", label: "Classe do Imóvel" },
        { key: "ripimovel", label: "RIP Imóvel" },
        { key: "riputiliza", label: "RIP Utilização" }
      ]
    },

    // -------------------------------------------------------------------------
    // 2. MEIO AMBIENTE & RECURSOS HÍDRICOS
    // -------------------------------------------------------------------------
    {
      id: "bacia_rio_todos_os_santos",
      title: "Bacia do Rio Todos os Santos",
      category: "ambiental",
      source: "SISEMA",
      subsource: "IDE-SISEMA / IGAM / ANA",
      url: "./data/bacia_rio_todos_os_santos.geojson",
      jsFile: "./data/bacia_rio_todos_os_santos.js",
      geomType: "polygon",
      active: false,
      count: 1,
      style: {
        color: "#0284c7",
        weight: 2.5,
        opacity: 0.9,
        fillColor: "#38bdf8",
        fillOpacity: 0.18
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Bacia Hidrográfica Todos os Santos", color: "#0284c7", fillColor: "#38bdf8" }
        ]
      },
      popupTitle: "Bacia Hidrográfica",
      titleField: "COBACIA",
      fields: [
        { key: "COBACIA", label: "Código Otto-Bacia" },
        { key: "NUAREACONT", label: "Área de Contribuição (km²)" },
        { key: "PERIMETRO", label: "Perímetro (km)", format: v => (v ? Number(v).toFixed(2) + " km" : "-") },
        { key: "DTVERSAO", label: "Versão / Data" }
      ]
    },
    {
      id: "hidrografia_todos_os_santos",
      title: "Hidrografia Detalhada - Bacia Todos os Santos",
      category: "ambiental",
      source: "SISEMA",
      subsource: "IDE-SISEMA / ANA (Otto-codificada)",
      url: "./data/hidrografia_todos_os_santos.geojson",
      jsFile: "./data/hidrografia_todos_os_santos.js",
      geomType: "line",
      active: false,
      count: 2595,
      style: {
        color: "#0284c7",
        weight: 1.8,
        opacity: 0.85
      },
      legend: {
        type: "line",
        items: [
          { label: "Rede de Drenagem Otto-codificada", color: "#0284c7", weight: 2 }
        ]
      },
      popupTitle: "Trecho de Drenagem",
      titleField: "norio",
      fields: [
        { key: "norio", label: "Nome do Rio / Córrego" },
        { key: "dedominial", label: "Dominialidade" },
        { key: "nucomptrec", label: "Comprimento do Trecho (km)", format: v => (v ? Number(v).toFixed(2) + " km" : "-") },
        { key: "cocursodag", label: "Código Curso d'Água" }
      ]
    },
    {
      id: "curso_dagua",
      title: "Rede de Cursos d'Água (IBGE)",
      category: "ambiental",
      source: "INDE",
      subsource: "IBGE / INDE",
      url: "./data/curso_dagua.geojson",
      jsFile: "./data/curso_dagua.js",
      geomType: "line",
      active: false,
      count: 834,
      style: {
        color: "#0ea5e9",
        weight: 1.5,
        opacity: 0.8
      },
      legend: {
        type: "line",
        items: [
          { label: "Cursos d'Água Principais (IBGE)", color: "#0ea5e9", weight: 2 }
        ]
      },
      popupTitle: "Curso d'Água",
      titleField: "nome",
      fields: [
        { key: "nome", label: "Nome", format: v => v || "Sem denominação cadastrada" },
        { key: "tipotrecho", label: "Tipo do Trecho" },
        { key: "regime", label: "Regime (Permanente/Temporário)" },
        { key: "navegavel", label: "Navegabilidade" }
      ]
    },
    {
      id: "nascentes_urbanas",
      title: "Nascentes Urbanas",
      category: "ambiental",
      source: "IFNMG",
      subsource: "IFNMG - Campus Teófilo Otoni (Prof. Sérgio Lana)",
      url: "./data/nascentes_urbanas.geojson",
      jsFile: "./data/nascentes_urbanas.js",
      geomType: "point",
      active: false,
      count: 34,
      pointStyle: {
        icon: "fa-droplet",
        markerColor: "#0284c7",
        iconColor: "#ffffff",
        radius: 7
      },
      legend: {
        type: "point",
        items: [
          { label: "Olhos d'Água e Nascentes Urbanas (IFNMG)", color: "#0284c7", icon: "fa-droplet" }
        ]
      },
      popupTitle: "Nascente Urbana",
      titleField: "Id",
      fields: [
        { key: "Id", label: "Identificador da Nascente" },
        { key: "Coord_X", label: "Coordenada X (UTM)" },
        { key: "Coord_Y", label: "Coordenada Y (UTM)" }
      ]
    },
    {
      id: "pocos",
      title: "Poços Tubulares - SIAGAS / CPRM",
      category: "ambiental",
      source: "INDE",
      subsource: "CPRM - Serviço Geológico do Brasil (SIAGAS)",
      url: "./data/pocos.geojson",
      jsFile: "./data/pocos.js",
      geomType: "point",
      active: false,
      count: 208,
      pointStyle: {
        icon: "fa-faucet-drip",
        markerColor: "#0369a1",
        iconColor: "#ffffff",
        radius: 6
      },
      legend: {
        type: "point",
        items: [
          { label: "Poços Tubulares Cadastrados (SIAGAS)", color: "#0369a1", icon: "fa-faucet-drip" }
        ]
      },
      popupTitle: "Poço Tubular",
      titleField: "idt_ponto",
      fields: [
        { key: "idt_ponto", label: "Código SIAGAS" },
        { key: "natureza_ponto", label: "Natureza do Ponto" },
        { key: "local", label: "Localidade" },
        { key: "vazao_estabilizacao", label: "Vazão de Estabilização (m³/h)" },
        { key: "url", label: "Ficha Técnica SIAGAS", format: v => (v ? `<a href="${v}" target="_blank" class="text-blue-600 underline font-semibold">Consultar Ficha no CPRM <i class="fa fa-external-link"></i></a>` : "-") }
      ]
    },
    {
      id: "unidades_conservacao",
      title: "Unidade de Conservação - APA Alto do Mucuri",
      category: "ambiental",
      source: "SISEMA",
      subsource: "IDE-SISEMA / IEF-MG",
      url: "./data/unidades_conservacao.geojson",
      jsFile: "./data/unidades_conservacao.js",
      geomType: "polygon",
      active: false,
      count: 1,
      style: {
        color: "#15803d",
        weight: 2.5,
        opacity: 0.95,
        fillColor: "#22c55e",
        fillOpacity: 0.25
      },
      legend: {
        type: "polygon",
        items: [
          { label: "APA do Alto do Mucuri (IEF-MG)", color: "#15803d", fillColor: "#22c55e" }
        ]
      },
      popupTitle: "Unidade de Conservação",
      titleField: "name_conservation_unit",
      fields: [
        { key: "name_conservation_unit", label: "Nome da UC" },
        { key: "category", label: "Categoria de Manejo" },
        { key: "government_level", label: "Esfera de Gestão" },
        { key: "legislation", label: "Ato Legal de Criação" },
        { key: "creation_year", label: "Ano de Criação" },
        { key: "name_organization", label: "Órgão Gestor" }
      ]
    },
    {
      id: "vegetacao",
      title: "Cobertura Vegetal e Uso do Solo",
      category: "ambiental",
      source: "SISEMA",
      subsource: "IDE-SISEMA / IEF-MG / IBGE",
      url: "./data/vegetacao.geojson",
      jsFile: "./data/vegetacao.js",
      geomType: "polygon",
      active: false,
      count: 27,
      thematic: true,
      multiColorGradient: "linear-gradient(135deg, #16a34a, #84cc16, #f59e0b, #64748b, #fb7185)",
      classify: {
        field: "legenda_2",
        categories: {
          "Vegetação Secundária": {
            label: "Vegetação Secundária (Mata Atlântica / Floresta Semidecidual)",
            color: "#14532d",
            fillColor: "#16a34a",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "Pecuária (pastagens)": {
            label: "Pecuária (Pastagens e Áreas Forrageiras)",
            color: "#3f6212",
            fillColor: "#84cc16",
            fillOpacity: 0.55,
            weight: 1.2
          },
          "Agropecuária": {
            label: "Agropecuária (Culturas Agrícolas e Mistas)",
            color: "#92400e",
            fillColor: "#f59e0b",
            fillOpacity: 0.55,
            weight: 1.2
          },
          "Afloramento Rochoso": {
            label: "Afloramento Rochoso (Vegetação Rupestre / Pontões)",
            color: "#1e293b",
            fillColor: "#64748b",
            fillOpacity: 0.7,
            weight: 1.2
          },
          "Influência urbana": {
            label: "Influência Urbana (Áreas Antropizadas e Construídas)",
            color: "#9f1239",
            fillColor: "#fb7185",
            fillOpacity: 0.6,
            weight: 1.2
          }
        },
        default: {
          color: "#15803d",
          fillColor: "#4ade80",
          fillOpacity: 0.5,
          weight: 1.2
        }
      },
      style: {
        color: "#15803d",
        weight: 1.2,
        opacity: 0.9,
        fillColor: "#16a34a",
        fillOpacity: 0.6
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Vegetação Secundária (Mata Atlântica / Floresta Semidecidual)", color: "#14532d", fillColor: "#16a34a" },
          { label: "Pecuária (Pastagens e Áreas Forrageiras)", color: "#3f6212", fillColor: "#84cc16" },
          { label: "Agropecuária (Culturas Agrícolas e Mistas)", color: "#92400e", fillColor: "#f59e0b" },
          { label: "Afloramento Rochoso (Vegetação Rupestre)", color: "#1e293b", fillColor: "#64748b" },
          { label: "Influência Urbana (Áreas Construídas)", color: "#9f1239", fillColor: "#fb7185" }
        ]
      },
      popupTitle: "Cobertura Vegetal e Uso da Terra",
      titleField: "legenda_2",
      fields: [
        { key: "legenda_2", label: "Classe de Cobertura e Uso" },
        { key: "nm_pretet", label: "Fitofisionomia Original / Potencial" },
        { key: "nm_uveg", label: "Unidade de Vegetação Natural" },
        { key: "legenda", label: "Código / Detalhamento" },
        { key: "ar_poli_km", label: "Área do Polígono (km²)", format: v => (v ? Number(v).toFixed(2) + " km²" : "-") }
      ]
    },
    {
      id: "terras_indigenas",
      title: "Terras Indígenas (Maxakali)",
      category: "patrimonio_cultural",
      source: "INDE",
      subsource: "FUNAI / INDE",
      url: "./data/terras_indigenas.geojson",
      jsFile: "./data/terras_indigenas.js",
      geomType: "polygon",
      active: false,
      count: 1,
      style: {
        color: "#c2410c",
        weight: 2.5,
        opacity: 0.95,
        fillColor: "#ea580c",
        fillOpacity: 0.25
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Reserva Indígena Maxakali (Mundo Verde)", color: "#c2410c", fillColor: "#ea580c" }
        ]
      },
      popupTitle: "Terra Indígena",
      titleField: "terrai_nom",
      fields: [
        { key: "terrai_nom", label: "Nome da Terra Indígena" },
        { key: "etnia_nome", label: "Etnia / Povo" },
        { key: "modalidade", label: "Modalidade" },
        { key: "fase_ti", label: "Fase de Regularização" },
        { key: "superficie", label: "Superfície (ha)", format: v => (v ? Number(v).toFixed(2) + " ha" : "-") },
        { key: "undadm_nom", label: "Unidade Administrativa FUNAI" }
      ]
    },
    {
      id: "comunidades_quilombolas",
      title: "Comunidades Quilombolas (FCP / INCRA / IBGE)",
      category: "patrimonio_cultural",
      source: "INDE",
      subsource: "Fundação Cultural Palmares / INCRA / IBGE",
      url: "./data/comunidades_quilombolas.geojson",
      jsFile: "./data/comunidades_quilombolas.js",
      geomType: "point",
      active: false,
      count: 3,
      pointStyle: {
        icon: "fa-people-roof",
        markerColor: "#7c2d12",
        iconColor: "#ffffff",
        radius: 8
      },
      legend: {
        type: "point",
        items: [
          { label: "Comunidades Quilombolas Reconhecidas", color: "#7c2d12", icon: "fa-people-roof" }
        ]
      },
      popupTitle: "Comunidade Quilombola",
      titleField: "nm_cq",
      fields: [
        { key: "nm_cq", label: "Nome da Comunidade Quilombola" },
        { key: "prefixo", label: "Classificação" },
        { key: "p_fcp", label: "Processo Palmares (FCP)" },
        { key: "cd_lq", label: "Código da Localidade Quilombola (IBGE)" }
      ]
    },
    {
      id: "assentamentos_incra",
      title: "Assentamentos de Reforma Agrária (INCRA)",
      category: "patrimonio_cultural",
      source: "INDE",
      subsource: "INCRA / INDE",
      url: "./data/assentamentos_incra.geojson",
      jsFile: "./data/assentamentos_incra.js",
      geomType: "polygon",
      active: false,
      count: 3,
      style: {
        color: "#b45309",
        weight: 2,
        opacity: 0.9,
        fillColor: "#f59e0b",
        fillOpacity: 0.25
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Projetos de Assentamento (PA Saudade, etc.)", color: "#b45309", fillColor: "#f59e0b" }
        ]
      },
      popupTitle: "Projeto de Assentamento",
      titleField: "NOME_PRO2",
      fields: [
        { key: "NOME_PRO2", label: "Nome do Assentamento" },
        { key: "CD_SIPRA1", label: "Código SIPRA" },
        { key: "NUM_FAMI6", label: "Capacidade / Famílias" },
        { key: "DATA_DE_8", label: "Data de Criação" },
        { key: "AREA_HEC4", label: "Área (ha)", format: v => (v ? Number(v).toFixed(2) + " ha" : "-") },
        { key: "DESCRICA13", label: "Situação Operacional" }
      ]
    },
    {
      id: "imoveis_rurais",
      title: "Imóveis Rurais - Cadastro Ambiental Rural (CAR)",
      category: "ambiental",
      source: "SISEMA",
      subsource: "IDE-SISEMA / SICAR-MG",
      url: "./data/imoveis_rurais.geojson",
      jsFile: "./data/imoveis_rurais.js",
      geomType: "polygon",
      active: false,
      count: 4089,
      style: {
        color: "#65a30d",
        weight: 1,
        opacity: 0.75,
        fillColor: "#84cc16",
        fillOpacity: 0.15
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Propriedades Rurais (CAR/SICAR)", color: "#65a30d", fillColor: "#84cc16" }
        ]
      },
      popupTitle: "Imóvel Rural (CAR)",
      titleField: "cod_imovel",
      fields: [
        { key: "cod_imovel", label: "Código SICAR" },
        { key: "status_imovel", label: "Status do Cadastro" },
        { key: "condicao", label: "Condição" },
        { key: "area", label: "Área (ha)", format: v => (v ? Number(v).toFixed(2) + " ha" : "-") },
        { key: "m_fiscal", label: "Módulos Fiscais" },
        { key: "tipo_imovel", label: "Tipo do Imóvel" }
      ]
    },

    // -------------------------------------------------------------------------
    // 3. GEOLOGIA, GEOMORFOLOGIA & RISCOS
    // -------------------------------------------------------------------------
    {
      id: "geologia",
      title: "Unidades Geológicas (Litologia)",
      category: "geologia",
      source: "INDE",
      subsource: "CPRM - Serviço Geológico do Brasil",
      url: "./data/geologia.geojson",
      jsFile: "./data/geologia.js",
      geomType: "polygon",
      active: false,
      count: 47,
      thematic: true,
      multiColorGradient: "linear-gradient(135deg, #fef08a, #fb923c, #f43f5e, #a855f7, #6366f1)",
      classify: {
        field: "letra_simb",
        categories: {
          "Q2a": {
            label: "Depósitos Aluvionares Holocênicos",
            code: "Q2a",
            color: "#ca8a04",
            fillColor: "#fef08a",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "C-1(G)4lbl": {
            label: "Granito Barra da Limeira",
            code: "C-1(G)4lbl",
            color: "#e11d48",
            fillColor: "#fca5a5",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "C-1(G)4lca": {
            label: "Granito Caladão",
            code: "C-1(G)4lca",
            color: "#9f1239",
            fillColor: "#f43f5e",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "C-1(G)4lcr": {
            label: "Granito Criciúma",
            code: "C-1(G)4lcr",
            color: "#c2410c",
            fillColor: "#fb923c",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "C-2(G)4Cpp": {
            label: "Charnockito Padre Paraíso",
            code: "C-2(G)4Cpp",
            color: "#4d7c0f",
            fillColor: "#84cc16",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "NP3(G)2lem": {
            label: "Enderbito Mangalô",
            code: "NP3(G)2lem",
            color: "#047857",
            fillColor: "#10b981",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "NP3(G)2Swf": {
            label: "Granito Wolf",
            code: "NP3(G)2Swf",
            color: "#a21caf",
            fillColor: "#e879f9",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "NP3(G)2Sfc": {
            label: "Leucogranito Faísca",
            code: "NP3(G)2Sfc",
            color: "#be185d",
            fillColor: "#f472b6",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "NP3(G)2Scr": {
            label: "Leucogranito Caraí",
            code: "NP3(G)2Scr",
            color: "#9d174d",
            fillColor: "#ec4899",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "NP3(G)2Itz": {
            label: "Granodiorito Gnáissico Topázio",
            code: "NP3(G)2Itz",
            color: "#6b21a8",
            fillColor: "#a855f7",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "NP3(G)1Isv": {
            label: "Tonalito São Vitor",
            code: "NP3(G)1Isv",
            color: "#3730a3",
            fillColor: "#6366f1",
            fillOpacity: 0.65,
            weight: 1.2
          },
          "NP1dt": {
            label: "Tumiritinga",
            code: "NP1dt",
            color: "#713f12",
            fillColor: "#a16207",
            fillOpacity: 0.65,
            weight: 1.2
          }
        },
        default: {
          color: "#9a3412",
          fillColor: "#fb923c",
          fillOpacity: 0.6,
          weight: 1.2
        }
      },
      style: {
        color: "#9a3412",
        weight: 1.2,
        opacity: 0.9,
        fillColor: "#fb923c",
        fillOpacity: 0.65
      },
      legend: {
        type: "polygon",
        items: [
          { code: "Q2a", label: "Depósitos Aluvionares Holocênicos", color: "#ca8a04", fillColor: "#fef08a" },
          { code: "C-1(G)4lbl", label: "Granito Barra da Limeira", color: "#e11d48", fillColor: "#fca5a5" },
          { code: "C-1(G)4lca", label: "Granito Caladão", color: "#9f1239", fillColor: "#f43f5e" },
          { code: "C-1(G)4lcr", label: "Granito Criciúma", color: "#c2410c", fillColor: "#fb923c" },
          { code: "C-2(G)4Cpp", label: "Charnockito Padre Paraíso", color: "#4d7c0f", fillColor: "#84cc16" },
          { code: "NP3(G)2lem", label: "Enderbito Mangalô", color: "#047857", fillColor: "#10b981" },
          { code: "NP3(G)2Swf", label: "Granito Wolf", color: "#a21caf", fillColor: "#e879f9" },
          { code: "NP3(G)2Sfc", label: "Leucogranito Faísca", color: "#be185d", fillColor: "#f472b6" },
          { code: "NP3(G)2Scr", label: "Leucogranito Caraí", color: "#9d174d", fillColor: "#ec4899" },
          { code: "NP3(G)2Itz", label: "Granodiorito Gnáissico Topázio", color: "#6b21a8", fillColor: "#a855f7" },
          { code: "NP3(G)1Isv", label: "Tonalito São Vitor", color: "#3730a3", fillColor: "#6366f1" },
          { code: "NP1dt", label: "Tumiritinga", color: "#713f12", fillColor: "#a16207" }
        ]
      },
      popupTitle: "Unidade Geológica",
      titleField: "nm_unidade",
      fields: [
        { key: "nm_unidade", label: "Unidade Litoestratigráfica" },
        { key: "letra_simb", label: "Símbolo Cartográfico" },
        { key: "nm_tempo_g", label: "Tempo Geológico / Era" },
        { key: "nm_provincia", label: "Província Geotectônica" },
        { key: "nm_sub_provincia", label: "Sub-província" },
        { key: "ar_poli_km", label: "Área (km²)", format: v => (v ? Number(v).toFixed(2) + " km²" : "-") }
      ]
    },
    {
      id: "geodiversidade",
      title: "Domínios de Geodiversidade e Relevo",
      category: "geologia",
      source: "INDE",
      subsource: "CPRM - Mapa de Geodiversidade de MG",
      url: "./data/geodiversidade.geojson",
      jsFile: "./data/geodiversidade.js",
      geomType: "polygon",
      active: false,
      count: 44,
      thematic: true,
      multiColorGradient: "linear-gradient(135deg, #f472b6, #fb923c, #c084fc, #b45309)",
      classify: {
        field: "DOMINIO",
        categories: {
          "Domínio dos Complexos Granitóides não deformados": {
            label: "Complexos Granitóides não deformados",
            color: "#db2777",
            fillColor: "#f472b6",
            fillOpacity: 0.6,
            weight: 1.2
          },
          "Domínio dos Complexos Granitóides deformados": {
            label: "Complexos Granitóides deformados",
            color: "#c2410c",
            fillColor: "#fb923c",
            fillOpacity: 0.6,
            weight: 1.2
          },
          "Domínio dos Complexos Granitóides intensamente deformados: ortognaisses": {
            label: "Ortognaisses (intensamente deformados)",
            color: "#7e22ce",
            fillColor: "#c084fc",
            fillOpacity: 0.6,
            weight: 1.2
          },
          "Domínio do Complexo Granito-gnaisse-Migmatítico e Granulitos": {
            label: "Granito-gnaisse-migmatítico e granulitos",
            color: "#78350f",
            fillColor: "#b45309",
            fillOpacity: 0.6,
            weight: 1.2
          }
        },
        default: {
          color: "#b45309",
          fillColor: "#fde047",
          fillOpacity: 0.5,
          weight: 1.2
        }
      },
      style: {
        color: "#b45309",
        weight: 1.2,
        opacity: 0.85,
        fillColor: "#fb923c",
        fillOpacity: 0.6
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Granitoides não deformados", color: "#db2777", fillColor: "#f472b6" },
          { label: "Granitoides deformados", color: "#c2410c", fillColor: "#fb923c" },
          { label: "Ortognaisses deformados", color: "#7e22ce", fillColor: "#c084fc" },
          { label: "Granito-gnaisse e Granulitos", color: "#78350f", fillColor: "#b45309" }
        ]
      },
      popupTitle: "Unidade de Geodiversidade",
      titleField: "NOME_UNIDA",
      fields: [
        { key: "NOME_UNIDA", label: "Nome da Unidade" },
        { key: "LITOTIPO1", label: "Litotipo Predominante" },
        { key: "CLASSE_ROC", label: "Classe de Rocha" },
        { key: "DOMINIO", label: "Domínio Geológico" },
        { key: "RELEVO", label: "Compartimento de Relevo" },
        { key: "DECLIVIDAD", label: "Declividade Estimada" },
        { key: "AMPL_TOPO", label: "Amplitude Topográfica" }
      ]
    },
    {
      id: "geomorfologia",
      title: "Compartimentos Geomorfológicos",
      category: "geologia",
      source: "INDE",
      subsource: "IBGE / IDE-SISEMA",
      url: "./data/geomorfologia.geojson",
      jsFile: "./data/geomorfologia.js",
      geomType: "polygon",
      active: false,
      count: 34,
      thematic: true,
      multiColorGradient: "linear-gradient(135deg, #6ee7b7, #fde047, #fdba74, #d97706, #78350f)",
      classify: {
        field: "letra_simb",
        categories: {
          "Aptf": {
            label: "Planícies e Terraços Fluviais",
            code: "Aptf",
            color: "#059669",
            fillColor: "#6ee7b7",
            fillOpacity: 0.6,
            weight: 1.2
          },
          "Da": {
            label: "Depressão dos Rios Mucuri e Alcobaça",
            code: "Da",
            color: "#ca8a04",
            fillColor: "#fde047",
            fillOpacity: 0.6,
            weight: 1.2
          },
          "Dc": {
            label: "Patamar do Divisor dos Rios Doce, Mucuri e São Mateus",
            code: "Dc",
            color: "#ea580c",
            fillColor: "#fdba74",
            fillOpacity: 0.6,
            weight: 1.2
          },
          "DEa": {
            label: "Serranias do Alto Mucuri",
            code: "DEa",
            color: "#92400e",
            fillColor: "#d97706",
            fillOpacity: 0.6,
            weight: 1.2
          },
          "DEc": {
            label: "Serranias do Divisor do Médio Jequitinhonha - Mucuri",
            code: "DEc",
            color: "#78350f",
            fillColor: "#b45309",
            fillOpacity: 0.6,
            weight: 1.2
          },
          "Apf": {
            label: "Bloco Montanhoso dos Pontões Capixabas e Mineiros",
            code: "Apf",
            color: "#451a03",
            fillColor: "#78350f",
            fillOpacity: 0.6,
            weight: 1.2
          }
        },
        default: {
          color: "#57534e",
          fillColor: "#a8a29e",
          fillOpacity: 0.5,
          weight: 1.2
        }
      },
      style: {
        color: "#57534e",
        weight: 1.2,
        opacity: 0.85,
        fillColor: "#d97706",
        fillOpacity: 0.6
      },
      legend: {
        type: "polygon",
        items: [
          { code: "Aptf", label: "Planícies e Terraços Fluviais", color: "#059669", fillColor: "#6ee7b7" },
          { code: "Da", label: "Depressão dos Rios Mucuri e Alcobaça", color: "#ca8a04", fillColor: "#fde047" },
          { code: "Dc", label: "Patamar do Divisor Doce/Mucuri/São Mateus", color: "#ea580c", fillColor: "#fdba74" },
          { code: "DEa", label: "Serranias do Alto Mucuri", color: "#92400e", fillColor: "#d97706" },
          { code: "DEc", label: "Serranias do Divisor Jequitinhonha - Mucuri", color: "#78350f", fillColor: "#b45309" },
          { code: "Apf", label: "Bloco Montanhoso dos Pontões", color: "#451a03", fillColor: "#78350f" }
        ]
      },
      popupTitle: "Compartimento Geomorfológico",
      titleField: "nm_unidade",
      fields: [
        { key: "nm_unidade", label: "Compartimento do Relevo" },
        { key: "letra_simb", label: "Símbolo Cartográfico" },
        { key: "forma", label: "Morfologia e Forma de Topo" },
        { key: "nm_dominio", label: "Domínio Morfoclimático" },
        { key: "nm_regiao", label: "Região Geomorfológica" },
        { key: "ar_poli_km", label: "Área (km²)", format: v => (v ? Number(v).toFixed(2) + " km²" : "-") }
      ]
    },
    {
      id: "relevo",
      title: "Relevo (Macrocompartimentos)",
      category: "geologia",
      source: "INDE",
      subsource: "IBGE / CPRM",
      url: "./data/relevo.geojson",
      jsFile: "./data/relevo.js",
      geomType: "polygon",
      active: false,
      count: 12,
      thematic: true,
      multiColorGradient: "linear-gradient(135deg, #E6F5FF, #A80000, #A87000, #FFFF00, #D7C29E, #ABCD66)",
      classify: {
        field: "Compartime",
        categories: {
          "Corpo d'água continental": {
            label: "Corpo d'água — RGB(230, 245, 255)",
            color: "#60a5fa",
            fillColor: "#E6F5FF",
            fillOpacity: 0.85,
            weight: 1.2
          },
          "Corpo d'água": {
            label: "Corpo d'água — RGB(230, 245, 255)",
            color: "#60a5fa",
            fillColor: "#E6F5FF",
            fillOpacity: 0.85,
            weight: 1.2
          },
          "Montanhas": {
            label: "Montanhas — RGB(168, 0, 0)",
            color: "#7f1d1d",
            fillColor: "#A80000",
            fillOpacity: 0.75,
            weight: 1.2
          },
          "Planaltos": {
            label: "Planaltos — RGB(168, 112, 0)",
            color: "#78350f",
            fillColor: "#A87000",
            fillOpacity: 0.75,
            weight: 1.2
          },
          "Planícies": {
            label: "Planícies — RGB(255, 255, 0)",
            color: "#ca8a04",
            fillColor: "#FFFF00",
            fillOpacity: 0.75,
            weight: 1.2
          },
          "Planicies": {
            label: "Planícies — RGB(255, 255, 0)",
            color: "#ca8a04",
            fillColor: "#FFFF00",
            fillOpacity: 0.75,
            weight: 1.2
          },
          "Superfícies Rebaixadas": {
            label: "Superfícies rebaixadas — RGB(215, 194, 158)",
            color: "#a89078",
            fillColor: "#D7C29E",
            fillOpacity: 0.75,
            weight: 1.2
          },
          "Superfícies rebaixadas": {
            label: "Superfícies rebaixadas — RGB(215, 194, 158)",
            color: "#a89078",
            fillColor: "#D7C29E",
            fillOpacity: 0.75,
            weight: 1.2
          },
          "Tabuleiros": {
            label: "Tabuleiros — RGB(171, 205, 102)",
            color: "#65a30d",
            fillColor: "#ABCD66",
            fillOpacity: 0.75,
            weight: 1.2
          }
        },
        default: {
          color: "#94a3b8",
          fillColor: "#cbd5e1",
          fillOpacity: 0.6,
          weight: 1.2
        }
      },
      style: {
        color: "#64748b",
        weight: 1.2,
        opacity: 0.9,
        fillColor: "#D7C29E",
        fillOpacity: 0.75
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Corpo d'água — RGB(230, 245, 255)", color: "#60a5fa", fillColor: "#E6F5FF" },
          { label: "Montanhas — RGB(168, 0, 0)", color: "#7f1d1d", fillColor: "#A80000" },
          { label: "Planaltos — RGB(168, 112, 0)", color: "#78350f", fillColor: "#A87000" },
          { label: "Planícies — RGB(255, 255, 0)", color: "#ca8a04", fillColor: "#FFFF00" },
          { label: "Superfícies rebaixadas — RGB(215, 194, 158)", color: "#a89078", fillColor: "#D7C29E" },
          { label: "Tabuleiros — RGB(171, 205, 102)", color: "#65a30d", fillColor: "#ABCD66" }
        ]
      },
      popupTitle: "Macrocompartimento de Relevo",
      titleField: "Compartime",
      fields: [
        { key: "Compartime", label: "Compartimento do Relevo" },
        { key: "area_km2", label: "Área (km²)", format: v => (v ? Number(v).toFixed(2) + " km²" : "-") }
      ]
    },
    {
      id: "pedologia",
      title: "Pedologia (Classes de Solos)",
      category: "geologia",
      source: "INDE",
      subsource: "IBGE / IDE-SISEMA",
      url: "./data/pedologia.geojson",
      jsFile: "./data/pedologia.js",
      geomType: "polygon",
      active: false,
      count: 32,
      thematic: true,
      multiColorGradient: "linear-gradient(135deg, #009696, #FF5500, #FF6600, #64748b)",
      classify: {
        field: "legenda_2",
        categories: {
          "GLEISSOLO HÁPLICO": {
            label: "Gleissolos (Ciano escuro) — #009696",
            color: "#006666",
            fillColor: "#009696",
            fillOpacity: 0.7,
            weight: 1.2
          },
          "GLEISSOLO": {
            label: "Gleissolos (Ciano escuro) — #009696",
            color: "#006666",
            fillColor: "#009696",
            fillOpacity: 0.7,
            weight: 1.2
          },
          "LATOSSOLO VERMELHO-AMARELO": {
            label: "Latossolo Vermelho-Amarelo (LVA) — #FF5500",
            color: "#cc4400",
            fillColor: "#FF5500",
            fillOpacity: 0.7,
            weight: 1.2
          },
          "LATOSSOLO": {
            label: "Latossolo Vermelho-Amarelo (LVA) — #FF5500",
            color: "#cc4400",
            fillColor: "#FF5500",
            fillOpacity: 0.7,
            weight: 1.2
          },
          "LATOSSOLO AMARELO": {
            label: "Latossolo Amarelo — #FF7700",
            color: "#cc5200",
            fillColor: "#FF7700",
            fillOpacity: 0.7,
            weight: 1.2
          },
          "ARGISSOLO VERMELHO-AMARELO": {
            label: "Argissolo Vermelho-Amarelo — #FF6600",
            color: "#cc5200",
            fillColor: "#FF6600",
            fillOpacity: 0.7,
            weight: 1.2
          },
          "ARGISSOLO": {
            label: "Argissolo Vermelho-Amarelo — #FF6600",
            color: "#cc5200",
            fillColor: "#FF6600",
            fillOpacity: 0.7,
            weight: 1.2
          },
          "ARGISSOLO VERMELHO": {
            label: "Argissolo Vermelho — #E65100",
            color: "#b33c00",
            fillColor: "#E65100",
            fillOpacity: 0.7,
            weight: 1.2
          },
          "AFLORAMENTO": {
            label: "Afloramentos Rochosos",
            color: "#334155",
            fillColor: "#64748b",
            fillOpacity: 0.6,
            weight: 1.2
          },
          "AFLORAMENTOS DE ROCHAS": {
            label: "Afloramentos Rochosos",
            color: "#334155",
            fillColor: "#64748b",
            fillOpacity: 0.6,
            weight: 1.2
          },
          "ÁREA URBANA": {
            label: "Área Urbana",
            color: "#475569",
            fillColor: "#94a3b8",
            fillOpacity: 0.6,
            weight: 1.2
          }
        },
        default: {
          color: "#cc5200",
          fillColor: "#FF6600",
          fillOpacity: 0.6,
          weight: 1.2
        }
      },
      style: {
        color: "#cc5200",
        weight: 1.2,
        opacity: 0.85,
        fillColor: "#FF6600",
        fillOpacity: 0.7
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Gleissolos — RGB(0, 150, 150) / #009696", color: "#006666", fillColor: "#009696" },
          { label: "Latossolo Vermelho-Amarelo (LVA) — RGB(255, 85, 0) / #FF5500", color: "#cc4400", fillColor: "#FF5500" },
          { label: "Argissolo Vermelho-Amarelo — RGB(255, 102, 0) / #FF6600", color: "#cc5200", fillColor: "#FF6600" },
          { label: "Afloramentos de Rochas / Outros", color: "#334155", fillColor: "#64748b" }
        ]
      },
      popupTitle: "Classe de Solo",
      titleField: "ordem",
      fields: [
        { key: "ordem", label: "Ordem Pedológica (SiBCS)" },
        { key: "subordem", label: "Subordem" },
        { key: "grande_gru", label: "Grande Grupo" },
        { key: "legenda", label: "Legenda Completa" },
        { key: "textura", label: "Textura" },
        { key: "relevo", label: "Relevo Associado" },
        { key: "ar_poli_km", label: "Área (km²)", format: v => (v ? Number(v).toFixed(2) + " km²" : "-") }
      ]
    },
    {
      id: "acidentes_geograficos",
      title: "Acidentes Geográficos Notáveis (Serras e Morros)",
      category: "geologia",
      source: "INDE",
      subsource: "DSG Exército / BRADAR / IBGE",
      url: "./data/acidentes_geograficos.geojson",
      jsFile: "./data/acidentes_geograficos.js",
      geomType: "point",
      active: false,
      count: 4,
      pointStyle: {
        icon: "fa-mountain",
        markerColor: "#78350f",
        iconColor: "#ffffff",
        radius: 8
      },
      legend: {
        type: "point",
        items: [
          { label: "Serras e Morros Notáveis", color: "#78350f", icon: "fa-mountain" }
        ]
      },
      popupTitle: "Acidente Geográfico",
      titleField: "NOME",
      fields: [
        { key: "NOME", label: "Denominação" },
        { key: "TIPO", label: "Tipo (Serra/Morro)" },
        { key: "MUN", label: "Município" },
        { key: "FONTE", label: "Fonte Cartográfica" }
      ]
    },
    {
      id: "risco_geologico",
      title: "Setores de Risco Geológico (CPRM - Setorização 1)",
      category: "geologia",
      source: "INDE",
      subsource: "CPRM - Serviço Geológico do Brasil / Defesa Civil",
      url: "./data/risco_geologico.geojson",
      jsFile: "./data/risco_geologico.js",
      geomType: "polygon",
      active: false,
      count: 13,
      thematic: true,
      multiColorGradient: "linear-gradient(135deg, #dc2626, #ea580c)",
      classify: {
        field: "grau_risco",
        categories: {
          "Muito alto": {
            label: "Risco Muito Alto (R4 - Crítico)",
            color: "#7f1d1d",
            fillColor: "#dc2626",
            fillOpacity: 0.65,
            weight: 2
          },
          "Muito Alto": {
            label: "Risco Muito Alto (R4 - Crítico)",
            color: "#7f1d1d",
            fillColor: "#dc2626",
            fillOpacity: 0.65,
            weight: 2
          },
          "Alto": {
            label: "Risco Alto (R3 - Alerta)",
            color: "#9a3412",
            fillColor: "#ea580c",
            fillOpacity: 0.6,
            weight: 2
          }
        },
        default: {
          color: "#b91c1c",
          fillColor: "#ef4444",
          fillOpacity: 0.6,
          weight: 2
        }
      },
      style: {
        color: "#b91c1c",
        weight: 2,
        opacity: 0.95,
        fillColor: "#dc2626",
        fillOpacity: 0.6
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Risco Muito Alto (R4 - Crítico / Emergência)", color: "#7f1d1d", fillColor: "#dc2626" },
          { label: "Risco Alto (R3 - Alerta Geotécnico)", color: "#9a3412", fillColor: "#ea580c" }
        ]
      },
      popupTitle: "Setor de Risco Geológico",
      titleField: "local",
      fields: [
        { key: "local", label: "Bairro / Localidade" },
        { key: "grau_risco", label: "Grau de Risco (CPRM)" },
        { key: "tipolo_g1", label: "Tipologia Principal" },
        { key: "tipolo_e1", label: "Tipologia Específica" },
        { key: "num_pess", label: "Pessoas em Risco Estimadas" },
        { key: "num_edif", label: "Edificações Afetadas" },
        { key: "descricao", label: "Diagnóstico Geotécnico" },
        { key: "sug_interv", label: "Intervenção Recomendada" }
      ]
    },
    {
      id: "risco_geologico2",
      title: "Áreas de Risco de Deslizamento e Enxurrada (CPRM - Setorização 2)",
      category: "geologia",
      source: "INDE",
      subsource: "CPRM - Serviço Geológico do Brasil",
      url: "./data/risco_geologico2.geojson",
      jsFile: "./data/risco_geologico2.js",
      geomType: "polygon",
      active: false,
      count: 12,
      thematic: true,
      multiColorGradient: "linear-gradient(135deg, #dc2626, #ea580c)",
      classify: {
        field: "GRAU_RISCO",
        categories: {
          "Muito Alto": {
            label: "Risco Muito Alto (R4)",
            color: "#7f1d1d",
            fillColor: "#dc2626",
            fillOpacity: 0.65,
            weight: 2
          },
          "Alto": {
            label: "Risco Alto (R3)",
            color: "#9a3412",
            fillColor: "#ea580c",
            fillOpacity: 0.6,
            weight: 2
          }
        },
        default: {
          color: "#c2410c",
          fillColor: "#f97316",
          fillOpacity: 0.6,
          weight: 2
        }
      },
      style: {
        color: "#c2410c",
        weight: 2,
        opacity: 0.95,
        fillColor: "#ea580c",
        fillOpacity: 0.6
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Risco Muito Alto (Deslizamento / Enxurrada)", color: "#7f1d1d", fillColor: "#dc2626" },
          { label: "Risco Alto (Processos Erosivos / Encostas)", color: "#9a3412", fillColor: "#ea580c" }
        ]
      },
      popupTitle: "Área de Risco",
      titleField: "LOCAL",
      fields: [
        { key: "LOCAL", label: "Localidade" },
        { key: "GRAU_RISCO", label: "Grau de Risco" },
        { key: "TIPOLOGIA", label: "Tipologia do Processo" },
        { key: "NUM_MORAD", label: "Moradias em Risco" },
        { key: "NUM_PESS", label: "População Estimada" },
        { key: "DESCRICAO", label: "Descrição do Cenário" },
        { key: "SUG_INTERV", label: "Sugestão de Intervenção" }
      ]
    },

    // -------------------------------------------------------------------------
    // 4. INFRAESTRUTURA, TRANSPORTE & MOBILIDADE
    // -------------------------------------------------------------------------
    {
      id: "rodovias_federais",
      title: "Rodovias Federais (BR-116, BR-418, etc.)",
      category: "infra",
      source: "INDE",
      subsource: "DNIT - Sistema Nacional de Viação (SNV)",
      url: "./data/rodovias_federais.geojson",
      jsFile: "./data/rodovias_federais.js",
      geomType: "line",
      active: false,
      count: 12,
      style: {
        color: "#dc2626",
        weight: 3.5,
        opacity: 0.95
      },
      legend: {
        type: "line",
        items: [
          { label: "Malha Rodoviária Federal (DNIT)", color: "#dc2626", weight: 3 }
        ]
      },
      popupTitle: "Rodovia Federal",
      titleField: "vl_br",
      fields: [
        { key: "vl_br", label: "Rodovia BR", format: v => "BR-" + v },
        { key: "ds_jurisdi", label: "Jurisdição" },
        { key: "ds_superfi", label: "Pavimentação" },
        { key: "vl_extensa", label: "Extensão no Trecho (km)", format: v => (v ? Number(v).toFixed(1) + " km" : "-") },
        { key: "ds_local_i", label: "Início do Trecho" },
        { key: "ds_local_f", label: "Fim do Trecho" }
      ]
    },
    {
      id: "rodovias_estaduais",
      title: "Rodovias Estaduais (MG-217, etc.)",
      category: "infra",
      source: "SISEMA",
      subsource: "DER-MG / IDE-SISEMA",
      url: "./data/rodovias_estaduais.geojson",
      jsFile: "./data/rodovias_estaduais.js",
      geomType: "line",
      active: false,
      count: 16,
      style: {
        color: "#f97316",
        weight: 2.8,
        opacity: 0.95
      },
      legend: {
        type: "line",
        items: [
          { label: "Malha Rodoviária Estadual (DER-MG)", color: "#f97316", weight: 3 }
        ]
      },
      popupTitle: "Rodovia Estadual",
      titleField: "codigo_rod",
      fields: [
        { key: "codigo_rod", label: "Rodovia MG", format: v => "MG-" + v },
        { key: "tipo_trech", label: "Tipo do Trecho" },
        { key: "superficie", label: "Pavimentação" },
        { key: "extensao", label: "Extensão (km)", format: v => (v ? Number(v).toFixed(1) + " km" : "-") },
        { key: "local_inic", label: "Origem" },
        { key: "local_fim", label: "Destino" }
      ]
    },
    {
      id: "logradouros_estradas_vicinais",
      title: "Malha Viária Urbana e Estradas Vicinais",
      category: "infra",
      source: "PMTO",
      subsource: "Prefeitura Municipal / OSM",
      url: "./data/logradouros_estradas_vicinais.geojson",
      jsFile: "./data/logradouros_estradas_vicinais.js",
      geomType: "line",
      active: false,
      count: 4249,
      style: {
        color: "#64748b",
        weight: 1.4,
        opacity: 0.75
      },
      legend: {
        type: "line",
        items: [
          { label: "Vias Urbanas e Estradas Rurais", color: "#64748b", weight: 1.5 }
        ]
      },
      popupTitle: "Via / Estrada Vicinal",
      titleField: "name",
      fields: [
        { key: "name", label: "Nome da Via", format: v => v || "Sem nome cadastrado" },
        { key: "highway", label: "Classificação Viária" },
        { key: "oneway", label: "Mão Única" }
      ]
    },
    {
      id: "deslocamentos",
      title: "Deslocamentos Pendulares de Trabalho e Estudo",
      category: "infra",
      source: "INDE",
      subsource: "IBGE - Arranjos Populacionais",
      url: "./data/deslocamentos.geojson",
      jsFile: "./data/deslocamentos.js",
      geomType: "line",
      active: false,
      count: 59,
      style: {
        color: "#8b5cf6",
        weight: 2.2,
        opacity: 0.85,
        dashArray: "3, 6"
      },
      legend: {
        type: "line",
        items: [
          { label: "Fluxos Pendulares Intermunicipais", color: "#8b5cf6", weight: 2 }
        ]
      },
      popupTitle: "Vetor de Deslocamento",
      titleField: "NomeMunDes",
      fields: [
        { key: "NomeMunOri", label: "Município de Origem" },
        { key: "NomeMunDes", label: "Município de Destino" },
        { key: "TotalPes_1", label: "Pessoas que se Deslocam" },
        { key: "PercPessTr", label: "% Motivo Trabalho" },
        { key: "PercPess_1", label: "% Motivo Estudo" }
      ]
    },
    {
      id: "tracado_efbm",
      title: "Estrada de Ferro Bahia e Minas (EFBM) - Rede Completa",
      category: "patrimonio_cultural",
      source: "IFNMG",
      subsource: "Pesquisa Acadêmica Prof. Sérgio Lana (IFNMG)",
      url: "./data/tracado_efbm.geojson",
      jsFile: "./data/tracado_efbm.js",
      geomType: "line",
      active: false,
      count: 3,
      thematic: true,
      multiColorGradient: "linear-gradient(135deg, #b91c1c, #ea580c)",
      classify: {
        field: "Name",
        categories: {
          "EFBM - Linha Tronco": {
            label: "EFBM - Linha Tronco (Linha Principal Histórica)",
            color: "#b91c1c",
            weight: 4.5,
            opacity: 1,
            dashArray: "12, 6"
          },
          "Ramal de Caravelas": {
            label: "Ramal de Caravelas (Acesso Portuário)",
            color: "#ea580c",
            weight: 3.5,
            opacity: 1,
            dashArray: "8, 5"
          },
          "Ramal de Caravelas trevo": {
            label: "Ramal de Caravelas (Trevo de Manobra)",
            color: "#ea580c",
            weight: 3.5,
            opacity: 1,
            dashArray: "8, 5"
          }
        },
        default: {
          color: "#b91c1c",
          weight: 4,
          opacity: 1,
          dashArray: "10, 5"
        }
      },
      style: {
        color: "#b91c1c",
        weight: 4,
        opacity: 1,
        dashArray: "12, 6"
      },
      legend: {
        type: "line",
        items: [
          { label: "EFBM - Linha Tronco (Linha Principal Histórica)", color: "#b91c1c", weight: 4, dash: true },
          { label: "Ramal de Caravelas (Trevo e Acesso ao Porto)", color: "#ea580c", weight: 3, dash: true }
        ]
      },
      popupTitle: "Patrimônio Histórico Ferroviário",
      titleField: "Name",
      fields: [
        { key: "Name", label: "Linha / Ramal Ferroviário" },
        { key: "FolderPath", label: "Traçado Original" },
        { key: "Shape_Length", label: "Extensão Histórica", format: v => (v ? Number(v).toFixed(2) + " graus geom." : "-") }
      ]
    },
    {
      id: "trecho_ferroviario_efbm",
      title: "EFBM - Trecho Histórico Detalhado em Teófilo Otoni",
      category: "patrimonio_cultural",
      source: "IFNMG",
      subsource: "Pesquisa Acadêmica Prof. Sérgio Lana (IFNMG)",
      url: "./data/trecho_ferroviario_efbm.geojson",
      jsFile: "./data/trecho_ferroviario_efbm.js",
      geomType: "line",
      active: false,
      count: 1,
      style: {
        color: "#b91c1c",
        weight: 5,
        opacity: 1,
        dashArray: "10, 6"
      },
      legend: {
        type: "line",
        items: [
          { label: "Linha Tronco da EFBM em Teófilo Otoni (Traçado Urbano)", color: "#b91c1c", weight: 5, dash: true }
        ]
      },
      popupTitle: "EFBM - Estrada de Ferro Bahia e Minas",
      titleField: "Name",
      fields: [
        { key: "Name", label: "Linha" },
        { key: "id", label: "Identificador" },
        { key: "description", label: "Descrição Histórica", format: v => "Linha Tronco da histórica ferrovia Bahia e Minas, ligando o Vale do Mucuri ao litoral baiano (Caravelas), elemento estruturador da paisagem regional." }
      ]
    },
    {
      id: "efbm_margem_linha",
      title: "EFBM - Margem da Linha Férrea",
      category: "patrimonio_cultural",
      source: "IFNMG",
      subsource: "IFNMG - Campus Teófilo Otoni (Prof. Sérgio Lana)",
      url: "./data/efbm_margem_linha.geojson",
      jsFile: "./data/efbm_margem_linha.js",
      geomType: "polygon",
      active: false,
      count: 1,
      style: {
        color: "#78350f",
        weight: 2,
        opacity: 0.95,
        fillColor: "#92400e",
        fillOpacity: 0.35
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Área da Margem da Linha Tronco EFBM", color: "#78350f", fillColor: "#92400e" }
        ]
      },
      popupTitle: "EFBM - Margem da Linha",
      titleField: "Name",
      fields: [
        { key: "Name", label: "Denominação" },
        { key: "FolderPath", label: "Trajeto Associado" }
      ]
    },
    {
      id: "efbm_morro_feijao_bebido",
      title: "EFBM - Morro do Feijão Bebido",
      category: "patrimonio_cultural",
      source: "IFNMG",
      subsource: "IFNMG - Campus Teófilo Otoni (Prof. Sérgio Lana)",
      url: "./data/efbm_morro_feijao_bebido.geojson",
      jsFile: "./data/efbm_morro_feijao_bebido.js",
      geomType: "polygon",
      active: false,
      count: 1,
      style: {
        color: "#9a3412",
        weight: 2,
        opacity: 0.95,
        fillColor: "#ea580c",
        fillOpacity: 0.35
      },
      legend: {
        type: "polygon",
        items: [
          { label: "Polígono do Morro do Feijão Bebido", color: "#9a3412", fillColor: "#ea580c" }
        ]
      },
      popupTitle: "EFBM - Morro do Feijão Bebido",
      titleField: "Id",
      fields: [
        { key: "Id", label: "Identificador Cartográfico" }
      ]
    },
    {
      id: "efbm_patrimonios",
      title: "EFBM - Acervo e Patrimônios Ferroviários",
      category: "patrimonio_cultural",
      source: "IFNMG",
      subsource: "IFNMG - Campus Teófilo Otoni (Prof. Sérgio Lana)",
      url: "./data/efbm_patrimonios.geojson",
      jsFile: "./data/efbm_patrimonios.js",
      geomType: "point",
      active: false,
      count: 19,
      pointStyle: {
        icon: "fa-monument",
        markerColor: "#9a3412",
        iconColor: "#ffffff",
        radius: 7
      },
      legend: {
        type: "point",
        items: [
          { label: "Pontos de Patrimônio da EFBM", color: "#9a3412", icon: "fa-monument" }
        ]
      },
      popupTitle: "Patrimônio Ferroviário EFBM",
      titleField: "NOME",
      fields: [
        { key: "NOME", label: "Nome do Patrimônio" },
        { key: "ID", label: "Código de Registro" },
        { key: "X", label: "Longitude (UTM/Dec)" },
        { key: "Y", label: "Latitude (UTM/Dec)" }
      ]
    },
    {
      id: "estacoes_ferroviarias",
      title: "Estações Ferroviárias da EFBM",
      category: "patrimonio_cultural",
      source: "IFNMG",
      subsource: "IFNMG - Campus Teófilo Otoni (Prof. Sérgio Lana)",
      url: "./data/estacoes_ferroviarias.geojson",
      jsFile: "./data/estacoes_ferroviarias.js",
      geomType: "point",
      active: false,
      count: 8,
      pointStyle: {
        icon: "fa-train-subway",
        markerColor: "#c2410c",
        iconColor: "#ffffff",
        radius: 8
      },
      legend: {
        type: "point",
        items: [
          { label: "Estações Ferroviárias Históricas", color: "#c2410c", icon: "fa-train-subway" }
        ]
      },
      popupTitle: "Estação Ferroviária",
      titleField: "Name",
      fields: [
        { key: "Name", label: "Nome da Estação" },
        { key: "Snippet", label: "Descrição / Histórico" },
        { key: "FolderPath", label: "Ramal Ferroviário" }
      ]
    },
    {
      id: "postos_combustiveis",
      title: "Postos de Abastecimento e Combustíveis",
      category: "infra",
      source: "PMTO",
      subsource: "ANP / Cadastro da Prefeitura de Teófilo Otoni",
      url: "./data/postos_combustiveis.geojson",
      jsFile: "./data/postos_combustiveis.js",
      geomType: "point",
      active: false,
      count: 35,
      pointStyle: {
        icon: "fa-gas-pump",
        markerColor: "#d97706",
        iconColor: "#ffffff",
        radius: 7
      },
      legend: {
        type: "point",
        items: [
          { label: "Postos de Combustíveis em Operação", color: "#d97706", icon: "fa-gas-pump" }
        ]
      },
      popupTitle: "Posto de Combustíveis",
      titleField: "Nome",
      fields: [
        { key: "Nome", label: "Nome Fantasia" },
        { key: "Razao_Soci", label: "Razão Social" },
        { key: "Telefone", label: "Telefone" },
        { key: "E_mail", label: "E-mail de Contato" }
      ]
    },

    // -------------------------------------------------------------------------
    // 5. EQUIPAMENTOS PÚBLICOS & SERVIÇOS
    // -------------------------------------------------------------------------
    {
      id: "escolas",
      title: "Escolas e Institutos de Ensino (IFNMG, Estaduais, Municipais)",
      category: "social",
      source: "INDE",
      subsource: "INEP / Censo Escolar MEC / INDE",
      url: "./data/escolas.geojson",
      jsFile: "./data/escolas.js",
      geomType: "point",
      active: false,
      count: 133,
      cluster: true,
      pointStyle: {
        icon: "fa-graduation-cap",
        markerColor: "#2563eb",
        iconColor: "#ffffff",
        radius: 7
      },
      legend: {
        type: "point",
        items: [
          { label: "Escolas e Institutos (Inclui IFNMG)", color: "#2563eb", icon: "fa-graduation-cap" }
        ]
      },
      popupTitle: "Instituição de Ensino",
      titleField: "name_school",
      fields: [
        { key: "name_school", label: "Nome da Escola" },
        { key: "government_level", label: "Esfera Administrativa" },
        { key: "education_level", label: "Etapas de Ensino" },
        { key: "urban", label: "Localização (Urbana/Rural)" },
        { key: "address", label: "Endereço" },
        { key: "phone_number", label: "Telefone" },
        { key: "size", label: "Porte de Alunos" }
      ]
    },
    {
      id: "estabelecimentos_saude",
      title: "Estabelecimentos e Unidades de Saúde (CNES)",
      category: "social",
      source: "INDE",
      subsource: "Ministério da Saúde - CNES / DATASUS / INDE",
      url: "./data/estabelecimentos_saude.geojson",
      jsFile: "./data/estabelecimentos_saude.js",
      geomType: "point",
      active: false,
      count: 538,
      cluster: true,
      pointStyle: {
        icon: "fa-heart-pulse",
        markerColor: "#e11d48",
        iconColor: "#ffffff",
        radius: 6
      },
      legend: {
        type: "point",
        items: [
          { label: "Unidades Básicas e Clínicas (CNES)", color: "#e11d48", icon: "fa-heart-pulse" }
        ]
      },
      popupTitle: "Unidade de Saúde",
      titleField: "no_fantasia",
      fields: [
        { key: "no_fantasia", label: "Nome Fantasia" },
        { key: "no_razao_social", label: "Razão Social" },
        { key: "ds_natureza_organizacao", label: "Natureza Organizacional" },
        { key: "ds_turno_atendimento", label: "Turno de Atendimento" },
        { key: "no_bairro", label: "Bairro" },
        { key: "no_logradouro", label: "Endereço" },
        { key: "nu_telefone", label: "Telefone" }
      ]
    },
    {
      id: "bens_tombados",
      title: "Bens Culturais Tombados e Patrimônio Histórico",
      category: "patrimonio_cultural",
      source: "INDE",
      subsource: "IPHAN - Instituto do Patrimônio Histórico e Artístico Nacional",
      url: "./data/bens_tombados.geojson",
      jsFile: "./data/bens_tombados.js",
      geomType: "point",
      active: false,
      count: 3,
      pointStyle: {
        icon: "fa-landmark-dome",
        markerColor: "#b45309",
        iconColor: "#ffffff",
        radius: 8
      },
      legend: {
        type: "point",
        items: [
          { label: "Bens Culturais Tombados (IPHAN)", color: "#b45309", icon: "fa-landmark-dome" }
        ]
      },
      popupTitle: "Bem Cultural Tombado",
      titleField: "identifica",
      fields: [
        { key: "identifica", label: "Nome do Bem / Patrimônio" },
        { key: "ds_naturez", label: "Natureza do Bem" },
        { key: "no_logrado", label: "Logradouro / Local" },
        { key: "co_iphan", label: "Código de Registro IPHAN" }
      ]
    },
    {
      id: "hospitais_sus",
      title: "Hospitais Gerais e Especializados (SUS / CNES)",
      category: "social",
      source: "INDE",
      subsource: "Ministério da Saúde - CNES / DATASUS",
      url: "./data/hospitais_sus.geojson",
      jsFile: "./data/hospitais_sus.js",
      geomType: "point",
      active: false,
      count: 7,
      pointStyle: {
        icon: "fa-hospital",
        markerColor: "#dc2626",
        iconColor: "#ffffff",
        radius: 8
      },
      legend: {
        type: "point",
        items: [
          { label: "Hospitais da Rede SUS (Gerais e Regionais)", color: "#dc2626", icon: "fa-hospital" }
        ]
      },
      popupTitle: "Hospital da Rede SUS",
      titleField: "Nome Fanta",
      fields: [
        { key: "Nome Fanta", label: "Nome do Hospital" },
        { key: "Natureza J", label: "Natureza Jurídica" },
        { key: "Tipo de Un", label: "Tipo de Unidade" },
        { key: "CNES", label: "Código CNES" }
      ]
    },
    {
      id: "unidades_basicas_saude",
      title: "Unidades Básicas de Saúde (UBS / ESF / PSF)",
      category: "social",
      source: "PMTO",
      subsource: "Secretaria Municipal de Saúde / CNES",
      url: "./data/unidades_basicas_saude.geojson",
      jsFile: "./data/unidades_basicas_saude.js",
      geomType: "point",
      active: false,
      count: 44,
      pointStyle: {
        icon: "fa-kit-medical",
        markerColor: "#059669",
        iconColor: "#ffffff",
        radius: 7
      },
      legend: {
        type: "point",
        items: [
          { label: "Unidades Básicas de Saúde (UBS/ESF)", color: "#059669", icon: "fa-kit-medical" }
        ]
      },
      popupTitle: "Unidade Básica de Saúde",
      titleField: "no_fantasi",
      fields: [
        { key: "no_fantasi", label: "Nome da UBS / ESF" },
        { key: "no_razao_s", label: "Razão Social Gestora" },
        { key: "co_cnes", label: "Código CNES" }
      ]
    }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = GEOPORTAL_CONFIG;
}
