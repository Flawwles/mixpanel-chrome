import { querySelectorAllDeep } from "query-selector-shadow-dom";

export default function findAllIds() {
  let ids = [];
  const target = querySelectorAllDeep("body > *");
  console.log(target);
  target.forEach(({ childNodes: [...nodes] }) =>
    nodes
      .filter(({ nodeType }) => nodeType === document.TEXT_NODE)
      .forEach(async (textNode) => {
        const regex = new RegExp(/entityId:/);
        if (regex.test(textNode.textContent)) {
          const subText = textNode.textContent.split(" ");
          subText.forEach(async (item) => {
            if (regex.test(item)) {
              console.log(item);
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
