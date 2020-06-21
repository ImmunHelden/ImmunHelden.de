(function(WirVsVirusMap, $, L) {

  const Utils = {
    // Interpret a string as boolean value as good as we can.
    parseBool: function(string) {
      if (string) {
        switch (string.toLowerCase().trim()) {
          case "true": case "yes": case "1": case "on": return true;
          case "false": case "no": case "0": case "off": case null: return false;
          default: return Boolean(string);
        }
      }
      return false;
    },

    // Strip parameters and anchors from the given URL.
    parseBaseUrl: function(url) {
      const regex = /[^?#]+/g;
      const match = regex.exec(url);
      return match.hasOwnProperty('0') ? match[0] : null;
    },

    // Strip parameters and anchors from the given URL and cut everything
    // that follows the last sepaerator slash.
    parseBaseUrlDir: function(url) {
      const baseUrl = Utils.parseBaseUrl(url);
      return baseUrl.substring(0, baseUrl.lastIndexOf('/'));
    },

    // Parse URL parameters into a key-value collection.
    parseUrlParams: function(url) {
      const regex = /[?&]([^=#]+)=([^&#]*)/g;
      let params = {};
      let match;
      while(match = regex.exec(url)) {
        params[match[1]] = match[2];
      }
      return params;
    },

    // Parse the anchor string of the given URL.
    parseAnchor: function(url) {
      const apos = url.lastIndexOf('#');
      return (apos > 0 && apos < url.length - 1) ? url.substring(apos + 1) : null;
    },

    // Guess whether or not we are living inside an iframe.
    guessIFrame: function() {
      return window.location !== window.parent.location;
    },

    // Load the given resource asynchronously and return plain text content.
    loadPlain: function(fileUrl) {
      return new Promise(function(resolve, reject) {
        $.ajax({ url: fileUrl })
          .fail(() => reject("Error querying " + fileUrl))
          .done(content => resolve(content));
      });
    },

    // Load the given resource asynchronously and return parse as JSON even if
    // the MIME type didn't indicate it.
    loadJson: function(fileUrl) {
      return new Promise(function(resolve, reject) {
        $.ajax({ url: fileUrl })
          .fail(() => reject("Error querying " + fileUrl))
          .done(content => {
            resolve((typeof content === 'string') ? JSON.parse(content) : content);
          });
      });
    },

    // Apply the given predicate function to each terminal point in a GeoJSON
    // feature geometry.
    forEachPoint: function(geometry, predicate) {
      if (geometry.length == 2 && !geometry[0].hasOwnProperty("length")) {
        predicate(geometry);
      }
      else {
        for (var component of geometry) {
          forEachPoint(component, predicate);
        }
      }
    },

    isInteger: function(N) {
      return !isNaN(N) && parseInt(Number(N)) == N && !isNaN(parseInt(N, 10));
    }
  };

  const hostBaseUrl = Utils.parseBaseUrlDir(window.location.href);

  const defaultIcon = {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  };

  const defaultBaseLayer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png',
    { attribution:
      '<a href="https://carto.com/help/building-maps/basemap-list/">Map tiles by Carto under CC BY 3.0</a> | ' +
      '<a href="http://osm.org/copyright">Data by OpenStreetMap under ODbL</a> | ' +
      'Icons by <a target="_blank" href="https://icons8.de">Icons8</a>'
    });

  const defaultSettings = {
    embedded: Utils.guessIFrame(),
    lockLink: '/',
    center: [51.5, 10],
    zoom: 6,
    baseLayer: defaultBaseLayer,
    platforms: [
      //{
      //name: 'Default',
      //sources: [
        { name: 'Default', restBaseUrl: hostBaseUrl, icon: defaultIcon }
      //]
      //}
    ],
    selectPlatformsControl: true,
    selectPlatformsTitle: "Anzeigen und Gesuche"
  };

  const Pin = {
    // Public static helper function
    isValidInfo: (I) => {
      const invalidInfo = (info, message) => {
        console.warn("Encountered invalid item in response:", message, info);
        return false;
      };
      if (!I.hasOwnProperty("latlng") || !I.latlng.hasOwnProperty("length") || I.latlng.length != 2)
        return invalidInfo(I, 'Expected pin property "latlng" to be an array with 2 elements');
      if (!parseFloat(I.latlng[0]) || !parseFloat(I.latlng[1]))
        return invalidInfo(I, 'Expected elements of pin property "latlng" to be floating point numbers');
      if (!I.hasOwnProperty("title"))
        return invalidInfo(I, 'Expected string value in pin property "title"');
      return true;
    },

    _createPopupElem: (title, onClick) => {
      // Embed HTML into an extra <div> for jQuery to work.
      const container = $(
        '<div>' +
        '  <div class="popup-pin">' +
        '    <h2><a href="javascript:void(0)">' + title + '</a></h2>' +
        '  </div>' +
        '</div>');

      $('div.popup-pin a', container).on('click', onClick);

      // Select non-wrapped content and return raw DOM element.
      return $('div.popup-pin', container)[0];
    },

    _transformLink: (elem) => {
      const targetUrl = $(elem).attr('href');
      if (targetUrl && targetUrl.hasOwnProperty('length') && targetUrl.length > 0) {
        if (targetUrl.charAt(0) == '#') {
          // Anchors refer to current base URL. Only used for permalinks so far.
          $(elem).attr('href', hostBaseUrl + targetUrl);
        }
      }
    },

    _populateDetails: (plainHtml) => {
      const details = $(
        '<div>' +
          '<base href="' + hostBaseUrl + '/" target="_blank">' +
          '<link rel="stylesheet" href="details.css">' +
          plainHtml +
        '</div>');

      details.find('a').each((i, elem) => Pin._transformLink(elem));

      // Return as HTML, because it goes into the iframe.
      return details.html();
    },

    Instance: function(info, id, map, handlers) {
      this.latlng = L.latLng(info.latlng);
      this.platformIdx = info.platformIdx;

      // TODO: Should we have a platform abstraction?
      const icon = new L.Icon(map.platform(info.platformIdx).icon);
      this.marker = L.marker(this.latlng, { icon: icon });
      this.marker.on('click', handlers.onClickMarker);

      this.popup = this.marker.bindPopup(Pin._createPopupElem(info.title, handlers.onClickPopup));
      this.elem = $(this.popup.addTo(map.leaflet()).getElement());

      let detailsHtml = null;
      this.fetchDetails = () => {
        return new Promise((resolve, reject) => {
          if (detailsHtml) {
            resolve(detailsHtml);
            return;
          }

          const platform = map.platform(info.platformIdx);
          const src = platform.restBaseUrl + "/details/" + id;
          Utils.loadPlain(src).then(
            html => {
              detailsHtml = Pin._populateDetails(html);
              resolve(detailsHtml);
            },
            err => {
              reject(src + " responded '" + err + "'");
            }
          );
        });
      };

      return this;
    }
  };


  function _isValidElement(elem) {
    if (typeof elem !== 'string' || elem.length == 0) {
      console.error('Please pass the ID of the DOM element to host WirVsVirusMap as first argument.');
      return false;
    }

    if ($('#' + elem).length == 0) {
      console.error('Cannot find DOM element to host WirVsVirusMap. ' +
                    'Try adding this to your HTML: <div id="' + elem + '"></div>');
      return false;
    }

    return true;
  };

  function _makePlatformsControl(map, platforms, title) {
    const create = (tag, parent) => {
      const elem = document.createElement(tag);
      parent.appendChild(elem);
      return elem;
    };

    return L.Control.extend({
      onAdd: function(leafletMap) {
        // TODO: May be easier with jQuery.
        const div = L.DomUtil.create('div');
        L.DomUtil.addClass(div, 'leaflet-bar');
        L.DomUtil.addClass(div, 'platforms-control');

        const table = create('table', div);
        if (title && title.length > 0) {
          table.innerHTML = '<tr><th>' + title + '</th></tr>';
        }

        for (let i = 0; i < platforms.length; i++) {
          const label = create('label', create('td', create('tr', table)));
          const checkbox = create('input', label);
          checkbox.type = 'checkbox';
          checkbox.checked = true;
          checkbox.addEventListener('change', () => map.togglePlatform(checkbox, i));
          const contents = create('span', label);
          contents.className = 'checkbox';
          contents.innerHTML = platforms[i].name;
        }

        return div;
      }
    });
  }

  const internalPaneClass =
      ".wvvm-root div.pane {" +
      "  display: flex;" +
      "  flex-direction: column;" +
      "  position: absolute;" +
      "  z-index: 9000;" +
      "  top: 0;" +
      "  right: 0;" +
      "  width: {0}px;" +
      "  bottom: 0px;" +
      "}" +
      "@media only screen and (max-width: 599px) {" +
      "  .wvvm-root div.pane {" +
      "    width: 100%;" +
      "    z-index: 10100;" +
      "  }" +
      "}";

  function emitInternalPaneCSS(pane) {
    let sheet = document.createElement('style');
    sheet.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(sheet);
    pane.CSS = sheet.appendChild(document.createTextNode(''));
    pane.update = () => {
      pane.CSS.nodeValue = internalPaneClass.replace(/\{0\}/, pane.width);
    };
  }

  const externalPaneClass =
      ".wirvsvirusmap-pane {" +
      "  position: absolute;" +
      "  top: {1}px;" +
      "  right: 0;" +
      "  width: {0}px;" +
      "  bottom: 2rem;" +
      "  z-index: 11000;" +
      "  overflow: scroll;" +
      "}" +
      "@media only screen and (max-width: 599px) {" +
      "  .wirvsvirusmap-pane {" +
      "    width: 100%;" +
      "    background: #fff;" +
      "  }" +
      "}";

  function emitExternalPaneCSS(pane) {
    let sheet = document.createElement('style');
    sheet.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(sheet);
    pane.CSS = sheet.appendChild(document.createTextNode(''));
    pane.update = () => {
      pane.CSS.nodeValue = externalPaneClass.replace(/\{0\}/, pane.width)
                                            .replace(/\{1\}/, pane.top);
    };
  }

  function _populateMapDom(map, container, settings) {
    // TODO: This is all quite complicated.
    const mdom = {};
    mdom.root = $('#' + container).addClass('wvvm-root')
        .append('<div id="osm-map-canvas"></div>')
        .append('<div id="osm-map-pane" class="pane"></div>');

    if (settings.embedded) {
      const href = settings.lockLink || '/';
      mdom.root.append('<a href="' + href + '" target="_parent" class="lock"></a>');
    }

    mdom.canvas = $('#osm-map-canvas');
    mdom.lock = $('.wvvm-root > div.lock');
    mdom.pane = $('.wvvm-root > div.pane')
        .append('<iframe allowtransparency="true"></iframe>')
        .append('<a href="javascript:void(0)">Einklappen &gt;&gt;</a>');
    mdom.pane.hide();

    $('.wvvm-root > div.pane > a').on('click', () => map.closeDetailsPane());

    mdom.paneDetails = $('.wvvm-root > div.pane > iframe');
    mdom.paneClose = $('.wvvm-root > div.pane > a');

    return mdom;
  }

  WirVsVirusMap.Instance = function(domElementName, actualSettings) {
    if (!_isValidElement(domElementName))
      return;

    const controls = {};
    const settings = { ...defaultSettings, ...actualSettings };
    const dom = _populateMapDom(this, domElementName, settings);
    const allPinsById = {};

    // TODO: We can choose the element ID and it must not clash with existing elements.
    const map = new L.map('osm-map-canvas', {
      center: settings.center,
      zoom: settings.zoom,
      zoomControl: !settings.embedded
    });

    settings.baseLayer.addTo(map);

    if (settings.selectPlatformsControl) {
      const title = settings.selectPlatformsTitle;
      L.Control.Platforms = _makePlatformsControl(this, settings.platforms, title);
      controls.platformsView = new L.Control.Platforms({ position: 'bottomleft' });
      controls.platformsView.addTo(map);
    }

    const internalPane = { width: 0, CSS: null, update: null };
    const externalPane = { top: 0, width: 0, CSS: null, update: null };
    const updatePaneWidth = (px) => {
      internalPane.width = px;
      internalPane.update();
      externalPane.width = px;
      externalPane.update();
    };
    const _staticInitPositions = () => {
      emitInternalPaneCSS(internalPane);
      internalPane.width = 400;
      internalPane.update();

      emitExternalPaneCSS(externalPane);
      externalPane.width = 400;
      externalPane.update();

      // Top position is determined dynamically once layouting is done.
      // Hack: Wait that happened.
      const eventuallySetExternalPaneCSS = (delay) => {
        const pane = $('#osm-map-pane');
        const dynVertPos = pane.position().top + pane.offset().top;
        if (dynVertPos == 0) {
          console.log("Wait until layouting is done..", delay);
          setTimeout(() => eventuallySetExternalPaneCSS(delay * 2), delay);
        } else {
          externalPane.top = dynVertPos;
          externalPane.update();
        }
      };

      eventuallySetExternalPaneCSS(10);
    };

    // When zooming or moving the map, the selected pin might get hidden behind
    // other pins. Always bring it front afterwards.
    let selectedPinId = null;
    map.on('moveend', () => {
      console.log('moveend', selectedPinId);
      if (selectedPinId && allPinsById.hasOwnProperty(selectedPinId)) {
        _getMarker(selectedPinId).getElement().style.zIndex = 10000;
      }
    });

    // TODO: Should we return pins-by-id as a result per promise and merge them in hindsight?
    // TODO: Should we wait for all promises or start showing pins one by one?
    const pinsReady = [];
    for (let i = 0; i < settings.platforms.length; i++) {
      const asyncLoad = Utils.loadJson(settings.platforms[i].restBaseUrl + '/pins');
      pinsReady.push(asyncLoad.then(pinsById => {
        for (let id in pinsById) {
          if (Pin.isValidInfo(pinsById[id])) {
            pinsById[id].platformIdx = i;

            // TODO: Silent race condition for clashing IDs.
            allPinsById[id] = new Pin.Instance(pinsById[id], id, this, {
              onClickPopup: () => _viewDetailsForPin(id),
              onClickMarker: () => {
                selectedPinId = id;
                _mayViewDetailsForPin(id);
              }
            });
          }
        }
      }));
    }

    // TODO: Get back code to load regions
    const regionsReady = new Promise((resolve, reject) => resolve());

    const _openDetailsPane = (width) => {
      const w = width || 400;
      updatePaneWidth(w);

      dom.paneDetails.attr('srcdoc', '');
      dom.pane.show();
      dom.canvas.css('width', 'calc(100% - ' + w + 'px)');
      map.invalidateSize();
      this.onOpenDetailsPane();
    };

    const _closeDetailsPane = () => {
      dom.pane.hide();
      dom.canvas.css("width", "100%");
      map.invalidateSize();
      this.onCloseDetailsPane();
    };

    const _viewDetailsForPin = (id) => {
      if (!allPinsById.hasOwnProperty(id)) {
        console.error("Requested invalid ID");
        return;
      }

      _openDetailsPane();
      dom.paneDetails.attr("srcdoc", '<img src="../../images/spin_loading.gif" style="width:100%;">');

      const pin = allPinsById[id];
      map.panTo(pin.latlng);

      // TODO: Review sandboxing options.
      pin.fetchDetails().then(
        html => {
          dom.paneDetails.attr("srcdoc", html);
          this.onViewDetails(id);
        },
        err => {
          console.error("Failed to fetch pin details:", err);
          _closeDetailsPane();
        }
      );
    }

    function _mayViewDetailsForPin(id) {
      if (!settings.embedded && window.innerWidth >= 600) {
        _viewDetailsForPin(id);
      }
    }

    function _focusPin(id) {
      allPinsById[id].popup.openPopup();
      _mayViewDetailsForPin(id);
      map.flyTo(allPinsById[id].latlng, 12, {
        animate: true,
        duration: 3
      });
    }

    function _getMarker(id) {
      return allPinsById[id].marker;
    }

    function togglePlatform(checkbox, platformIdx) {
      const show = $(checkbox).is(':checked');
      console.log(settings.platforms[platformIdx].name,
                  (show ? "ein" : "aus") + "blenden");

      const toggle = show ? (e => e.show()) : (e => e.hide());
      for (const id in allPinsById) {
        if (allPinsById[id].platformIdx == platformIdx) {
          toggle(allPinsById[id].elem);
        }
      }
    }

    this.focusPin = (id) => {
      if (allPinsById.hasOwnProperty(id)) {
        _focusPin(id);
        return _getMarker(id);
      } else {
        console.error('Cannot focus pin, ID not found:', id);
        return null;
      }
    };

    this.getMarker = (id) => {
      if (allPinsById.hasOwnProperty(id)) {
        return _getMarker(id);
      } else {
        console.error('Cannot provide marker, ID not found:', id);
        return null;
      }
    };

    this.togglePlatform = togglePlatform;
    this.viewDetailsForPin = _viewDetailsForPin;
    this.openDetailsPane = _openDetailsPane;
    this.closeDetailsPane = _closeDetailsPane;

    this.oncePinsReady = (action) => {
      Promise.all(pinsReady).then(action);
    };

    this.onOpenDetailsPane = () => {};
    this.onCloseDetailsPane = () => {};
    this.onViewDetails = (id) => {};

    this.leaflet = () => { return map; };
    this.platform = (idx) => { return settings.platforms[idx]; }

    $(document).ready(_staticInitPositions);

    return this;
  }

  WirVsVirusMap.Utils = Utils;

})(window.WirVsVirusMap = window.WirVsVirusMap || {}, jQuery, L);

/*


function isRegionVisible(ags, zoom) {
  return false;

  if (zoom < 6) {
    // Bundesländer
    return ags.length == 2;
  }
  else { //if (zoom < 8) {
    // Landkreise
    return ags.length == 4 || ags.length == 5;
  }
  //else {
  //  // Landkreise und Berliner Bezirke
  //  return ags.length > 2 && ags != "11000";
  //}
  //return false;
}

  var allRegionsByAgs = {};

  function viewDetailsR(ags) {
    if (!allRegionsByAgs.hasOwnProperty(ags)) {
      console.error("Requested invalid region", ags);
      return;
    }

    wvv.dom.paneDetails.html('<img src="../../images/spin_loading.gif"  style="width:100%;">');
    wvv.dom.pane.show();
    wvv.dom.canvas.css("width", "calc(100% - 400px)");

    const regionInfo = allRegionsByAgs[ags];
    console.log(regionInfo);

    // TODO: if there's space left for the map at all
    wvv.map.invalidateSize();
    wvv.map.panTo(regionInfo.center);
    //$("#platforms-pane").hide();

    if (regionInfo.idsByPlatform.length == 0) {
      const text = "<b>Leider liegen für diese Postleitzahlen bis jetzt keine Angebote vor:</b><br>" +
                    regionInfo.zips.join(", ");

      wvv.dom.paneDetails.html('<div style="padding: 1rem;">' + text + '</div>');
    }
    else if (regionInfo.hasOwnProperty("cachedDetails")) {
      // TODO: select the divs to show!
      wvv.dom.paneDetails.html(regionInfo.cachedDetails);
    }
    else {
      // Select platforms that have IDs for the region and request details.
      const contentReady = [];
      const idxs = [];
      const ids = regionInfo.idsByPlatform;
      for (let i = 0; i < ids.length; i++) {
        if (ids[i] && ids[i].hasOwnProperty('length') && ids[i].length > 0) {
          contentReady.push(loadPlain(settings.platforms[i].restBaseUrl + "/details/" + ids[i].join(',')));
          //contentReady.push(loadPlain(platforms[i].url + "/details_html?ids=" + ids[i].join(',')));
          idxs.push(i);
        }
      }

      // We should have bailed out early in this case!
      if (contentReady.length == 0) {
        console.error("[Internal] IDs by platform cannot be empty at this point", regionInfo);
        return;
      }

      // Once all platforms responded, display their content.
      Promise.all(contentReady).then(
        function(htmls) {
          // TODO: Select the relevant DIVs (for static hosting, we always get all details)
          //const snippets = [];
          //for (let i = 0; i < idxs.length; i++) {
          //  const platformIdx = idxs[i];
          //  for (const id of regionInfo.idsByPlatform[platformIdx]) {
          //    const elem = $('#' + id, '<div>' + htmls[i] + '</div>');
          //    snippets.push(elem.html());
          //  }
          //}
          regionInfo.cachedDetails = htmls;
          wvv.dom.paneDetails.html(htmls);
        },
        err => closeDetails()
      );
    }
  }






  //  function asset(name) {
  //    const assetsBaseUrl = 'https://raw.githubusercontent.com/ImmunHelden/WirVsVirusMap/master/assets';
  //    return [ assetsBaseUrl, name ].join('/');
  //  }

  //    loadJson('assets/zipcodes.de.json').then(zipCodes => {
  //      const reg = {};
  //      for (const entry of zipCodes) {
  //        if (!reg.hasOwnProperty(entry.zipcode))
  //          reg[entry.zipcode] = { "ags": entry.community_code, "latlngs": [] };
  //        reg[entry.zipcode].latlngs.push([parseFloat(entry.latitude), parseFloat(entry.longitude)]);
  //      }
  //      console.log(JSON.stringify(reg));
  //    });

  var regionsByAgsReady = loadJson(asset('Karte_de_geodata.geo.json')).then(geoJson => {
    var geoJsonLayer = L.geoJSON(geoJson).addTo(wvv.map);
    geoJsonLayer.eachLayer(function (layer) {
      var lnglatRange = [[90, -90], [180, -180]];
      forEachPoint(layer.feature.geometry.coordinates, lnglat => {
        for (var i = 0; i < lnglat.length; i++) {
          if (lnglat[i] < lnglatRange[i][0]) // min
            lnglatRange[i][0] = lnglat[i];
          if (lnglat[i] > lnglatRange[i][1]) // max
            lnglatRange[i][1] = lnglat[i];
        }
      });

      var centerLatLng = L.latLng((lnglatRange[1][1] + lnglatRange[1][0]) / 2,
                                  (lnglatRange[0][1] + lnglatRange[0][0]) / 2);

      if (allRegionsByAgs.hasOwnProperty(layer.feature.properties.ags))
        console.warn("Duplicate ags?", layer.feature.properties.ags);

      var domElement = $(layer.getElement());
      allRegionsByAgs[layer.feature.properties.ags] = {
        elem: domElement,
        center: centerLatLng,
        name: layer.feature.properties.name,
        fill: domElement.css("fill"),
        opacity: domElement.css("fill-opacity"),
        zips: [],
        idsByPlatform: []
      };

      layer.on('mouseover', function (e) {
        var region = allRegionsByAgs[layer.feature.properties.ags];
        region.elem.css("fill", "#00C0C0");
        region.elem.css("fill-opacity", "0.2");
        console.log(layer.feature.properties.ags);
      });
      layer.on('mouseout', function (e) {
        var region = allRegionsByAgs[layer.feature.properties.ags];
        region.elem.css("fill", region.fill);
        region.elem.css("fill-opacity", region.opacity);
      });
      layer.on('click', function (e) {
        var region = allRegionsByAgs[layer.feature.properties.ags];
        var clickHandler = "viewDetailsR('" + layer.feature.properties.ags + "');";
        var popupContent = renderPreviewHtml(region.name, clickHandler);
        L.popup().setLatLng(region.center).setContent(popupContent).openOn(wvv.map);
        eval(clickHandler);
      });
    });

    var updateVisibleRegions = function() {
      var zoom = wvv.map.getZoom();
      for (var ags in allRegionsByAgs) {
        if (isRegionVisible(ags, zoom)) {
          allRegionsByAgs[ags].elem.show();
        }
        else {
          allRegionsByAgs[ags].elem.hide();
        }
      }
    };

    wvv.map.on('zoomend', updateVisibleRegions);
    updateVisibleRegions();
  });

  var zip2argsReady = loadJson(asset('zip2ags.json'));

  let idsByZipCodeReady = [];
  for (let i = 0; i < settings.platforms.length; i++) {
    idsByZipCodeReady.push(loadJson(settings.platforms[i].restBaseUrl + "/regions"));
  }

  const maxIdsPerRegionSize = { "2": 1, "5": 1 };

  function registerIdsInRegion(ags, ids, platformIdx) {
    if (allRegionsByAgs.hasOwnProperty(ags)) {
      const regionIds = allRegionsByAgs[ags].idsByPlatform;
      // JS will extend array as necessary
      const platformIds = regionIds[platformIdx] || [];
      //const platformIds = existing ? regionIds[platformIdx] : [];
      regionIds[platformIdx] = platformIds.concat(ids);
      maxIdsPerRegionSize[ags.length] =
          Math.max(maxIdsPerRegionSize[ags.length],
                    regionIds[platformIdx].length);
      return true;
    }
    return false;
  }

  function registerZipInRegion(ags, zip) {
    if (!allRegionsByAgs.hasOwnProperty(ags))
      return false;
    allRegionsByAgs[ags].zips.push(zip);
    return true;
  };


  var regionsReady = Promise.all(idsByZipCodeReady.concat([zip2argsReady, regionsByAgsReady]))
          .then(function (values) {
    if (settings.platforms.length != values.length - 2) {
      console.error("[Internal] Invalid promise results order");
      return;
    }

    // Result from zip2argsReady. The regionsByAgsReady promise has no return value.
    // The first platforms.length elements are IDs by ZIP
    const zip2ags = values[values.length - 2];
    const idsByZipCode = values;

    // TODO: Handle/detect overlap in IDs between different platforms!
    for (let i = 0; i < settings.platforms.length; i++) {
      for (const zip in idsByZipCode[i]) {
        const entry = idsByZipCode[i][zip];

        // Determine AGS code for given ZIP and validate.
        if (!zip2ags.hasOwnProperty(zip)) {
          console.warn("Unknown ZIP code", zip, "Dropping IDs", entry);
          continue;
        }
        const ags = zip2ags[zip].ags;
        if (!allRegionsByAgs.hasOwnProperty(ags)) {
          console.warn("Unknown AGS code", ags, "for zip", zip, "Dropping IDs", entry);
          continue;
        }

        if (!registerIdsInRegion(ags.substr(0, 2), entry, i)) {
          console.warn("Invalid AGS Bundesland prefix in", ags, "Dropping IDs", entry);
        }
        if (!registerIdsInRegion(ags.substr(0, 5), entry, i)) {
          console.warn("Invalid AGS Landkreis prefix in", ags, "Dropping IDs", entry);
        }
        if (ags.length > 5) {
          // TODO: We may have/use a more detailed encoding in the future.
          console.log("AGS code provides further region encoding", ags);
        }
      }
    }

    for (const zip in zip2ags) {
      var ags = zip2ags[zip].ags;
      if (!allRegionsByAgs.hasOwnProperty(ags)) {
        console.error("[Internal] Unknown AGS code", ags, "for zip", zip);
        continue;
      }
      if (!registerZipInRegion(ags.substr(0, 2), zip)) {
        console.error("[Internal] Invalid AGS Bundesland prefix in", ags);
      }
      if (!registerZipInRegion(ags.substr(0, 5), zip)) {
        console.error("[Internal] Invalid AGS Landkreis prefix in", ags);
      }
    }

    const numIds = function(region) {
      let sum = 0;
      for (const ids of region.idsByPlatform)
        sum += ids ? ids.length : 0;
      return sum;
    }

    for (var ags in allRegionsByAgs) {
      const region = allRegionsByAgs[ags];
      const strength = numIds(region) / maxIdsPerRegionSize[ags.length];
      region.opacity = strength * 0.5;
      region.elem.css("fill-opacity", region.opacity);
    }
  });

*/
