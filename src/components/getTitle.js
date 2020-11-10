export default async function getTitle(id) {
    let qid = `Q${id}`;
    let jsonData = await makeRequest(id);
    const eninityTitle = jsonData.entities[qid].sitelinks.enwiki.title;
    return Promise.resolve(eninityTitle);
  }
  
  const makeRequest = async (ID) => {
    let wikidata = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=Q${ID}&sitefilter=enwiki&origin=*`
    ).catch(error => console.log(error.message));
    let wikidataJson = await wikidata.json();
    return wikidataJson;
  };
  