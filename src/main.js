import "./maplibre-gl-compare.js";
import "./maplibre-gl-compare.css";

var beforeMap = new maplibregl.Map({
  container: "before",
  style: "./styles/osm.json",
  center: [139.767, 35.681],
  zoom: 14,
  hash: true,
});

var afterMap = new maplibregl.Map({
  container: "after",
  style: "./styles/std.json",
  center: [139.767, 35.681],
  zoom: 14,
});

// A selector or reference to HTML element
var container = "#comparison-container";

var map = new maplibregl.Compare(beforeMap, afterMap, container, {});
