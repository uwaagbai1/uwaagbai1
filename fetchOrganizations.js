const fetch = require("node-fetch");
const fs = require("fs");

const githubToken = process.env.TOKEN;
const username = "uwaagbai1";

const query = `
  query {
    viewer {
      organizations(first: 5) {
        nodes {
          name
          url
        }
      }
    }
  }
`;

const apiUrl = "https://api.github.com/graphql";

const headers = {
  Authorization: `Bearer ${githubToken}`,
  "Content-Type": "application/json",
};

const options = {
  method: "POST",
  headers,
  body: JSON.stringify({ query }),
};

async function fetchOrganizations() {
  try {
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    const organizations = data.data.viewer.organizations.nodes;

    const badges = organizations
      .map(
        (org) => `- [![${org.name}](${generateBadgeUrl(org.name)})](${org.url})`
      )
      .join("\n");

    // Read README.md file
    let readmeContent = fs.readFileSync("README.md", "utf8");

    // Find and replace placeholder with badges
    readmeContent = readmeContent.replace(
      /<!-- ORGANIZATIONS-LIST:START -->([\s\S]*?)<!-- ORGANIZATIONS-LIST:END -->/gm,
      `<!-- ORGANIZATIONS-LIST:START -->\n${badges}\n<!-- ORGANIZATIONS-LIST:END -->`
    );

    // Write updated content back to README.md
    fs.writeFileSync("README.md", readmeContent, "utf8");
  } catch (error) {
    console.error("Error fetching organizations:", error.message);
  }
}

function generateBadgeUrl(orgName) {
  // Example URL, customize according to your badge generation method
  return `https://img.shields.io/badge/-${orgName}-blue?style=flat&logo=github`;
}

fetchOrganizations();
