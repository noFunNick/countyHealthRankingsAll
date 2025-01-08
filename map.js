require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/Graphic"
  ], (Map, MapView, FeatureLayer, Legend, Graphic) =>  {
  

    const map = new Map({
      basemap: "gray-vector",
      layers: []
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-100.3487846, 39.58907],
      zoom: 3
    });
  
    const legend = new Legend({
      view: view
    });
   

    view.ui.add(legend, "bottom-left");
    var $table = $('#table')
    var queryField = "v122_rawvalue"
    var queryFieldDescription = "Uninsured Children"
    var fieldName = queryFieldDescription.replace(/ /g, "_").toLowerCase()
    var url = "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/County_Health_Rankings_2023/FeatureServer/2"
    
// Esri color ramps - Red 6
// #fef0d9ff,#fdcc8aff,#fc8d59ff,#e34a33ff,#b30000ff
const colors = ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"];
    var color1 = colors[0]
    var color2 = colors[1]
    var color3 =  colors[2]
    var color4 = colors[3] 
    var color5 = colors[4]
    const break1 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: color1,
      style: "solid",
      outline: {
        width: 0.2,
        color: [0, 0, 0, 0.5],
      },
    };
    const break2 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: color2,
      style: "solid",
      outline: {
        width: 0.2,
        color: [0, 0, 0, 0.5],
      },
    };
    const break3 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: color3,
      style: "solid",
      outline: {
        width: 0.2,
        color: [0, 0, 0, 0.5],
      },
    };
    const break4 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: color4,
      style: "solid",
      outline: {
        width: 0.2,
        color: [0, 0, 0, 0.5],
      },
    };
  
    const break5 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: color5,
      style: "solid",
      outline: {
        width: 0.2,
        color: [0, 0, 0, 0.5],
      },
    };
    
    var labelAdjective = "Uninsured"
    ////Use the variables above as your symbol properties of the class break infos property////
    const renderer = {
      type: "class-breaks", // autocasts as new ClassBreaksRenderer()
      field: "queryField",
      legendOptions: {
        title: "Percent of children without health insurance",
      },
      defaultSymbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "black",
        style: "backward-diagonal",
        outline: {
          width: 0.5,
          color: [50, 50, 50, 1],
        },
      },
      defaultLabel: "no data",
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 5,
          symbol: break1,
          label: "under 5% " + labelAdjective,
        },
        {
          minValue:5,
          maxValue: 10,
          symbol: break2,
          label: "5-10% " + labelAdjective,
        },
        {
          minValue:10,
          maxValue: 15,
          symbol: break3,
          label: "10-15% " + labelAdjective,
        },
        {
          minValue: 15,
          maxValue: 20,
          symbol: break4,
          label: "15-20% " + labelAdjective,
        },
        {
          minValue: 20,
          maxValue: 100000000,
          symbol: break5,
          label: "over 20% " + labelAdjective,
        },
      ],
    };
  ///this is where you'll query the service to add data to your table
  var graphics = []

  var url = new FeatureLayer({url: url,
    title: "County Health",
    popupTemplate: {
      // autocast as esri/PopupTemplate
      title: "{county}",
      content: queryFieldDescription + ": { " + queryField + " }"
    },
    opacity: 0.9})

  var loadData = new Promise((resolve, reject)=>{
    
    let query = url.createQuery();
    query.where = "OBJECTID < 2000"
    query.returnGeometry = true;
    query.outFields = [ queryField, "OBJECTID", "county", "state" ];

    url.queryFeatures(query)
    .then(function(response){
    console.log(response)
    response.features.forEach(function(feature, index){
        let gfx = new Graphic({
            geometry: feature.geometry,
            attributes: { "queryField": feature.attributes[queryField], "county": feature.attributes.county, "state": feature.attributes.state,  "ObjectId": feature.attributes.OBJECTID}                   
          });
          var state = feature.attributes.state
          var county = feature.attributes.county
          var qf = feature.attributes[queryField]     
          if(qf > 15|| qf < 2 && qf != null){
    $table.bootstrapTable('insertRow', {
                index: index,
                row: {
                  county: county,
                  state: state,
                  qf: qf
                }
                })
          }   
          graphics.push(gfx)         
            if(index == response.features.length -1){
                resolve()
            }
    })
    }); 

  
    }); 
    loadData.then(()=>{
      var loadMore = new Promise((resolve, reject)=>{
        let query2 = url.createQuery();
        query2.where = "OBJECTID >= 2000"
        query2.returnGeometry = true;
        query2.outFields = [ queryField, "OBJECTID", "county", "state" ];
    
        url.queryFeatures(query2)
        .then(function(response){
        console.log(response)
        response.features.forEach(function(feature, index){
            let gfx = new Graphic({
                geometry: feature.geometry,
                attributes: {"queryField": feature.attributes[queryField] , "county": feature.attributes.county, "state": feature.attributes.state,  "ObjectId": feature.attributes.OBJECTID}                   
              });
              var state = feature.attributes.state
              var county = feature.attributes.county
              var qf = feature.attributes[queryField]        
              graphics.push(gfx)
              if(qf > 15 || qf <2 && qf != null){
                $table.bootstrapTable('insertRow', {
                            index: index,
                            row: {
                              county: county,
                              state: state,
                              qf: qf
                            }
                            })
                      }  
                if(index == response.features.length -1){
                    resolve()
                }
        })
        }); 
      })
      loadMore.then(()=>{
        var fl = new FeatureLayer({
          title: "",
            source: graphics,
            objectIdField: "ObjectId",
            fields: [{
              name: "ObjectId",
              type: "oid"
            }, {
              name: "State",
              type: "string"
            }, 
            {
                name: "County",
                type: "string"
              }, {
                name: "queryField",
                type: "double"
              },        
        ],
            popupTemplate: {
              content: "State: {State} <br>" +
               "County: {County} <br>"+ 
               "queryField" + ": {qf}%" 
            },
            renderer: renderer
        }) 
        map.add(fl)
      console.log('map loaded')
      })

     })
  
  });