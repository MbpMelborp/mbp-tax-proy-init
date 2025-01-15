import { Bannerbear } from "bannerbear";
// const bb = new Bannerbear("bb_pr_7126adba45e09251352037c53b30b3");
// const bb = new Bannerbear("bb_pr_dd4e67d727afc7974c981480d962e6");

export default defineEventHandler(async (event) => {
  // console.log(getQuery(event));
  const { api } = await readBody(event);
  const bb = new Bannerbear(api);
  if (event.req.method === "GET") {
    if (getQuery(event).images === "1") return { images: await bb.list_images() };
    if (getQuery(event).templates === "1") return { templates: await bb.list_templates() };
    if (getQuery(event).template) {
      const template = getQuery(event).template;
      if (typeof template === "string") {
        return { template: await bb.get_template(template) };
      }
    }
  }
  if (event.req.method === "POST") {
    const { template, data, api } = await readBody(event);

    const body: any[] = [];
    data.forEach((element: any, index: number) => {
      let obj: {
        name: any[];
        color?: string[];
        background?: string[];
        text?: string[];
        image_url?: string[];
      } = { name: [element["name"]] };
      let arr = [];
      Object.keys(element).forEach((key) => {
        // body.push(key);
        if (key != "name") {
          if (key == "color") {
            obj[key] =
              element[key].active == false
                ? [null]
                : element[key].color.map((color_el: { hex: string }): string => {
                    return color_el.hex;
                  });
          }
          if (key == "background") {
            obj[key] =
              element[key].active == false
                ? [null]
                : element[key].color.map((color_el: { hex: string }): string => {
                    return color_el.hex;
                  });
          }
          if (key == "text") {
            obj[key] = element[key] == "" ? [null] : element[key];
          }
          if (key == "image_url") {
            obj[key] = element[key] == "" ? [null] : element[key];
          }
        }
      });
      body.push(obj);
    });
    // organizar el arreglo
    const variaciones: any[] = [];
    body.forEach((modificacion, index) => {
      console.log("modificacion \n", modificacion, "\n");
      variaciones[index] = desag(modificacion);
    });

    const combinaciones = variaciones.reduce((a, b) =>
      a.reduce((r: any, v: any) => r.concat(b.map((w: any) => [].concat(v, w))), [])
    );
    console.log("Cantidad de combinaciones : \n", combinaciones.length, combinaciones);
    interface Modification {
      name: string[];
      color?: string[] | null;
      background?: string[] | null;
      text?: string[] | null;
      image_url?: string[] | null;
    }

    const promises: Promise<any>[] = combinaciones.map((combinacion: Modification[]) => {
      return bb
        .create_image(
          template,
          {
            modifications: combinacion,
          },
          true
        )
        .catch((err: any) => {
          console.log("err ", err);
          return err;
        });
    });
    const images = await Promise.all(promises);
    return { combinaciones, images };
  }
});

// create a new object based on combinations of the arrays
interface Modification {
  name: string[];
  color?: string[] | null;
  background?: string[] | null;
  text?: string[] | null;
  image_url?: string[] | null;
}

interface DesagResult {
  [key: string]: string | null;
}

function desag(array: Modification): DesagResult[] {
  const result: DesagResult[] = [];
  const keys = Object.keys(array) as (keyof Modification)[];
  const values = keys.map((key) => array[key]);

  const total = values.reduce((a, b) => a * (b ? b.length : 1), 1); // total number of combinations of the arrays

  for (let i = 0; i < total; i++) {
    const combination: DesagResult = {};
    for (let j = 0; j < keys.length; j++) {
      combination[keys[j]] =
        values[j] && values[j]!.length > 0 ? values[j]![i % values[j]!.length] : null;
    } // add the combination to the result
    result.push(combination);
  }
  return result; // return the result
}
