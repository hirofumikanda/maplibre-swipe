import "./maplibre-gl-compare.js";
import "./maplibre-gl-compare.css";

var beforeMap = new maplibregl.Map({
  container: "before",
  style: "./styles/rekichizu.json",
  center: [139.767, 35.681],
  zoom: 14,
  hash: true,
});

var afterMap = new maplibregl.Map({
  container: "after",
  style: "./styles/gsi_std.json",
  center: [139.767, 35.681],
  zoom: 14,
});

// A selector or reference to HTML element
var container = "#comparison-container";

var map = new maplibregl.Compare(beforeMap, afterMap, container, {});

afterMap.on("load", async () => {
  afterMap.addControl(new maplibregl.NavigationControl());
});

function setupContextMenuHandler(map) {
  map.on("contextmenu", (e) => {
    const features = map.queryRenderedFeatures(e.point);
    resetHighlightLayers(map);

    if (features.length > 0) {
      console.log("フィーチャ数：" + features.length);
      for (const feature of features) {
        console.log("レイヤーID：" + feature.layer.id);
        console.log("フィーチャID：" + feature.id);
        console.log(JSON.stringify(feature.properties, null, 2));
      }

      const lineFeatures = features.filter(
        (f) => "layer" in f && f.layer.type === "line"
      );
      if (lineFeatures.length > 0) {
        map.getSource("highlight-source-line").setData({
          type: "FeatureCollection",
          features: lineFeatures,
        });
      }

      const fillFeatures = features.filter(
        (f) => "layer" in f && f.layer.type === "fill" && f.layer.id !== "land"
      );
      if (fillFeatures.length > 0) {
        map.getSource("highlight-source-fill").setData({
          type: "FeatureCollection",
          features: fillFeatures,
        });
      }
    }
  });
}

function resetHighlightLayers(map) {
  // Line layer
  if (map.getSource("highlight-source-line")) {
    map.removeLayer("highlight-layer-line");
    map.removeSource("highlight-source-line");
  }
  map.addSource("highlight-source-line", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });
  map.addLayer({
    id: "highlight-layer-line",
    type: "line",
    source: "highlight-source-line",
    paint: {
      "line-color": "rgb(255, 0, 0)",
      "line-width": 2,
      "line-opacity": 0.8,
    },
  });

  // Fill layer
  if (map.getSource("highlight-source-fill")) {
    map.removeLayer("highlight-layer-fill");
    map.removeSource("highlight-source-fill");
  }
  map.addSource("highlight-source-fill", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });
  map.addLayer({
    id: "highlight-layer-fill",
    type: "fill",
    source: "highlight-source-fill",
    paint: {
      "fill-outline-color": "rgb(255, 0, 0)",
    },
  });
}

// 両方のマップに適用
setupContextMenuHandler(beforeMap);
setupContextMenuHandler(afterMap);
