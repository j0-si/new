// migrate links from old j0.si system

import { createLink, idRegex, removeLink, validateLinks } from "./src/utils/link";
import { checkIdAvailability, getLink } from "./src/utils/link";
import readline from "node:readline/promises";

interface OldLink {
  url: string;
  path: string;
}

async function main() {
  const rl = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout 
  });

  const stats = { imported: 0, skipped: 0 }
  const linksPath: string = await rl.question("Please paste the absolute path of links.json: ") || "";

  if (!linksPath) {
    console.log("File path not provided. stopping")
    rl.close()
    return;
  }

  const linksJson = Bun.file(linksPath);
  if (!await linksJson.exists()) {
    console.log("File doesn't exist. stopping");
    rl.close()
    return
  }

  validateLinks()

  const links: OldLink[] = await linksJson.json();
  
  let replaceAll: boolean = false;
  for (let link of links) {
    const url = link.url;
    const id = decodeURIComponent(link.path);

    if (!idRegex.test(id)) {
      console.log(`URL: ${url}\nID: ${id}`)
      console.log("Link ID is invalid. skipping")
      continue;
    }

    const isLinkIdAvailable = await checkIdAvailability(id, true);

    if (!isLinkIdAvailable) {
      const existing = await getLink(id);

      if (!replaceAll) {
        console.log(`Existing:\n\tURL: ${existing!.url}\n\tID: ${existing!.id}`)
        console.log(`Imported:\n\tURL: ${url}\n\tID: ${id}`)

        const response = await rl.question("Link ID is already used. replace? (y = Yes, n = No, a = ALL): ") || "";

        if (response.toLowerCase() === "n") continue;
        if (response.toLowerCase() === "a") replaceAll = true;
        if (!["y", "n", "a"].includes(response.toLowerCase())) {
          console.log("Invalid response. skipping")
          stats.skipped++
          continue
        }

        await removeLink(existing!.id);
      } else {
        await removeLink(existing!.id);
      }
    }


    const created = await createLink({ id, url })

    if (created.error) {
      console.log(`URL: ${url}\nID: ${id}`)
      console.log("Link creation failed: " + created.error)
      continue
    }
    
    stats.imported++
    console.log(`Link created: /${created.link?.id}`)
  }

  console.log(`${stats.imported} imported, ${stats.skipped} skipped.`)
  rl.close()
}

main();