import "regenerator-runtime/runtime";
import findAllIds from "./components/findIds";
import getTitle from "./components/getTitle";

(function () {
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
      console.log(`Enities found: ${data.length}`);
    } else {
      console.log("Nothing to replace");
    }
  });
})();
