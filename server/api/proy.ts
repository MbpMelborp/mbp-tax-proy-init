import { Bannerbear } from "bannerbear";
// const bb = new Bannerbear("bb_pr_7126adba45e09251352037c53b30b3");
// const bb = new Bannerbear("bb_pr_dd4e67d727afc7974c981480d962e6");
import images1 from "./images1.json";
import images2 from "./images2.json";
import images3 from "./images3.json";

export default defineEventHandler(async (event) => {
  // console.log(getQuery(event));
  const { api } = await readBody(event);
  const bb = new Bannerbear(api);

  if (event.req.method === "POST") {
    const { template, data, api } = await readBody(event);
    // const images = await bb.list_images(3);
    return { images: [...images1.images] };
  }
});
