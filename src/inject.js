import { querySelectorAllDeep, querySelectorDeep } from 'query-selector-shadow-dom';

(function () {

  const testDom = querySelectorAllDeep(".column-cell");
  console.log(testDom);

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
    const target = document
      .querySelector("chart-legend")
      .querySelector("mp-chart-legend")
      .shadowRoot.querySelector("mp-items-menu")
      .shadowRoot.querySelector(".screen-options-list");
    target
      .querySelectorAll("*:not(script):not(noscript):not(style)")
      .forEach(({ childNodes: [...nodes] }) =>
        nodes
          .filter(({ nodeType }) => nodeType === document.TEXT_NODE)
          .forEach(async (textNode) => {
            const regex = new RegExp(/entityId:/);
            if (regex.test(textNode.textContent)) {
              const subText = textNode.textContent.split(" ");
              subText.forEach(async (item) => {
                if (regex.test(item)) {
                  const eninityArry = item.split(":");
                  const eninityId = eninityArry[1].split(" ")[0];
                  ids.push({
                    id: eninityId,
                    element: textNode,
                    preString: `entityId:${eninityId}`,
                  });
                }
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
      name,
    };
  };
  const getData = async () => {
    return Promise.all(ids.map((item) => createObject(item)));
  };
  getData().then((data) => {
    for (const item of data) {
      console.log(`Replacing ${item.preString} to ${item.name}`);
      item.element.textContent = item.element.textContent.replace(
        item.preString,
        item.name
      );
    }
    if (data.length > 0) {
      console.log(data);
      console.log(data.length);
    } else {
      console.log("Nothing to replace");
    }
  });
})();

