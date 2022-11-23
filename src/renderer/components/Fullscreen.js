import React, {
    useState,
    useEffect,
    useRef
  } from 'react';
  import {
    Map,
    View
  } from 'ol';
  import {
    Vector as VectorSource
  } from 'ol/source';
  import {
    Vector as VectorLayer
  } from 'ol/layer';
  import { getCenter } from 'ol/extent';
  import 'ol/ol.css';
  import ImageLayer from 'ol/layer/Image';
  import Static from 'ol/source/ImageStatic';
  import Projection from 'ol/proj/Projection';
  import { defaults as defaultInteractions, DragZoom } from 'ol/interaction.js';
  import Draw from 'ol/interaction/Draw';
  
  
  
  function Fs({sourceURI}) {
    const [map, setMap] = useState();
    const mapElement = useRef(null);
    const mapRef = useRef(null);
    mapRef.current = map;
  
    useEffect(() => {
        //get height and widht of image in sourceuri
        var img = new Image();
        img.src = sourceURI;
        img.onload = function() {
            var width = img.width;
            var height = img.height;
            //create projection
            
  
        const extent = [0, 0, width, height];
      
  
        const projection = new Projection({
            code: 'xkcd-image',
            units: 'pixels',
            extent: extent,
        });
        const initialMap = new Map({
            target: mapElement.current,
            layers: [
                new ImageLayer({
                    source: new Static({
                        url: sourceURI? sourceURI : '../../../assets/notfound.png',
                        projection: projection,
                        imageExtent: extent,
                    })
                })
            ],
            view: new View({
                projection: projection,
                center: getCenter(extent),
                zoom: 2,
            }),
        
            
      
        });
        let draw = new DragZoom({
            condition: function (event) {
                return event.type == 'pointerdown' && event.originalEvent.shiftKey;
            }
        });
        initialMap.addInteraction(draw);
        initialMap.updateSize();
        draw.on('boxend', function () {
            let extent = draw.getGeometry().getExtent();
            initialMap.getView().fit(extent, initialMap.getSize());
        });
        draw.on('boxstart', function () {
            draw.setActive(true);
        });
        draw.on('boxdrag', function () {
            draw.setActive(true);
        });
        setMap(initialMap);
  
        
        console.log(mapElement);
    }
    }, []);

  
    return (
    <div style = {{ height: '90vh', width: '96vw'}} ref = {mapElement} className = "map-container" />
);
  
  }
  
  export default Fs;