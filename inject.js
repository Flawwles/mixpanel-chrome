(function() {
    console.log('Running')
    async function getTitle(id) {
        let qid = `Q${id}`;
        let jsonData = await makeRequest(id);
        const eninityTitle = jsonData.entities[qid].sitelinks.enwiki.title;
        return Promise.resolve(eninityTitle);
      }
      
      const makeRequest = async (ID) => {
        let wikidata = await fetch(
          `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=Q${ID}&sitefilter=enwiki&origin=*`
        );
        let wikidataJson = await wikidata.json();
        return wikidataJson;
      };
      
     function findAllIds() {
        let ids = [];
        const target = document.querySelector('chart-legend').querySelector('mp-chart-legend').shadowRoot.querySelector('mp-items-menu').shadowRoot.querySelector('.screen-options-list')
        target
          .querySelectorAll("*:not(script):not(noscript):not(style)")
          .forEach(({ childNodes: [...nodes] }) =>
            nodes
              .filter(({ nodeType }) => nodeType === document.TEXT_NODE)
              .forEach(async (textNode) => {
                  console.log(textNode)
                var regex = new RegExp(/entityId:/g);
                if (regex.test(textNode.textContent)) {
                  const eninity = textNode.textContent.split(":");
                  ids.push({
                    id: eninity[1].trim(),
                    element: textNode
                  });
                }
              })
          );
      
        return ids;
      }
      
    const ids = findAllIds();
    const createObject = async (item) => {
        const name = await getTitle(item.id);
     return {
        ...item,
        name
     };
    };
    const getData = async () => {
    return Promise.all(ids.map((item) => createObject(item)));
    };

    getData().then((data) => {
    for (const item of data) {
        item.element.textContent = item.name;
    }
    console.log(data);
    console.log('LENGTH', data.length)
    });
})();