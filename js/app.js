/**
 * GEOPORTAL MUNICIPAL DE TEÓFILO OTONI - MG
 * Aplicação Principal WebGIS (JavaScript Vanilla Modular)
 * 
 * Concepção e Elaboração: Prof. Sérgio Lana - Doutor em Geografia
 * Instituição: Instituto Federal do Norte de Minas Gerais (IFNMG) - Campus Teófilo Otoni
 * Currículo Lattes: http://lattes.cnpq.br/2773267607623633
 * Fontes Oficiais: INDE, IDE-SISEMA (MG), IFNMG, Prefeitura Municipal de Teófilo Otoni
 */

document.addEventListener("DOMContentLoaded", () => {
  window.GeoportalApp = new Geoportal();
});

class Geoportal {
  constructor() {
    this.config = GEOPORTAL_CONFIG;
    this.map = null;
    this.baseLayers = {};
    this.currentBaseLayer = null;
    
    // Armazenamento de instâncias das camadas Leaflet
    this.mapLayers = {};          // id -> L.GeoJSON / L.MarkerClusterGroup
    this.customLayers = [];       // Camadas importadas pelo usuário
    this.highlightLayer = null;   // Camada de destaque temporário

    // Estado das ferramentas de medição e colaboração
    this.measureMode = null;      // null | 'distance' | 'area'
    this.measurePoints = [];
    this.measureLayer = null;

    this.isCollabMode = false;
    this.collabTempLatLng = null;
    this.collabLayer = null;
    this.collabReports = [];

    this.initMap();
    this.initBasemaps();
    this.initSidebarCatalog();
    this.initSearch();
    this.initToolbar();
    this.initModals();
    this.initCoordinatesHud();
    this.initGeocollaboration();
    this.initGeojsonImporter();
    this.loadInitialLayers();
  }

  /* ------------------------------------------------------------------------
     1. INICIALIZAÇÃO DO MAPA E CONTROLES
     ------------------------------------------------------------------------ */
  initMap() {
    const { bounds, initialZoom } = this.config.municipality;

    this.map = L.map("map", {
      center: this.config.municipality.center,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: true
    });

    // Enquadra os limites do município de Teófilo Otoni
    this.map.fitBounds(bounds, { padding: [25, 25] });

    // Controle de Zoom no canto superior esquerdo
    L.control.zoom({ position: "topleft" }).addTo(this.map);

    // Controle de Escala métrica no canto inferior esquerdo
    L.control.scale({
      position: "bottomleft",
      metric: true,
      imperial: false,
      maxWidth: 150
    }).addTo(this.map);

    // Camada para medições
    this.measureLayer = L.layerGroup().addTo(this.map);
  }

  /* ------------------------------------------------------------------------
     2. MAPAS BASE (BASEMAPS): APENAS SATÉLITE E TOPOGRÁFICO (OSM REMOVIDO)
     ------------------------------------------------------------------------ */
  initBasemaps() {
    // 1. Imagens de Satélite (Esri World Imagery de alta resolução com rótulos híbridos de vias)
    const satelliteTiles = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: 'Imagens &copy; Esri, Maxar, Earthstar Geographics'
    });
    const satelliteLabels = L.tileLayer("https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19
    });
    const satellite = L.layerGroup([satelliteTiles, satelliteLabels]);

    // 2. Mapa Topográfico / Relevo (OpenTopoMap com curvas de nível e sombreamento montanhoso)
    const topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      subdomains: ["a", "b", "c"],
      attribution: 'Relevo &copy; <a href="https://opentopomap.org" target="_blank">OpenTopoMap</a>'
    });

    this.baseLayers = {
      satellite: satellite,
      topo: topo
    };

    // Imagens de Satélite ativa por padrão!
    this.currentBaseLayer = satellite;
    this.currentBaseLayer.addTo(this.map);

    // Adiciona o Seletor no canto inferior direito conforme solicitado
    const baseMapLabels = {
      '<span class="basemap-pill-label"><i class="fa fa-satellite" style="color: #2563eb;"></i> Imagens de Satélite</span>': satellite,
      '<span class="basemap-pill-label"><i class="fa fa-mountain" style="color: #d97706;"></i> Mapa Topográfico</span>': topo
    };
    L.control.layers(baseMapLabels, null, {
      position: "bottomright",
      collapsed: false
    }).addTo(this.map);

    // Painel customizado de basemaps
    const basemapBtn = document.getElementById("toggle-basemaps-btn");
    const basemapPanel = document.getElementById("basemap-panel");

    if (basemapBtn && basemapPanel) {
      basemapBtn.addEventListener("click", () => {
        basemapPanel.classList.toggle("open");
      });

      document.addEventListener("click", (e) => {
        if (!basemapPanel.contains(e.target) && !basemapBtn.contains(e.target)) {
          basemapPanel.classList.remove("open");
        }
      });
    }

    document.querySelectorAll(".basemap-option").forEach((el) => {
      el.addEventListener("click", () => {
        const key = el.dataset.basemap;
        if (this.baseLayers[key]) {
          this.map.removeLayer(this.currentBaseLayer);
          this.currentBaseLayer = this.baseLayers[key];
          this.currentBaseLayer.addTo(this.map);

          document.querySelectorAll(".basemap-option").forEach((opt) => opt.classList.remove("active"));
          el.classList.add("active");
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. CARREGAMENTO RESILIENTE DE DADOS GEOESPACIAIS (FILE:// E HTTP)
     ------------------------------------------------------------------------ */
  async getLayerData(layerConf) {
    const id = layerConf.id;
    window.GEOPORTAL_LAYERS_DATA = window.GEOPORTAL_LAYERS_DATA || {};

    // 1. Já está em memória?
    if (window.GEOPORTAL_LAYERS_DATA[id]) {
      return window.GEOPORTAL_LAYERS_DATA[id];
    }

    // 2. Se rodando via HTTP/HTTPS, tenta fetch do GeoJSON
    if (window.location.protocol.indexOf("http") === 0) {
      try {
        const response = await fetch(layerConf.url);
        if (response.ok) {
          const geojson = await response.json();
          window.GEOPORTAL_LAYERS_DATA[id] = geojson;
          return geojson;
        }
      } catch (e) {
        console.warn(`Fetch falhou para ${id}, utilizando fallback de script:`, e);
      }
    }

    // 3. Fallback de injeção de script (funciona 100% no protocolo file:///)
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `./data/${id}.js`;
      script.async = true;

      script.onload = () => {
        if (window.GEOPORTAL_LAYERS_DATA && window.GEOPORTAL_LAYERS_DATA[id]) {
          resolve(window.GEOPORTAL_LAYERS_DATA[id]);
        } else {
          reject(new Error(`Camada ${id} não encontrada no arquivo JS.`));
        }
      };

      script.onerror = () => {
        reject(new Error(`Falha ao carregar arquivo de dados da camada ${id}.`));
      };

      document.head.appendChild(script);
    });
  }

  /* ------------------------------------------------------------------------
     4. RENDERIZAÇÃO DO CATÁLOGO DE CAMADAS NA SIDEBAR (COM LEGENDA DINÂMICA)
     ------------------------------------------------------------------------ */
  initSidebarCatalog() {
    const container = document.getElementById("layer-catalog-container");
    if (!container) return;

    container.innerHTML = "";

    this.config.categories.forEach((cat) => {
      const catLayers = this.config.layers.filter((l) => l.category === cat.id);
      if (catLayers.length === 0) return;

      const groupEl = document.createElement("div");
      groupEl.className = "category-group open";
      groupEl.id = `cat-group-${cat.id}`;

      const headerEl = document.createElement("div");
      headerEl.className = "category-header";
      headerEl.innerHTML = `
        <div class="category-title">
          <i class="fa ${cat.icon}"></i>
          <span>${cat.title}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="category-badge-count">${catLayers.length}</span>
          <i class="fa fa-chevron-down category-toggle-icon"></i>
        </div>
      `;

      headerEl.addEventListener("click", () => {
        groupEl.classList.toggle("open");
      });

      const bodyEl = document.createElement("div");
      bodyEl.className = "category-body";

      catLayers.forEach((layer) => {
        const layerItem = this.createLayerItemElement(layer);
        bodyEl.appendChild(layerItem);
      });

      groupEl.appendChild(headerEl);
      groupEl.appendChild(bodyEl);
      container.appendChild(groupEl);
    });

    // Toggle da Sidebar (Desktop e Mobile)
    const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("mobile-backdrop");

    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("open-mobile");
        sidebar.classList.remove("collapsed");
        if (backdrop) {
          backdrop.classList.toggle("active", isOpen);
        }
        setTimeout(() => this.map.invalidateSize(), 320);
      });
    }

    if (toggleSidebarBtn && sidebar) {
      toggleSidebarBtn.addEventListener("click", () => {
        const isCollapsed = sidebar.classList.toggle("collapsed");
        const isOpenMobile = sidebar.classList.toggle("open-mobile", !isCollapsed);
        const icon = toggleSidebarBtn.querySelector("i");
        if (icon) {
          icon.className = isCollapsed ? "fa fa-chevron-right" : "fa fa-chevron-left";
        }
        if (backdrop) {
          backdrop.classList.toggle("active", isOpenMobile && window.innerWidth <= 900);
        }
        setTimeout(() => this.map.invalidateSize(), 320);
      });
    }

    if (backdrop && sidebar) {
      backdrop.addEventListener("click", () => {
        sidebar.classList.add("collapsed");
        sidebar.classList.remove("open-mobile");
        backdrop.classList.remove("active");
        const icon = toggleSidebarBtn?.querySelector("i");
        if (icon) icon.className = "fa fa-chevron-right";
        setTimeout(() => this.map.invalidateSize(), 320);
      });
    }

    // Botão para Expandir / Recolher Todas as Categorias
    const btnToggleAllCats = document.getElementById("btn-toggle-all-cats");
    if (btnToggleAllCats) {
      let allCatsOpen = true;
      btnToggleAllCats.addEventListener("click", () => {
        allCatsOpen = !allCatsOpen;
        document.querySelectorAll(".category-group").forEach((grp) => {
          if (allCatsOpen) grp.classList.add("open");
          else grp.classList.remove("open");
        });
        const icon = btnToggleAllCats.querySelector("i");
        if (icon) {
          icon.className = allCatsOpen ? "fa fa-angles-up" : "fa fa-angles-down";
        }
        btnToggleAllCats.title = allCatsOpen ? "Recolher todas as categorias" : "Expandir todas as categorias";
      });
    }

    // Botão e Evento de Rolagem Suave do Catálogo (Rolar para o fim / topo)
    const btnScroll = document.getElementById("btn-scroll-catalog");
    const catalogContainer = document.getElementById("layer-catalog-container");
    if (btnScroll && catalogContainer) {
      btnScroll.addEventListener("click", () => {
        const isNearBottom = catalogContainer.scrollHeight - catalogContainer.scrollTop - catalogContainer.clientHeight < 60;
        if (isNearBottom) {
          catalogContainer.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          catalogContainer.scrollTo({ top: catalogContainer.scrollHeight, behavior: "smooth" });
        }
      });

      catalogContainer.addEventListener("scroll", () => {
        const isNearBottom = catalogContainer.scrollHeight - catalogContainer.scrollTop - catalogContainer.clientHeight < 60;
        const icon = document.getElementById("btn-scroll-icon");
        const text = document.getElementById("btn-scroll-text");
        if (isNearBottom) {
          if (icon) icon.className = "fa fa-arrow-up";
          if (text) text.textContent = "Rolar ao Topo";
        } else {
          if (icon) icon.className = "fa fa-arrow-down";
          if (text) text.textContent = "Rolar ao Fim";
        }
      });
    }

    // Filtro de pesquisa de camadas
    const filterInput = document.getElementById("layer-filter-input");
    if (filterInput) {
      filterInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll(".layer-item").forEach((item) => {
          const name = item.dataset.layerName.toLowerCase();
          item.style.display = name.includes(query) ? "flex" : "none";
        });
      });
    }

    // Botões no rodapé da Sidebar
    const btnTurnAllOn = document.getElementById("btn-turn-all-on");
    const btnTurnAllOff = document.getElementById("btn-turn-all-off");

    if (btnTurnAllOn) {
      btnTurnAllOn.addEventListener("click", () => {
        this.config.layers.forEach((l) => {
          if (!this.map.hasLayer(this.mapLayers[l.id])) {
            this.setLayerActive(l.id, true);
          }
        });
      });
    }

    if (btnTurnAllOff) {
      btnTurnAllOff.addEventListener("click", () => {
        this.config.layers.forEach((l) => {
          if (l.id !== "limite_municipal") {
            this.setLayerActive(l.id, false);
          }
        });
      });
    }
  }

  createLayerItemElement(layer) {
    const item = document.createElement("div");
    item.className = `layer-item ${layer.active ? "active" : ""}`;
    item.id = `layer-item-${layer.id}`;
    item.dataset.layerId = layer.id;
    item.dataset.layerName = layer.title;

    let colorStyle = "";
    if (layer.multiColorGradient) {
      colorStyle = `background: ${layer.multiColorGradient}; border: 1px solid rgba(0,0,0,0.25);`;
    } else if (layer.style && layer.style.color) {
      colorStyle = `background-color: ${layer.style.fillColor || layer.style.color}; border-color: ${layer.style.color};`;
    } else if (layer.pointStyle) {
      colorStyle = `background-color: ${layer.pointStyle.markerColor}; border-color: #ffffff;`;
    }

    const sourceBadgeClass = `badge-${layer.source}`;

    // Constrói itens da legenda dinâmica
    let legendContentHtml = "";
    if (layer.legend && layer.legend.items) {
      layer.legend.items.forEach(it => {
        if (layer.legend.type === "polygon") {
          const dashStyle = it.dash ? "border-style: dashed;" : "";
          const codeBadge = it.code ? `<span class="legend-item-code">${it.code}</span>` : "";
          legendContentHtml += `
            <div class="legend-item-row">
              <span class="legend-swatch-box" style="background-color: ${it.fillColor}; border-color: ${it.color}; ${dashStyle}"></span>
              ${codeBadge}
              <span class="legend-item-label">${it.label}</span>
            </div>
          `;
        } else if (layer.legend.type === "line") {
          const dashStyle = it.dash ? `border-top: 3px dashed ${it.color}; height: 0; background: none;` : `background-color: ${it.color}; height: 3px;`;
          legendContentHtml += `
            <div class="legend-item-row">
              <span class="legend-line-box" style="${dashStyle}"></span>
              <span class="legend-item-label">${it.label}</span>
            </div>
          `;
        } else if (layer.legend.type === "point") {
          legendContentHtml += `
            <div class="legend-item-row">
              <span class="legend-point-icon" style="color: ${it.color};"><i class="fa ${it.icon}"></i></span>
              <span class="legend-item-label">${it.label}</span>
            </div>
          `;
        }
      });
    } else {
      legendContentHtml = `
        <div class="legend-item-row">
          <span class="legend-swatch-box" style="${colorStyle}"></span>
          <span class="legend-item-label">${layer.title}</span>
        </div>
      `;
    }

    item.innerHTML = `
      <div class="layer-main-row">
        <label class="layer-checkbox-label">
          <input type="checkbox" class="layer-checkbox" id="chk-${layer.id}" ${layer.active ? "checked" : ""}>
          <span class="layer-color-indicator" style="${colorStyle}"></span>
          <span class="layer-name">${layer.title}</span>
        </label>
        <div class="layer-actions">
          <span class="layer-spinner-box" id="spinner-${layer.id}" style="display: none;">
            <span class="layer-spinner"></span>
          </span>
          <button class="layer-tool-btn btn-style" title="Personalizar Simbologia (Cores e Borda)" data-action="style">
            <i class="fa fa-palette"></i>
          </button>
          <button class="layer-tool-btn" title="Ajustar Opacidade" data-action="opacity">
            <i class="fa fa-sliders"></i>
          </button>
          <button class="layer-tool-btn btn-kml" title="Baixar camada em arquivo .KML (Google Earth)" data-action="download-kml">
            <i class="fa fa-file-arrow-down"></i> KML
          </button>
          <button class="layer-tool-btn" title="Enquadrar no Mapa" data-action="zoom">
            <i class="fa fa-crosshairs"></i>
          </button>
        </div>
      </div>
      <div class="layer-meta-row">
        <span class="source-badge ${sourceBadgeClass}" title="${layer.subsource}">${layer.source}</span>
        <span class="feature-count-pill">${layer.count} ${layer.count === 1 ? "feição" : "feições"}</span>
      </div>
      <!-- LEGENDA DINÂMICA (APARECE LOGO ABAIXO QUANDO ATIVADA) -->
      <div class="layer-legend-box" id="legend-box-${layer.id}">
        ${legendContentHtml}
      </div>
      <!-- PERSONALIZAÇÃO DE SIMBOLOGIA PELO USUÁRIO -->
      <div class="layer-style-customizer-box" id="style-box-${layer.id}">
        <div class="style-box-header">
          <span><i class="fa fa-palette" style="color: var(--primary);"></i> Alterar Simbologia</span>
          <button class="style-reset-btn" data-action="reset-style" title="Restaurar estilo original">Restaurar</button>
        </div>
        <div class="style-box-controls">
          ${this.renderStyleCustomizerControls(layer)}
        </div>
      </div>
      <!-- CONTROLE DE OPACIDADE -->
      <div class="layer-opacity-slider-box" id="opacity-box-${layer.id}">
        <span style="font-size: 0.68rem; color: var(--text-muted);"><i class="fa fa-circle-half-stroke"></i></span>
        <input type="range" class="layer-opacity-slider" min="0" max="100" value="100">
        <span class="opacity-value-label">100%</span>
      </div>
    `;

    // Eventos
    const checkbox = item.querySelector(".layer-checkbox");
    checkbox.addEventListener("change", (e) => {
      this.setLayerActive(layer.id, e.target.checked);
    });

    const kmlBtn = item.querySelector('[data-action="download-kml"]');
    kmlBtn.addEventListener("click", () => {
      this.downloadLayerAsKml(layer.id);
    });

    const zoomBtn = item.querySelector('[data-action="zoom"]');
    zoomBtn.addEventListener("click", () => {
      this.zoomToLayer(layer.id);
    });

    const opacityBtn = item.querySelector('[data-action="opacity"]');
    opacityBtn.addEventListener("click", () => {
      item.classList.toggle("show-opacity");
      item.classList.remove("show-style");
    });

    const styleBtn = item.querySelector('[data-action="style"]');
    if (styleBtn) {
      styleBtn.addEventListener("click", () => {
        item.classList.toggle("show-style");
        item.classList.remove("show-opacity");
      });
    }

    const resetStyleBtn = item.querySelector('[data-action="reset-style"]');
    if (resetStyleBtn) {
      resetStyleBtn.addEventListener("click", () => {
        delete layer.userStyle;
        delete layer.userPointStyle;
        this.updateLayerSymbology(layer);
        const controlsContainer = item.querySelector(".style-box-controls");
        if (controlsContainer) {
          controlsContainer.innerHTML = this.renderStyleCustomizerControls(layer);
          this.bindStyleControlEvents(item, layer);
        }
      });
    }

    this.bindStyleControlEvents(item, layer);

    const opacitySlider = item.querySelector(".layer-opacity-slider");
    const opacityLabel = item.querySelector(".opacity-value-label");
    opacitySlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      opacityLabel.textContent = `${val}%`;
      this.setLayerOpacity(layer.id, val / 100);
    });

    return item;
  }

  renderStyleCustomizerControls(layer) {
    if (layer.geomType === "polygon") {
      const fill = layer.userStyle?.fillColor || (layer.style?.fillColor || layer.style?.color || "#0f766e");
      const stroke = layer.userStyle?.color || (layer.style?.color || "#0f766e");
      const weight = layer.userStyle?.weight ?? (layer.style?.weight || 2);
      const opacity = Math.round((layer.userStyle?.fillOpacity ?? (layer.style?.fillOpacity ?? 0.45)) * 100);
      return `
        <div class="style-control-row">
          <label>Preenchimento:</label>
          <input type="color" class="style-input-fill" value="${fill}">
        </div>
        <div class="style-control-row">
          <label>Contorno:</label>
          <input type="color" class="style-input-stroke" value="${stroke}">
        </div>
        <div class="style-control-row">
          <label>Espessura:</label>
          <input type="range" class="style-input-weight" min="1" max="8" value="${weight}">
          <span class="style-val-label weight-label">${weight}px</span>
        </div>
        <div class="style-control-row">
          <label>Opacidade:</label>
          <input type="range" class="style-input-opacity" min="0" max="100" value="${opacity}">
          <span class="style-val-label opacity-label">${opacity}%</span>
        </div>
      `;
    } else if (layer.geomType === "line") {
      const color = layer.userStyle?.color || (layer.style?.color || "#0f766e");
      const weight = layer.userStyle?.weight ?? (layer.style?.weight || 2);
      return `
        <div class="style-control-row">
          <label>Cor da Linha:</label>
          <input type="color" class="style-input-color" value="${color}">
        </div>
        <div class="style-control-row">
          <label>Espessura:</label>
          <input type="range" class="style-input-weight" min="1" max="10" value="${weight}">
          <span class="style-val-label weight-label">${weight}px</span>
        </div>
      `;
    } else {
      const markerColor = layer.userPointStyle?.markerColor || (layer.pointStyle?.markerColor || "#0f766e");
      const radius = layer.userPointStyle?.radius ?? (layer.pointStyle?.radius || 7);
      return `
        <div class="style-control-row">
          <label>Cor do Marcador:</label>
          <input type="color" class="style-input-marker-color" value="${markerColor}">
        </div>
        <div class="style-control-row">
          <label>Tamanho do Ponto:</label>
          <input type="range" class="style-input-radius" min="4" max="16" value="${radius}">
          <span class="style-val-label radius-label">${radius}px</span>
        </div>
      `;
    }
  }

  bindStyleControlEvents(item, layer) {
    const fillInput = item.querySelector(".style-input-fill");
    const strokeInput = item.querySelector(".style-input-stroke");
    const weightInput = item.querySelector(".style-input-weight");
    const opacityInput = item.querySelector(".style-input-opacity");
    const lineColInput = item.querySelector(".style-input-color");
    const markerColInput = item.querySelector(".style-input-marker-color");
    const radiusInput = item.querySelector(".style-input-radius");

    const onStyleChange = () => {
      layer.userStyle = layer.userStyle || {};
      if (fillInput) layer.userStyle.fillColor = fillInput.value;
      if (strokeInput) layer.userStyle.color = strokeInput.value;
      if (weightInput) {
        layer.userStyle.weight = parseInt(weightInput.value, 10);
        const lbl = item.querySelector(".weight-label");
        if (lbl) lbl.textContent = `${layer.userStyle.weight}px`;
      }
      if (opacityInput) {
        layer.userStyle.fillOpacity = parseInt(opacityInput.value, 10) / 100;
        const lbl = item.querySelector(".opacity-label");
        if (lbl) lbl.textContent = `${opacityInput.value}%`;
      }
      if (lineColInput) layer.userStyle.color = lineColInput.value;

      if (markerColInput || radiusInput) {
        layer.userPointStyle = layer.userPointStyle || Object.assign({}, layer.pointStyle || {});
        if (markerColInput) layer.userPointStyle.markerColor = markerColInput.value;
        if (radiusInput) {
          layer.userPointStyle.radius = parseInt(radiusInput.value, 10);
          const lbl = item.querySelector(".radius-label");
          if (lbl) lbl.textContent = `${layer.userPointStyle.radius}px`;
        }
      }

      this.updateLayerSymbology(layer);

      // Se a camada não estiver ativa, ativa-a automaticamente
      const chk = item.querySelector(".layer-checkbox");
      if (chk && !chk.checked) {
        this.setLayerActive(layer.id, true);
      }
    };

    if (fillInput) fillInput.addEventListener("input", onStyleChange);
    if (strokeInput) strokeInput.addEventListener("input", onStyleChange);
    if (weightInput) weightInput.addEventListener("input", onStyleChange);
    if (opacityInput) opacityInput.addEventListener("input", onStyleChange);
    if (lineColInput) lineColInput.addEventListener("input", onStyleChange);
    if (markerColInput) markerColInput.addEventListener("input", onStyleChange);
    if (radiusInput) radiusInput.addEventListener("input", onStyleChange);
  }

  updateLayerSymbology(layerConf) {
    const layer = this.mapLayers[layerConf.id];
    if (layer) {
      if (layerConf.geomType === "point") {
        if (layer.eachLayer) {
          layer.eachLayer((marker) => {
            if (marker.setIcon) {
              const style = layerConf.userPointStyle || layerConf.pointStyle;
              const iconHtml = `
                <div class="custom-pin-marker" style="background-color: ${style.markerColor}; width: ${style.radius * 3}px; height: ${style.radius * 3}px; font-size: ${style.radius * 1.5}px;">
                  <i class="fa ${style.icon}"></i>
                </div>
              `;
              marker.setIcon(L.divIcon({
                html: iconHtml,
                className: "custom-div-icon",
                iconSize: [style.radius * 3, style.radius * 3],
                iconAnchor: [style.radius * 1.5, style.radius * 1.5]
              }));
            }
          });
        }
      } else {
        if (layer.setStyle && typeof layer.setStyle === "function") {
          layer.setStyle((feat) => this.getLayerStyle(layerConf, feat));
        } else if (layer.eachLayer) {
          layer.eachLayer((sub) => {
            if (sub.setStyle) {
              sub.setStyle(this.getLayerStyle(layerConf, sub.feature));
            }
          });
        }
      }
    }

    // Atualiza o indicador de cor no painel lateral
    const itemEl = document.getElementById(`layer-item-${layerConf.id}`);
    if (itemEl) {
      const ind = itemEl.querySelector(".layer-color-indicator");
      if (ind) {
        if (layerConf.userStyle) {
          ind.style.background = layerConf.userStyle.fillColor || layerConf.userStyle.color;
          ind.style.borderColor = layerConf.userStyle.color || "#000";
        } else if (layerConf.userPointStyle) {
          ind.style.background = layerConf.userPointStyle.markerColor;
        }
      }
    }
  }

  /* ------------------------------------------------------------------------
     5. CARREGAMENTO E ATIVAÇÃO DE CAMADAS
     ------------------------------------------------------------------------ */
  loadInitialLayers() {
    // Carrega apenas as camadas ativas (atualmente APENAS limite_municipal)
    this.config.layers.forEach((layer) => {
      if (layer.active) {
        this.setLayerActive(layer.id, true);
      }
    });
    this.updateActiveCountBadge();
  }

  async setLayerActive(layerId, active) {
    const layerConf = this.config.layers.find((l) => l.id === layerId);
    if (!layerConf) return;

    const itemEl = document.getElementById(`layer-item-${layerId}`);
    const chkEl = document.getElementById(`chk-${layerId}`);
    const spinner = document.getElementById(`spinner-${layerId}`);

    if (chkEl) chkEl.checked = active;
    if (itemEl) {
      if (active) itemEl.classList.add("active");
      else itemEl.classList.remove("active");
    }

    if (active) {
      if (this.mapLayers[layerId]) {
        this.map.addLayer(this.mapLayers[layerId]);
      } else {
        if (spinner) spinner.style.display = "inline-block";
        try {
          await this.fetchAndCreateLayer(layerConf);
          if (this.mapLayers[layerId]) {
            this.map.addLayer(this.mapLayers[layerId]);
          }
        } catch (err) {
          console.error(`Erro ao carregar a camada ${layerId}:`, err);
          if (chkEl) chkEl.checked = false;
          if (itemEl) itemEl.classList.remove("active");
          alert(`Não foi possível carregar a camada "${layerConf.title}".`);
        } finally {
          if (spinner) spinner.style.display = "none";
        }
      }
    } else {
      if (this.mapLayers[layerId] && this.map.hasLayer(this.mapLayers[layerId])) {
        this.map.removeLayer(this.mapLayers[layerId]);
      }
    }

    this.updateActiveCountBadge();
  }

  async fetchAndCreateLayer(layerConf) {
    const geojson = await this.getLayerData(layerConf);
    let leafletLayer;

    if (layerConf.cluster && typeof L.markerClusterGroup === "function") {
      const clusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div style="background-color: ${layerConf.pointStyle.markerColor}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${count}</div>`,
            className: "custom-cluster-icon",
            iconSize: L.point(32, 32)
          });
        }
      });

      const pointLayer = L.geoJSON(geojson, {
        pointToLayer: (feat, latlng) => this.createPointMarker(feat, latlng, layerConf),
        onEachFeature: (feat, layer) => this.bindFeatureEvents(feat, layer, layerConf)
      });

      clusterGroup.addLayer(pointLayer);
      leafletLayer = clusterGroup;
    } else {
      leafletLayer = L.geoJSON(geojson, {
        style: (feat) => this.getLayerStyle(layerConf, feat),
        pointToLayer: (feat, latlng) => this.createPointMarker(feat, latlng, layerConf),
        onEachFeature: (feat, layer) => this.bindFeatureEvents(feat, layer, layerConf)
      });
    }

    this.mapLayers[layerConf.id] = leafletLayer;
  }

  getLayerStyle(layerConf, feature) {
    if (layerConf.userStyle) {
      return Object.assign({}, layerConf.style, layerConf.userStyle);
    }

    if (layerConf.classify && feature && feature.properties) {
      const fieldVal = feature.properties[layerConf.classify.field];
      const strVal = fieldVal !== undefined && fieldVal !== null ? String(fieldVal).trim() : "";
      const cat = layerConf.classify.categories[fieldVal] || 
                  layerConf.classify.categories[strVal] || 
                  layerConf.classify.default;
      if (cat) {
        return {
          color: cat.color || layerConf.style?.color || "#333333",
          weight: cat.weight ?? layerConf.style?.weight ?? 1.2,
          opacity: cat.opacity ?? layerConf.style?.opacity ?? 0.9,
          fillColor: cat.fillColor || cat.color,
          fillOpacity: cat.fillOpacity ?? layerConf.style?.fillOpacity ?? 0.6,
          dashArray: cat.dashArray ?? layerConf.style?.dashArray ?? null
        };
      }
    }

    if (layerConf.style) {
      return Object.assign({}, layerConf.style);
    }
    return {
      color: "#0f766e",
      weight: 2,
      opacity: 0.8,
      fillColor: "#0f766e",
      fillOpacity: 0.2
    };
  }

  createPointMarker(feature, latlng, layerConf) {
    const style = layerConf.userPointStyle || layerConf.pointStyle || {
      icon: "fa-location-dot",
      markerColor: "#0f766e",
      radius: 8
    };

    const iconHtml = `
      <div class="custom-pin-marker" style="background-color: ${style.markerColor}; width: ${style.radius * 3}px; height: ${style.radius * 3}px; font-size: ${style.radius * 1.5}px;">
        <i class="fa ${style.icon}"></i>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: "custom-div-icon",
      iconSize: [style.radius * 3, style.radius * 3],
      iconAnchor: [style.radius * 1.5, style.radius * 1.5]
    });

    return L.marker(latlng, { icon: customIcon });
  }

  highlightFeature(layer, layerConf, feature) {
    if (this.selectedFeatureLayer && this.selectedFeatureLayer !== layer) {
      if (this.selectedFeatureLayer.setStyle) {
        this.selectedFeatureLayer.setStyle(this.getLayerStyle(this.selectedFeatureLayer._layerConf, this.selectedFeatureLayer._feature));
      }
    }
    this.selectedFeatureLayer = layer;
    layer._layerConf = layerConf;
    layer._feature = feature;
    if (layer.setStyle && layerConf.geomType !== "point") {
      layer.setStyle({
        weight: (layerConf.userStyle?.weight || layerConf.style?.weight || 2) + 2.5,
        color: "#f59e0b"
      });
      if (layer.bringToFront) layer.bringToFront();
    }
  }

  bindFeatureEvents(feature, layer, layerConf) {
    const titleVal = this.getFeatureTitle(feature, layerConf);
    if (titleVal) {
      layer.bindTooltip(titleVal, {
        sticky: true,
        direction: "top",
        className: "measure-tooltip"
      });
    }

    layer.on({
      click: (e) => {
        L.DomEvent.stopPropagation(e);
        // Abre UNICAMENTE o painel lateral "Detalhes do Objeto", sem popups sobrepostos duplicados!
        this.highlightFeature(layer, layerConf, feature);
        this.updateInspectorPanel(layerConf, titleVal, feature.properties || {});
      },
      mouseover: () => {
        if (layer.setStyle && typeof layer.setStyle === "function" && layerConf.geomType !== "point") {
          layer.setStyle({
            weight: (layerConf.userStyle?.weight || layerConf.style?.weight || 1.5) + 2,
            color: "#f59e0b",
            fillOpacity: Math.min(1, (layerConf.userStyle?.fillOpacity ?? layerConf.style?.fillOpacity ?? 0.5) + 0.25)
          });
        }
      },
      mouseout: () => {
        if (layer.setStyle && typeof layer.setStyle === "function" && layerConf.geomType !== "point") {
          if (this.selectedFeatureLayer !== layer) {
            layer.setStyle(this.getLayerStyle(layerConf, feature));
          }
        }
      }
    });
  }

  getFeatureTitle(feature, layerConf) {
    if (!feature || !feature.properties) return layerConf.title;

    // Títulos específicos para camadas temáticas geológicas
    if (layerConf.id === "geologia" && feature.properties) {
      const p = feature.properties;
      return `${p.nm_unidade || "Unidade Geológica"} (${p.letra_simb || ""})`;
    }
    if (layerConf.id === "geomorfologia" && feature.properties) {
      const p = feature.properties;
      return `${p.nm_unidade || "Compartimento"} (${p.letra_simb || ""})`;
    }
    if (layerConf.id === "pedologia" && feature.properties) {
      const p = feature.properties;
      return `Solo: ${p.ordem || p.legenda || "Classe de Solo"}`;
    }
    if ((layerConf.id === "risco_geologico" || layerConf.id === "risco_geologico2") && feature.properties) {
      const p = feature.properties;
      return `Área de Risco: ${p.local || p.LOCAL || "Setor"} (${p.grau_risco || p.GRAU_RISCO || "Alto"})`;
    }
    if (layerConf.id === "geodiversidade" && feature.properties) {
      const p = feature.properties;
      return `${p.NOME_UNIDA || p.DOMINIO || "Geodiversidade"}`;
    }

    if (layerConf.titleField && feature.properties[layerConf.titleField]) {
      return String(feature.properties[layerConf.titleField]);
    }
    const commonKeys = ["name", "nome", "NOME", "name_school", "name_neighborhood", "NOMEDISTRI", "LOCAL", "local"];
    for (const k of commonKeys) {
      if (feature.properties[k]) return String(feature.properties[k]);
    }
    return layerConf.title;
  }

  setLayerOpacity(layerId, opacity) {
    const layer = this.mapLayers[layerId];
    const layerConf = this.config.layers.find((l) => l.id === layerId);
    if (!layer) return;

    if (layer.setStyle && typeof layer.setStyle === "function") {
      layer.setStyle({
        opacity: opacity,
        fillOpacity: (layerConf?.style?.fillOpacity || 0.5) * opacity
      });
    } else if (layer.eachLayer) {
      layer.eachLayer((sub) => {
        if (sub.setOpacity && typeof sub.setOpacity === "function") {
          sub.setOpacity(opacity);
        } else if (sub.setStyle && typeof sub.setStyle === "function") {
          const feat = sub.feature;
          const baseStyle = layerConf ? this.getLayerStyle(layerConf, feat) : { fillOpacity: 0.5 };
          sub.setStyle({
            opacity: opacity,
            fillOpacity: (baseStyle.fillOpacity || 0.5) * opacity
          });
        }
      });
    }
  }

  zoomToLayer(layerId) {
    const layer = this.mapLayers[layerId];
    if (layer && this.map.hasLayer(layer)) {
      if (layer.getBounds && typeof layer.getBounds === "function") {
        this.map.flyToBounds(layer.getBounds(), { padding: [40, 40], duration: 1.2 });
      }
    } else {
      this.setLayerActive(layerId, true).then(() => {
        const l = this.mapLayers[layerId];
        if (l && l.getBounds) {
          this.map.flyToBounds(l.getBounds(), { padding: [40, 40], duration: 1.2 });
        }
      });
    }
  }

  updateActiveCountBadge() {
    let count = 0;
    this.config.layers.forEach((l) => {
      if (this.mapLayers[l.id] && this.map.hasLayer(this.mapLayers[l.id])) {
        count++;
      }
    });
    this.customLayers.forEach((cl) => {
      if (this.map.hasLayer(cl.layer)) count++;
    });
    const badge = document.getElementById("active-layers-count");
    if (badge) badge.textContent = `${count} ativas`;
  }

  /* ------------------------------------------------------------------------
     6. DOWNLOAD DA CAMADA EM FORMATO KML (GOOGLE EARTH)
     ------------------------------------------------------------------------ */
  async downloadLayerAsKml(layerId) {
    const layerConf = this.config.layers.find((l) => l.id === layerId);
    if (!layerConf) return;

    try {
      const geojson = await this.getLayerData(layerConf);
      const kmlString = this.convertGeoJsonToKml(geojson, layerConf.title);
      this.triggerFileDownload(kmlString, `${layerId}.kml`, "application/vnd.google-earth.kml+xml");
    } catch (err) {
      console.error("Erro ao gerar KML:", err);
      alert("Não foi possível gerar o arquivo KML para esta camada.");
    }
  }

  convertGeoJsonToKml(geojson, docName) {
    const escapeXml = (str) => {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };

    const ringToKml = (ring) => {
      return `<LinearRing><coordinates>${ring.map(c => `${c[0]},${c[1]},0`).join(" ")}</coordinates></LinearRing>`;
    };

    const geomToKml = (geom) => {
      if (!geom) return "";
      const { type, coordinates: coords } = geom;

      if (type === "Point") {
        return `<Point><coordinates>${coords[0]},${coords[1]},0</coordinates></Point>`;
      } else if (type === "MultiPoint") {
        return `<MultiGeometry>${coords.map(c => `<Point><coordinates>${c[0]},${c[1]},0</coordinates></Point>`).join("")}</MultiGeometry>`;
      } else if (type === "LineString") {
        return `<LineString><coordinates>${coords.map(c => `${c[0]},${c[1]},0`).join(" ")}</coordinates></LineString>`;
      } else if (type === "MultiLineString") {
        return `<MultiGeometry>${coords.map(line => `<LineString><coordinates>${line.map(c => `${c[0]},${c[1]},0`).join(" ")}</coordinates></LineString>`).join("")}</MultiGeometry>`;
      } else if (type === "Polygon") {
        const outer = ringToKml(coords[0]);
        const inners = coords.slice(1).map(r => `<innerBoundaryIs>${ringToKml(r)}</innerBoundaryIs>`).join("");
        return `<Polygon><outerBoundaryIs>${outer}</outerBoundaryIs>${inners}</Polygon>`;
      } else if (type === "MultiPolygon") {
        return `<MultiGeometry>${coords.map(poly => {
          const outer = ringToKml(poly[0]);
          const inners = poly.slice(1).map(r => `<innerBoundaryIs>${ringToKml(r)}</innerBoundaryIs>`).join("");
          return `<Polygon><outerBoundaryIs>${outer}</outerBoundaryIs>${inners}</Polygon>`;
        }).join("")}</MultiGeometry>`;
      }
      return "";
    };

    let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(docName)}</name>
    <description>Exportado pelo Geoportal Municipal de Teófilo Otoni - MG</description>
`;

    const features = geojson.features || (geojson.type === "Feature" ? [geojson] : []);
    features.forEach((feat, i) => {
      const props = feat.properties || {};
      const name = props.name || props.nome || props.NOME || props.name_school || props.NOMEDISTRI || props.name_neighborhood || `Feição ${i + 1}`;
      
      let extData = "<ExtendedData>";
      Object.keys(props).forEach(k => {
        if (props[k] !== null && props[k] !== undefined) {
          extData += `<Data name="${escapeXml(k)}"><value>${escapeXml(props[k])}</value></Data>`;
        }
      });
      extData += "</ExtendedData>";

      kml += `    <Placemark>
      <name>${escapeXml(name)}</name>
      ${extData}
      ${geomToKml(feat.geometry)}
    </Placemark>
`;
    });

    kml += `  </Document>
</kml>`;
    return kml;
  }

  triggerFileDownload(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ------------------------------------------------------------------------
     7. INSERIR CAMADA GEOJSON DO USUÁRIO
     ------------------------------------------------------------------------ */
  initGeojsonImporter() {
    const btnOpenImport = document.getElementById("btn-open-import-geojson");
    const modalImport = document.getElementById("modal-import-geojson");
    const btnCloseImport = document.getElementById("btn-close-modal-import");
    const fileInput = document.getElementById("import-file-input");
    const layerNameInput = document.getElementById("import-layer-name");
    const colorInput = document.getElementById("import-layer-color");
    const btnConfirmImport = document.getElementById("btn-confirm-import");

    if (btnOpenImport && modalImport) {
      btnOpenImport.addEventListener("click", () => {
        modalImport.classList.add("active");
      });
    }

    if (btnCloseImport && modalImport) {
      btnCloseImport.addEventListener("click", () => {
        modalImport.classList.remove("active");
      });
    }

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file && layerNameInput) {
          const rawName = file.name.replace(/\.[^/.]+$/, "");
          layerNameInput.value = rawName;
        }
      });
    }

    if (btnConfirmImport) {
      btnConfirmImport.addEventListener("click", () => {
        const file = fileInput.files[0];
        if (!file) {
          alert("Selecione um arquivo .geojson ou .json do seu computador.");
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const geojson = JSON.parse(event.target.result);
            const layerName = layerNameInput.value.trim() || file.name;
            const chosenColor = colorInput.value || "#0f766e";

            this.addCustomUserLayer(geojson, layerName, chosenColor);
            modalImport.classList.remove("active");
            fileInput.value = "";
          } catch (err) {
            console.error(err);
            alert("Erro ao processar o arquivo GeoJSON. Verifique se o formato é válido.");
          }
        };
        reader.readAsText(file);
      });
    }
  }

  addCustomUserLayer(geojson, layerName, color) {
    const customId = `custom_${Date.now()}`;
    const leafletLayer = L.geoJSON(geojson, {
      style: {
        color: color,
        weight: 2.5,
        fillColor: color,
        fillOpacity: 0.25
      },
      pointToLayer: (feat, latlng) => {
        return L.circleMarker(latlng, {
          radius: 8,
          color: color,
          fillColor: color,
          fillOpacity: 0.8,
          weight: 2
        });
      },
      onEachFeature: (feat, layer) => {
        const props = feat.properties || {};
        let html = `<strong>${layerName}</strong><br><hr style="margin: 4px 0;">`;
        Object.keys(props).forEach(k => {
          html += `<div style="font-size: 0.75rem;"><b>${k}:</b> ${props[k]}</div>`;
        });
        layer.bindPopup(html);
      }
    }).addTo(this.map);

    this.customLayers.push({ id: customId, name: layerName, layer: leafletLayer, geojson: geojson });

    // Enquadra no mapa
    if (leafletLayer.getBounds && leafletLayer.getBounds().isValid()) {
      this.map.flyToBounds(leafletLayer.getBounds(), { padding: [50, 50], duration: 1.2 });
    }

    // Adiciona na Sidebar sob uma categoria do usuário
    let customCategoryGroup = document.getElementById("cat-group-user-layers");
    if (!customCategoryGroup) {
      const container = document.getElementById("layer-catalog-container");
      customCategoryGroup = document.createElement("div");
      customCategoryGroup.className = "category-group open";
      customCategoryGroup.id = "cat-group-user-layers";
      customCategoryGroup.innerHTML = `
        <div class="category-header">
          <div class="category-title">
            <i class="fa fa-folder-open" style="color: #0284c7;"></i>
            <span>Minhas Camadas (Importadas)</span>
          </div>
          <span class="category-badge-count" id="user-layers-badge">1</span>
        </div>
        <div class="category-body" id="user-layers-body"></div>
      `;
      container.prepend(customCategoryGroup);
    }

    const userBody = document.getElementById("user-layers-body");
    const countBadge = document.getElementById("user-layers-badge");
    if (countBadge) countBadge.textContent = this.customLayers.length;

    const item = document.createElement("div");
    item.className = "layer-item active";
    item.innerHTML = `
      <div class="layer-main-row">
        <label class="layer-checkbox-label">
          <input type="checkbox" class="layer-checkbox" checked>
          <span class="layer-color-indicator" style="background-color: ${color}; border-color: ${color};"></span>
          <span class="layer-name">${layerName}</span>
        </label>
        <div class="layer-actions">
          <button class="layer-tool-btn" title="Enquadrar no Mapa" data-action="zoom"><i class="fa fa-crosshairs"></i></button>
          <button class="layer-tool-btn" title="Remover Camada" data-action="remove"><i class="fa fa-trash" style="color: var(--danger);"></i></button>
        </div>
      </div>
    `;

    const chk = item.querySelector(".layer-checkbox");
    chk.addEventListener("change", (e) => {
      if (e.target.checked) this.map.addLayer(leafletLayer);
      else this.map.removeLayer(leafletLayer);
      this.updateActiveCountBadge();
    });

    const zoomBtn = item.querySelector('[data-action="zoom"]');
    zoomBtn.addEventListener("click", () => {
      if (leafletLayer.getBounds().isValid()) {
        this.map.flyToBounds(leafletLayer.getBounds(), { padding: [50, 50], duration: 1.2 });
      }
    });

    const removeBtn = item.querySelector('[data-action="remove"]');
    removeBtn.addEventListener("click", () => {
      this.map.removeLayer(leafletLayer);
      item.remove();
      this.customLayers = this.customLayers.filter(cl => cl.id !== customId);
      if (countBadge) countBadge.textContent = this.customLayers.length;
      this.updateActiveCountBadge();
    });

    userBody.appendChild(item);
    this.updateActiveCountBadge();
  }

  /* ------------------------------------------------------------------------
     8. GEOCOLABORAÇÃO CIDADÃ (RELATO DE IMPACTOS SOCIOAMBIENTAIS COM FOTO/VÍDEO)
     ------------------------------------------------------------------------ */
  initGeocollaboration() {
    this.collabLayer = L.layerGroup().addTo(this.map);

    // Carrega relatos persistidos no localStorage
    const saved = localStorage.getItem("geoportal_collab_reports");
    if (saved) {
      try {
        this.collabReports = JSON.parse(saved);
        this.collabReports.forEach(r => this.renderCollabMarker(r));
      } catch (e) {
        console.warn("Erro ao carregar relatos de geocolaboração:", e);
      }
    }

    // Botão de Geocolaboração no cabeçalho e na barra de ferramentas
    const btnHeaderCollab = document.getElementById("btn-header-collab");
    const btnToolCollab = document.getElementById("tool-collab-add");
    const instructionBanner = document.getElementById("collab-instruction-banner");
    const btnCancelCollab = document.getElementById("btn-cancel-collab-mode");

    const activateCollabMode = () => {
      this.isCollabMode = true;
      if (instructionBanner) instructionBanner.style.display = "flex";
      if (btnToolCollab) btnToolCollab.classList.add("tool-collab-active");
      this.map.getContainer().style.cursor = "crosshair";
    };

    const deactivateCollabMode = () => {
      this.isCollabMode = false;
      if (instructionBanner) instructionBanner.style.display = "none";
      if (btnToolCollab) btnToolCollab.classList.remove("tool-collab-active");
      this.map.getContainer().style.cursor = "";
    };

    if (btnHeaderCollab) btnHeaderCollab.addEventListener("click", activateCollabMode);
    if (btnToolCollab) btnToolCollab.addEventListener("click", activateCollabMode);
    if (btnCancelCollab) btnCancelCollab.addEventListener("click", deactivateCollabMode);

    // Clique no mapa em modo Geocolaboração
    this.map.on("click", (e) => {
      if (this.isCollabMode) {
        deactivateCollabMode();
        this.openCollabModal(e.latlng);
      }
    });

    // Formulário do Modal de Geocolaboração
    const modalCollab = document.getElementById("modal-collab");
    const btnCloseCollab = document.getElementById("btn-close-modal-collab");
    const fileMediaInput = document.getElementById("collab-media-file");
    const previewBox = document.getElementById("collab-preview-box");
    const previewImg = document.getElementById("collab-preview-img");
    const previewVideo = document.getElementById("collab-preview-video");
    const formCollab = document.getElementById("form-collab-report");

    if (btnCloseCollab && modalCollab) {
      btnCloseCollab.addEventListener("click", () => modalCollab.classList.remove("active"));
    }

    // Preview de foto ou vídeo com compressão via canvas para fotos
    if (fileMediaInput) {
      fileMediaInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) {
          previewBox.style.display = "none";
          return;
        }

        const isVideo = file.type.startsWith("video/");
        const reader = new FileReader();

        reader.onload = (ev) => {
          previewBox.style.display = "block";
          if (isVideo) {
            previewImg.style.display = "none";
            previewVideo.style.display = "block";
            previewVideo.src = ev.target.result;
            window._collabMediaData = { type: "video", data: ev.target.result };
          } else {
            // Comprime foto via canvas para salvar pouco espaço
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const maxDim = 1200;
              let w = img.width;
              let h = img.height;
              if (w > maxDim || h > maxDim) {
                if (w > h) { h = (h * maxDim) / w; w = maxDim; }
                else { w = (w * maxDim) / h; h = maxDim; }
              }
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, w, h);
              const compressedData = canvas.toDataURL("image/jpeg", 0.75);

              previewVideo.style.display = "none";
              previewImg.style.display = "block";
              previewImg.src = compressedData;
              window._collabMediaData = { type: "image", data: compressedData };
            };
            img.src = ev.target.result;
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (formCollab) {
      formCollab.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveCollabReport();
      });
    }

    // Botão Exportar Relatos
    const btnExportCollab = document.getElementById("btn-export-collab-kml");
    if (btnExportCollab) {
      btnExportCollab.addEventListener("click", () => {
        this.exportCollabReportsAsKml();
      });
    }
  }

  openCollabModal(latlng) {
    this.collabTempLatLng = latlng;
    const modal = document.getElementById("modal-collab");
    const coordsInput = document.getElementById("collab-coords-display");
    const previewBox = document.getElementById("collab-preview-box");

    if (coordsInput) {
      coordsInput.value = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
    }
    if (previewBox) previewBox.style.display = "none";
    window._collabMediaData = null;

    if (modal) modal.classList.add("active");
  }

  saveCollabReport() {
    if (!this.collabTempLatLng) return;

    const category = document.getElementById("collab-category").value;
    const title = document.getElementById("collab-title").value.trim();
    const desc = document.getElementById("collab-desc").value.trim();
    const author = document.getElementById("collab-author").value.trim() || "Cidadão Colaborador";
    const neighborhood = document.getElementById("collab-neighborhood").value.trim();

    const report = {
      id: `report_${Date.now()}`,
      lat: this.collabTempLatLng.lat,
      lng: this.collabTempLatLng.lng,
      category: category,
      title: title,
      desc: desc,
      author: author,
      neighborhood: neighborhood,
      date: new Date().toLocaleString("pt-BR"),
      media: window._collabMediaData || null
    };

    this.collabReports.push(report);
    try {
      localStorage.setItem("geoportal_collab_reports", JSON.stringify(this.collabReports));
    } catch (e) {
      console.warn("Armazenamento local cheio, removendo foto para manter o registro:", e);
      report.media = null;
      localStorage.setItem("geoportal_collab_reports", JSON.stringify(this.collabReports));
    }

    this.renderCollabMarker(report);

    // Fecha modal e limpa form
    document.getElementById("modal-collab").classList.remove("active");
    document.getElementById("form-collab-report").reset();
    this.collabTempLatLng = null;

    // Aproxima do novo relato
    this.map.flyTo([report.lat, report.lng], 16, { duration: 1 });
  }

  renderCollabMarker(report) {
    const iconHtml = `
      <div class="collab-pulsing-marker" title="${report.title}">
        <i class="fa fa-triangle-exclamation"></i>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: "custom-collab-icon",
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    const marker = L.marker([report.lat, report.lng], { icon: customIcon }).addTo(this.collabLayer);

    let mediaHtml = "";
    if (report.media) {
      if (report.media.type === "image") {
        mediaHtml = `<a href="${report.media.data}" target="_blank"><img src="${report.media.data}" class="collab-popup-media" alt="Foto do impacto"></a>`;
      } else if (report.media.type === "video") {
        mediaHtml = `<video src="${report.media.data}" controls class="collab-popup-video"></video>`;
      }
    }

    const popupHtml = `
      <div class="custom-popup-card">
        <div class="custom-popup-header" style="background: #fff7ed; border-bottom: 1px solid #fed7aa;">
          <div class="custom-popup-badge" style="color: #c2410c;"><i class="fa fa-bullhorn"></i> ${report.category}</div>
          <div class="custom-popup-title" style="color: #9a3412;">${report.title}</div>
        </div>
        <div class="custom-popup-body">
          <p style="font-size: 0.8rem; margin-bottom: 6px; color: var(--text-primary);">${report.desc}</p>
          ${mediaHtml}
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 8px;">
            <div><b>Localidade/Bairro:</b> ${report.neighborhood || "Teófilo Otoni"}</div>
            <div><b>Registrado por:</b> ${report.author}</div>
            <div><b>Data:</b> ${report.date}</div>
          </div>
        </div>
        <div class="custom-popup-footer">
          <span style="color: #ea580c; font-weight: 700;">Impacto Mapeado</span>
          <button style="background: none; border: none; color: var(--danger); font-size: 0.75rem; cursor: pointer;" onclick="GeoportalApp.deleteCollabReport('${report.id}')"><i class="fa fa-trash"></i> Excluir</button>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml, { maxWidth: 320 });
  }

  deleteCollabReport(reportId) {
    if (!confirm("Deseja realmente remover este relato mapeado?")) return;
    this.collabReports = this.collabReports.filter(r => r.id !== reportId);
    localStorage.setItem("geoportal_collab_reports", JSON.stringify(this.collabReports));
    this.collabLayer.clearLayers();
    this.collabReports.forEach(r => this.renderCollabMarker(r));
    this.map.closePopup();
  }

  exportCollabReportsAsKml() {
    if (this.collabReports.length === 0) {
      alert("Nenhum relato socioambiental registrado para exportar.");
      return;
    }

    const geojson = {
      type: "FeatureCollection",
      features: this.collabReports.map(r => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [r.lng, r.lat]
        },
        properties: {
          titulo: r.title,
          categoria: r.category,
          descricao: r.desc,
          bairro: r.neighborhood,
          autor: r.author,
          data: r.date
        }
      }))
    };

    const kml = this.convertGeoJsonToKml(geojson, "Relatos de Impactos Socioambientais - Teófilo Otoni");
    this.triggerFileDownload(kml, "relatos_socioambientais_teofilo_otoni.kml", "application/vnd.google-earth.kml+xml");
  }

  /* ------------------------------------------------------------------------
     9. POPUPS E INSPEÇÃO DE ATRIBUTOS
     ------------------------------------------------------------------------ */
  openFeaturePopupAndInspector(feature, layer, layerConf, latlng) {
    const props = feature.properties || {};
    const title = this.getFeatureTitle(feature, layerConf);

    let attrRowsHtml = "";
    layerConf.fields.forEach((f) => {
      const rawVal = props[f.key];
      if (rawVal !== undefined && rawVal !== null && rawVal !== "") {
        const displayVal = f.format ? f.format(rawVal) : String(rawVal);
        attrRowsHtml += `
          <div class="popup-attr-row">
            <span class="popup-attr-label">${f.label}:</span>
            <span class="popup-attr-value">${displayVal}</span>
          </div>
        `;
      }
    });

    const popupHtml = `
      <div class="custom-popup-card">
        <div class="custom-popup-header">
          <div class="custom-popup-badge">${layerConf.source} &bull; ${layerConf.title}</div>
          <div class="custom-popup-title">${title}</div>
        </div>
        <div class="custom-popup-body">
          ${attrRowsHtml || '<p style="font-size: 0.75rem; color: #94a3b8;">Sem atributos adicionais cadastrados.</p>'}
        </div>
        <div class="custom-popup-footer">
          <span style="color: var(--text-muted);"><i class="fa fa-info-circle"></i> Fonte: ${layerConf.subsource || layerConf.source}</span>
          <button style="background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer;" onclick="GeoportalApp.openInspectorOnly('${layerConf.id}', ${JSON.stringify(props).replace(/"/g, '&quot;')})">Ver Detalhes</button>
        </div>
      </div>
    `;

    const popupLocation = latlng || (layer.getBounds ? layer.getBounds().getCenter() : layer.getLatLng());
    L.popup({ maxWidth: 320, className: "custom-leaflet-popup" })
      .setLatLng(popupLocation)
      .setContent(popupHtml)
      .openOn(this.map);

    this.updateInspectorPanel(layerConf, title, props);
  }

  updateInspectorPanel(layerConf, title, props) {
    const inspector = document.getElementById("feature-inspector");
    if (!inspector) return;

    const layerBadge = document.getElementById("inspector-layer-badge");
    const titleEl = document.getElementById("inspector-feature-title");
    const tableBody = document.getElementById("inspector-attributes-body");

    if (layerBadge) {
      layerBadge.textContent = `${layerConf.source} • ${layerConf.title}`;
      layerBadge.className = `inspector-layer-badge badge-${layerConf.source}`;
    }

    if (titleEl) titleEl.textContent = title;

    if (tableBody) {
      tableBody.innerHTML = "";
      layerConf.fields.forEach((f) => {
        const val = props[f.key];
        if (val !== undefined && val !== null && val !== "") {
          const formatted = f.format ? f.format(val) : String(val);
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <th>${f.label}</th>
            <td>${formatted}</td>
          `;
          tableBody.appendChild(tr);
        }
      });
    }

    inspector.classList.add("open");
  }

  openInspectorOnly(layerId, props) {
    const layerConf = this.config.layers.find((l) => l.id === layerId);
    if (!layerConf) return;
    const title = this.getFeatureTitle({ properties: props }, layerConf);
    this.updateInspectorPanel(layerConf, title, props);
  }

  /* ------------------------------------------------------------------------
     10. BUSCA DE FEIÇÕES
     ------------------------------------------------------------------------ */
  initSearch() {
    const input = document.getElementById("global-search-input");
    const dropdown = document.getElementById("search-results-dropdown");
    const clearBtn = document.getElementById("search-clear-btn");

    if (!input || !dropdown) return;

    input.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (clearBtn) clearBtn.style.display = q ? "block" : "none";

      if (q.length < 2) {
        dropdown.style.display = "none";
        return;
      }

      const results = this.searchAcrossLoadedLayers(q);
      this.renderSearchResults(results, dropdown);
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        input.value = "";
        clearBtn.style.display = "none";
        dropdown.style.display = "none";
      });
    }

    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });
  }

  searchAcrossLoadedLayers(query) {
    const matches = [];
    const layersData = window.GEOPORTAL_LAYERS_DATA || {};

    Object.keys(layersData).forEach((layerId) => {
      const layerConf = this.config.layers.find((l) => l.id === layerId);
      const data = layersData[layerId];
      if (!data || !data.features || !layerConf) return;

      for (const feat of data.features) {
        if (!feat.properties) continue;
        const title = this.getFeatureTitle(feat, layerConf);
        if (title && title.toLowerCase().includes(query)) {
          matches.push({
            title: title,
            layerConf: layerConf,
            feature: feat
          });
          if (matches.length >= 10) break;
        }
      }
    });

    return matches;
  }

  renderSearchResults(results, dropdown) {
    if (results.length === 0) {
      dropdown.innerHTML = `<div style="padding: 0.85rem; font-size: 0.8rem; color: var(--text-muted); text-align: center;">Nenhum elemento localizado nas camadas carregadas.</div>`;
      dropdown.style.display = "block";
      return;
    }

    dropdown.innerHTML = "";
    results.forEach((item) => {
      const div = document.createElement("div");
      div.className = "search-item";
      div.innerHTML = `
        <div class="search-item-info">
          <span class="search-item-title">${item.title}</span>
          <span class="search-item-sub">${item.layerConf.title}</span>
        </div>
        <span class="search-item-tag">${item.layerConf.source}</span>
      `;

      div.addEventListener("click", () => {
        dropdown.style.display = "none";
        this.zoomToFeature(item.feature, item.layerConf);
      });

      dropdown.appendChild(div);
    });

    dropdown.style.display = "block";
  }

  zoomToFeature(feature, layerConf) {
    this.setLayerActive(layerConf.id, true);

    const tempLayer = L.geoJSON(feature);
    const bounds = tempLayer.getBounds();

    if (feature.geometry.type === "Point") {
      const coords = feature.geometry.coordinates;
      this.map.flyTo([coords[1], coords[0]], 16, { duration: 1.2 });
    } else {
      this.map.flyToBounds(bounds, { padding: [60, 60], duration: 1.2 });
    }

    if (this.highlightLayer) {
      this.map.removeLayer(this.highlightLayer);
    }

    this.highlightLayer = L.geoJSON(feature, {
      style: {
        color: "#f59e0b",
        weight: 5,
        fillColor: "#fbbf24",
        fillOpacity: 0.4
      },
      pointToLayer: (f, latlng) => {
        return L.circleMarker(latlng, {
          radius: 12,
          color: "#f59e0b",
          weight: 4,
          fillColor: "#fbbf24",
          fillOpacity: 0.8
        });
      }
    }).addTo(this.map);

    setTimeout(() => {
      if (this.highlightLayer) {
        this.map.removeLayer(this.highlightLayer);
        this.highlightLayer = null;
      }
    }, 4500);

    setTimeout(() => {
      this.openFeaturePopupAndInspector(feature, tempLayer, layerConf);
    }, 700);
  }

  /* ------------------------------------------------------------------------
     11. FERRAMENTAS DE MEDIÇÃO E BARRA FLUTUANTE
     ------------------------------------------------------------------------ */
  initToolbar() {
    const resetExtentBtn = document.getElementById("btn-reset-extent");
    if (resetExtentBtn) {
      resetExtentBtn.addEventListener("click", () => {
        this.map.flyToBounds(this.config.municipality.bounds, { padding: [25, 25], duration: 1.2 });
      });
    }

    const fullscreenBtn = document.getElementById("btn-fullscreen");
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
          fullscreenBtn.querySelector("i").className = "fa fa-compress";
        } else {
          document.exitFullscreen();
          fullscreenBtn.querySelector("i").className = "fa fa-expand";
        }
      });
    }

    const btnMeasureDist = document.getElementById("tool-measure-distance");
    const btnMeasureArea = document.getElementById("tool-measure-area");
    const btnMeasureClear = document.getElementById("tool-measure-clear");

    if (btnMeasureDist) {
      btnMeasureDist.addEventListener("click", () => {
        this.toggleMeasureMode("distance", btnMeasureDist);
      });
    }

    if (btnMeasureArea) {
      btnMeasureArea.addEventListener("click", () => {
        this.toggleMeasureMode("area", btnMeasureArea);
      });
    }

    if (btnMeasureClear) {
      btnMeasureClear.addEventListener("click", () => {
        this.clearMeasurements();
      });
    }

    this.map.on("click", (e) => {
      if (this.measureMode) {
        this.handleMeasureClick(e.latlng);
      }
    });

    const closeInspectorBtn = document.getElementById("close-inspector-btn");
    const inspector = document.getElementById("feature-inspector");
    if (closeInspectorBtn && inspector) {
      closeInspectorBtn.addEventListener("click", () => {
        inspector.classList.remove("open");
      });
    }
  }

  toggleMeasureMode(mode, btnEl) {
    if (this.measureMode === mode) {
      this.measureMode = null;
      btnEl.classList.remove("active");
      this.map.getContainer().style.cursor = "";
    } else {
      document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
      this.clearMeasurements();
      this.measureMode = mode;
      btnEl.classList.add("active");
      this.map.getContainer().style.cursor = "crosshair";
    }
  }

  handleMeasureClick(latlng) {
    this.measurePoints.push(latlng);
    this.drawMeasurement();
  }

  drawMeasurement() {
    this.measureLayer.clearLayers();
    if (this.measurePoints.length === 0) return;

    this.measurePoints.forEach((pt) => {
      L.circleMarker(pt, {
        radius: 5,
        color: "#dc2626",
        fillColor: "#ffffff",
        fillOpacity: 1,
        weight: 2
      }).addTo(this.measureLayer);
    });

    if (this.measureMode === "distance") {
      if (this.measurePoints.length >= 2) {
        L.polyline(this.measurePoints, {
          color: "#dc2626",
          weight: 3,
          dashArray: "6, 6"
        }).addTo(this.measureLayer);

        let totalDistMeters = 0;
        for (let i = 0; i < this.measurePoints.length - 1; i++) {
          totalDistMeters += this.measurePoints[i].distanceTo(this.measurePoints[i + 1]);
        }

        const formatted = totalDistMeters > 1000 ? `${(totalDistMeters / 1000).toFixed(2)} km` : `${Math.round(totalDistMeters)} m`;
        const lastPt = this.measurePoints[this.measurePoints.length - 1];

        L.popup({ closeButton: false, offset: [0, -10] })
          .setLatLng(lastPt)
          .setContent(`<strong>Distância Total:</strong> ${formatted}`)
          .openOn(this.map);
      }
    } else if (this.measureMode === "area") {
      if (this.measurePoints.length >= 3) {
        const polygon = L.polygon(this.measurePoints, {
          color: "#059669",
          fillColor: "#10b981",
          fillOpacity: 0.3,
          weight: 2
        }).addTo(this.measureLayer);

        const areaM2 = this.calculatePolygonArea(this.measurePoints);
        const areaHa = areaM2 / 10000;
        const areaKm2 = areaM2 / 1000000;
        const formatted = `${areaHa.toFixed(2)} ha (${areaKm2.toFixed(3)} km²)`;

        const center = polygon.getBounds().getCenter();
        L.popup({ closeButton: false, offset: [0, -10] })
          .setLatLng(center)
          .setContent(`<strong>Área Estimada:</strong> ${formatted}`)
          .openOn(this.map);
      }
    }
  }

  calculatePolygonArea(latlngs) {
    const radius = 6378137;
    let area = 0;
    const len = latlngs.length;
    if (len < 3) return 0;

    for (let i = 0; i < len; i++) {
      const p1 = latlngs[i];
      const p2 = latlngs[(i + 1) % len];
      const radP1Lat = (p1.lat * Math.PI) / 180;
      const radP2Lat = (p2.lat * Math.PI) / 180;
      const radP1Lng = (p1.lng * Math.PI) / 180;
      const radP2Lng = (p2.lng * Math.PI) / 180;

      area += (radP2Lng - radP1Lng) * (2 + Math.sin(radP1Lat) + Math.sin(radP2Lat));
    }

    return (Math.abs(area) * radius * radius) / 2.0;
  }

  clearMeasurements() {
    this.measurePoints = [];
    this.measureLayer.clearLayers();
    this.map.closePopup();
    this.measureMode = null;
    document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
    this.map.getContainer().style.cursor = "";
  }

  /* ------------------------------------------------------------------------
     12. BARRA INFERIOR DE COORDENADAS (HUD)
     ------------------------------------------------------------------------ */
  initCoordinatesHud() {
    const coordsEl = document.getElementById("hud-coordinates");
    const zoomEl = document.getElementById("hud-zoom");

    this.map.on("mousemove", (e) => {
      if (coordsEl) {
        coordsEl.textContent = `Lat: ${e.latlng.lat.toFixed(5)}° | Lon: ${e.latlng.lng.toFixed(5)}°`;
      }
    });

    this.map.on("zoomend", () => {
      if (zoomEl) {
        zoomEl.textContent = `Zoom: ${this.map.getZoom()}`;
      }
    });
  }

  /* ------------------------------------------------------------------------
     13. MODAIS
     ------------------------------------------------------------------------ */
  initModals() {
    const btnAbout = document.getElementById("btn-about");
    const modalAbout = document.getElementById("modal-about");
    const closeAbout = document.getElementById("btn-close-modal-about");

    if (btnAbout && modalAbout) {
      btnAbout.addEventListener("click", () => modalAbout.classList.add("active"));
    }
    if (closeAbout && modalAbout) {
      closeAbout.addEventListener("click", () => modalAbout.classList.remove("active"));
    }

    const btnStats = document.getElementById("btn-stats");
    const modalStats = document.getElementById("modal-stats");
    const closeStats = document.getElementById("btn-close-modal-stats");

    if (btnStats && modalStats) {
      btnStats.addEventListener("click", () => modalStats.classList.add("active"));
    }
    if (closeStats && modalStats) {
      closeStats.addEventListener("click", () => modalStats.classList.remove("active"));
    }

    document.querySelectorAll(".modal-overlay").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });
    });

    this.renderMetadataCatalogTable();
  }

  renderMetadataCatalogTable() {
    const tbody = document.getElementById("modal-metadata-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    this.config.layers.forEach((l) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="font-weight: 600;">${l.title}</td>
        <td><span class="source-badge badge-${l.source}">${l.source}</span></td>
        <td style="font-size: 0.75rem; color: var(--text-secondary);">${l.subsource}</td>
        <td><span style="font-size: 0.72rem; text-transform: capitalize;">${l.geomType}</span></td>
        <td style="font-weight: 700; text-align: right;">${l.count}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}
