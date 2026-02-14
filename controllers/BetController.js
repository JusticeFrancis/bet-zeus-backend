const axios = require("axios");
const BASE_URL = "https://api.the-odds-api.com/v4";


// SportMonks API key
const SPORTMONKS_API_KEY = process.env.SPORTMONKS_API_KEY;

// Utility: check if a date is today (UTC)
function isTodayUTC(dateString) {
  const eventDate = new Date(dateString);
  const now = new Date();
  return (
    eventDate.getUTCFullYear() === now.getUTCFullYear() &&
    eventDate.getUTCMonth() === now.getUTCMonth() &&
    eventDate.getUTCDate() === now.getUTCDate()
  );
}

// Helper: check last 5 H2H games over 1.5 goals
function last5Over15(h2hGames) {
  const allOver2 = h2hGames.matches.every((game) => game.totalGoals >= 2);

  console.log("yeta", h2hGames.matches.length === 5 && allOver2);

  return h2hGames.matches.length === 5 && allOver2;
}

// Helper to sanitize input
function sanitizeTeamName(name) {
  // Normalize Unicode characters to compatible form
  let normalized = name.normalize("NFKD");

  // Replace non-ASCII characters with closest equivalents or remove
  normalized = normalized.replace(/[^\x00-\x7F]/g, ""); // removes anything > 127

  return normalized;
}
async function findTeam(input) {
  const safeInput = sanitizeTeamName(input);
  const url = `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(
    safeInput
  )}`;
  const headers = {
    "x-rapidapi-host": "football.api-sports.io",
    "x-rapidapi-key": process.env.API_FOOTBALL_KEY,
  };

  const res = await fetch(url, { headers });
  const data = await res.json();

  if (!data.response || data.response.length === 0) {
    return null;
  }

  return data.response.map((r) => ({
    id: r.team.id,
    name: r.team.name,
    code: r.team.code,
    country: r.team.country,
    logo: r.team.logo,
  }));
}

const BASE_URL_ =
  "https://raw.githubusercontent.com/openfootball/football.json/master";

/**
 * Fetch JSON safely
 */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url}`);
  return res.json();
}

/**
 * Get list of all JSON files in the repo
 * Uses GitHub API
 */
async function getAllJsonFiles() {
  const apiUrl =
    "https://api.github.com/repos/openfootball/football.json/contents";

  const files = await fetchJSON(
    [
      {
        "name": "2010-11",
        "path": "2010-11",
        "sha": "932d8950c8c189b7a4a22e3252175b899d322b75",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2010-11?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2010-11",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/932d8950c8c189b7a4a22e3252175b899d322b75",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2010-11?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/932d8950c8c189b7a4a22e3252175b899d322b75",
          "html": "https://github.com/openfootball/football.json/tree/master/2010-11"
        }
      },
      {
        "name": "2011-12",
        "path": "2011-12",
        "sha": "b5b5c18ea98b4c5ce44b7915b34556ec42fb1451",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2011-12?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2011-12",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/b5b5c18ea98b4c5ce44b7915b34556ec42fb1451",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2011-12?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/b5b5c18ea98b4c5ce44b7915b34556ec42fb1451",
          "html": "https://github.com/openfootball/football.json/tree/master/2011-12"
        }
      },
      {
        "name": "2012-13",
        "path": "2012-13",
        "sha": "2b8bf49b2926025cf10a6b282376c8563bf7c1bc",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2012-13?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2012-13",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/2b8bf49b2926025cf10a6b282376c8563bf7c1bc",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2012-13?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/2b8bf49b2926025cf10a6b282376c8563bf7c1bc",
          "html": "https://github.com/openfootball/football.json/tree/master/2012-13"
        }
      },
      {
        "name": "2013-14",
        "path": "2013-14",
        "sha": "ae50f1135ced1c35d0b88b7c8b3f93b525f12511",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2013-14?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2013-14",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/ae50f1135ced1c35d0b88b7c8b3f93b525f12511",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2013-14?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/ae50f1135ced1c35d0b88b7c8b3f93b525f12511",
          "html": "https://github.com/openfootball/football.json/tree/master/2013-14"
        }
      },
      {
        "name": "2014-15",
        "path": "2014-15",
        "sha": "83a8c4ee7b3dc6ab6fbb2944e4f37e25de1aac6e",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2014-15?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2014-15",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/83a8c4ee7b3dc6ab6fbb2944e4f37e25de1aac6e",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2014-15?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/83a8c4ee7b3dc6ab6fbb2944e4f37e25de1aac6e",
          "html": "https://github.com/openfootball/football.json/tree/master/2014-15"
        }
      },
      {
        "name": "2015-16",
        "path": "2015-16",
        "sha": "3df1d987f47803409b67fac503d30bc2552c0955",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2015-16?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2015-16",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/3df1d987f47803409b67fac503d30bc2552c0955",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2015-16?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/3df1d987f47803409b67fac503d30bc2552c0955",
          "html": "https://github.com/openfootball/football.json/tree/master/2015-16"
        }
      },
      {
        "name": "2016-17",
        "path": "2016-17",
        "sha": "6d46fdcf2e9fcec20ea02638d71cb40b82e5dfab",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2016-17?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2016-17",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/6d46fdcf2e9fcec20ea02638d71cb40b82e5dfab",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2016-17?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/6d46fdcf2e9fcec20ea02638d71cb40b82e5dfab",
          "html": "https://github.com/openfootball/football.json/tree/master/2016-17"
        }
      },
      {
        "name": "2017-18",
        "path": "2017-18",
        "sha": "de588e1914c019f2aacc55bcc25ded76dab549f7",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2017-18?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2017-18",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/de588e1914c019f2aacc55bcc25ded76dab549f7",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2017-18?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/de588e1914c019f2aacc55bcc25ded76dab549f7",
          "html": "https://github.com/openfootball/football.json/tree/master/2017-18"
        }
      },
      {
        "name": "2018-19",
        "path": "2018-19",
        "sha": "625fdf8044b06a80227840fd7a70cd097007cd00",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2018-19?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2018-19",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/625fdf8044b06a80227840fd7a70cd097007cd00",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2018-19?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/625fdf8044b06a80227840fd7a70cd097007cd00",
          "html": "https://github.com/openfootball/football.json/tree/master/2018-19"
        }
      },
      {
        "name": "2019-20",
        "path": "2019-20",
        "sha": "7c973fe5028a978c2f8e9733e0114be771355e23",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2019-20?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2019-20",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/7c973fe5028a978c2f8e9733e0114be771355e23",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2019-20?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/7c973fe5028a978c2f8e9733e0114be771355e23",
          "html": "https://github.com/openfootball/football.json/tree/master/2019-20"
        }
      },
      {
        "name": "2019",
        "path": "2019",
        "sha": "efd684afcacdaba46da499d907bdc5948f7e86c2",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2019?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2019",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/efd684afcacdaba46da499d907bdc5948f7e86c2",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2019?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/efd684afcacdaba46da499d907bdc5948f7e86c2",
          "html": "https://github.com/openfootball/football.json/tree/master/2019"
        }
      },
      {
        "name": "2020-21",
        "path": "2020-21",
        "sha": "45dba59628e9cc60226414c3fc323f0432c6255e",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2020-21?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2020-21",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/45dba59628e9cc60226414c3fc323f0432c6255e",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2020-21?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/45dba59628e9cc60226414c3fc323f0432c6255e",
          "html": "https://github.com/openfootball/football.json/tree/master/2020-21"
        }
      },
      {
        "name": "2020",
        "path": "2020",
        "sha": "a66e5cc347ff594a7a9e29af673413aa03eff790",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2020?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2020",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/a66e5cc347ff594a7a9e29af673413aa03eff790",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2020?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/a66e5cc347ff594a7a9e29af673413aa03eff790",
          "html": "https://github.com/openfootball/football.json/tree/master/2020"
        }
      },
      {
        "name": "2021-22",
        "path": "2021-22",
        "sha": "854152b248071a369a797b00145056f996731c86",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2021-22?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2021-22",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/854152b248071a369a797b00145056f996731c86",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2021-22?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/854152b248071a369a797b00145056f996731c86",
          "html": "https://github.com/openfootball/football.json/tree/master/2021-22"
        }
      },
      {
        "name": "2022-23",
        "path": "2022-23",
        "sha": "7a8ca273ab0354226cb8359a40e010b07598332e",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2022-23?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2022-23",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/7a8ca273ab0354226cb8359a40e010b07598332e",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2022-23?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/7a8ca273ab0354226cb8359a40e010b07598332e",
          "html": "https://github.com/openfootball/football.json/tree/master/2022-23"
        }
      },
      {
        "name": "2023-24",
        "path": "2023-24",
        "sha": "5130feadabac9169d4c6669a6aba431ddffb2c1b",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2023-24?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2023-24",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/5130feadabac9169d4c6669a6aba431ddffb2c1b",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2023-24?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/5130feadabac9169d4c6669a6aba431ddffb2c1b",
          "html": "https://github.com/openfootball/football.json/tree/master/2023-24"
        }
      },
      {
        "name": "2024-25",
        "path": "2024-25",
        "sha": "6d25c747c3520be644f24dcec7ea8e3eae08390c",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2024-25?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2024-25",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/6d25c747c3520be644f24dcec7ea8e3eae08390c",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2024-25?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/6d25c747c3520be644f24dcec7ea8e3eae08390c",
          "html": "https://github.com/openfootball/football.json/tree/master/2024-25"
        }
      },
      {
        "name": "2025-26",
        "path": "2025-26",
        "sha": "733a6d97799c141c06147b018e1a500fd30d2d78",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2025-26?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2025-26",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/733a6d97799c141c06147b018e1a500fd30d2d78",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2025-26?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/733a6d97799c141c06147b018e1a500fd30d2d78",
          "html": "https://github.com/openfootball/football.json/tree/master/2025-26"
        }
      },
      {
        "name": "2025",
        "path": "2025",
        "sha": "f05e6bfbc0ce4f901216b6b076dac049f9f24b35",
        "size": 0,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/2025?ref=master",
        "html_url": "https://github.com/openfootball/football.json/tree/master/2025",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/trees/f05e6bfbc0ce4f901216b6b076dac049f9f24b35",
        "download_url": null,
        "type": "dir",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/2025?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/trees/f05e6bfbc0ce4f901216b6b076dac049f9f24b35",
          "html": "https://github.com/openfootball/football.json/tree/master/2025"
        }
      },
      {
        "name": "LICENSE.md",
        "path": "LICENSE.md",
        "sha": "670154e3538863b2d9891fd5483160fbdfc89164",
        "size": 6555,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/LICENSE.md?ref=master",
        "html_url": "https://github.com/openfootball/football.json/blob/master/LICENSE.md",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/blobs/670154e3538863b2d9891fd5483160fbdfc89164",
        "download_url": "https://raw.githubusercontent.com/openfootball/football.json/master/LICENSE.md",
        "type": "file",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/LICENSE.md?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/blobs/670154e3538863b2d9891fd5483160fbdfc89164",
          "html": "https://github.com/openfootball/football.json/blob/master/LICENSE.md"
        }
      },
      {
        "name": "README.md",
        "path": "README.md",
        "sha": "3bf61cf4a15b87d1a68e3f4121ea08c5990041f7",
        "size": 5371,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/README.md?ref=master",
        "html_url": "https://github.com/openfootball/football.json/blob/master/README.md",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/blobs/3bf61cf4a15b87d1a68e3f4121ea08c5990041f7",
        "download_url": "https://raw.githubusercontent.com/openfootball/football.json/master/README.md",
        "type": "file",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/README.md?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/blobs/3bf61cf4a15b87d1a68e3f4121ea08c5990041f7",
          "html": "https://github.com/openfootball/football.json/blob/master/README.md"
        }
      },
      {
        "name": "package.json",
        "path": "package.json",
        "sha": "9f1ebcedb6620f6ea4139782e81c3f8f45340a98",
        "size": 689,
        "url": "https://api.github.com/repos/openfootball/football.json/contents/package.json?ref=master",
        "html_url": "https://github.com/openfootball/football.json/blob/master/package.json",
        "git_url": "https://api.github.com/repos/openfootball/football.json/git/blobs/9f1ebcedb6620f6ea4139782e81c3f8f45340a98",
        "download_url": "https://raw.githubusercontent.com/openfootball/football.json/master/package.json",
        "type": "file",
        "_links": {
          "self": "https://api.github.com/repos/openfootball/football.json/contents/package.json?ref=master",
          "git": "https://api.github.com/repos/openfootball/football.json/git/blobs/9f1ebcedb6620f6ea4139782e81c3f8f45340a98",
          "html": "https://github.com/openfootball/football.json/blob/master/package.json"
        }
      }
    ]
  );

  return files;
}

/**
 * Normalize team names (VERY IMPORTANT)
 */
function normalize(name) {
  return name.toLowerCase().trim();
}

// Helper: normalize name (lowercase + remove non-alphanumeric)
function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Helper: create flexible regex from input
function createFuzzyPattern(name) {
  const normalized = normalizeName(name);
  const patternStr = normalized.split("").join(".*"); // letters in sequence
  return new RegExp(patternStr, "i");
}

// Helper: check if two names match fuzzily
function fuzzyMatch(input, target) {
  const pattern = createFuzzyPattern(input);
  const normalizedTarget = normalizeName(target);
  return pattern.test(normalizedTarget);
}

async function getHeadToHead(teamA, teamB, league) {
  const allMatches = [];
  const files = await getAllJsonFiles();

  for (const file of files) {
    try {
      const seasonData = await fetchJSON(
        `${BASE_URL_}/${file.name}/${league}.json`
      );

      const matches = seasonData.matches || [];

      for (const match of matches) {
        // 🔹 Fuzzy match instead of strict normalization
        const t1 = match.team1;
        const t2 = match.team2;

        const isH2H =
          (fuzzyMatch(teamA, t1) && fuzzyMatch(teamB, t2)) ||
          (fuzzyMatch(teamA, t2) && fuzzyMatch(teamB, t1));

        if (!isH2H) continue;
        if (!match.score || !match.score.ft || !match.date) continue;

        allMatches.push({
          date: match.date,
          team1: match.team1,
          team2: match.team2,
          t1,
          t2,
          g1: match.score.ft[0],
          g2: match.score.ft[1],
          season: seasonData.name || file.name,
        });
      }
    } catch {
      continue;
    }
  }

  // Sort by most recent
  allMatches.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Last 5 H2H
  const last5 = allMatches.slice(0, 5);

  const stats = {
    teamA,
    teamB,
    played: last5.length,
    teamAWins: 0,
    teamBWins: 0,
    draws: 0,
    goalsA: 0,
    goalsB: 0,
    totalGoals: 0,
    over2goals: false,
    matches: [],
  };

  // 🔹 STRICT over-2-goals check
  let allOver2 = last5.length === 5;

  for (const m of last5) {
    const matchTotalGoals = m.g1 + m.g2;
    stats.totalGoals += matchTotalGoals;

    if (matchTotalGoals < 2) allOver2 = false;

    // Determine orientation
    const isTeamAHome = fuzzyMatch(teamA, m.t1);
    const goalsA = isTeamAHome ? m.g1 : m.g2;
    const goalsB = isTeamAHome ? m.g2 : m.g1;

    stats.goalsA += goalsA;
    stats.goalsB += goalsB;

    if (goalsA > goalsB) stats.teamAWins++;
    else if (goalsB > goalsA) stats.teamBWins++;
    else stats.draws++;

    stats.matches.push({
      season: m.season,
      date: m.date,
      team1: m.team1,
      team2: m.team2,
      score: `${m.g1}-${m.g2}`,
      totalGoals: matchTotalGoals,
      over2goals: matchTotalGoals >= 2,
    });
  }

  // 🔹 FINAL FLAG
  stats.over2goals = allOver2;

  return stats;
}

async function getTeamId(teamName, leagueId, season) {
  const res = await axios.get(`https://v3.football.api-sports.io/teams`, {
    params: { search: teamName, league: leagueId, season },
    headers: {
      "x-rapidapi-host": "football.api-sports.io",
      "x-rapidapi-key": process.env.API_FOOTBALL_KEY,
    },
  });
  return res.data.response[0]?.team?.id ?? null;
}

// Main function to analyze match odds

// Helper to fetch live matches from Live Score API
async function fetchLiveScores() {
  try {
    const res = await axios.get(
      `https://livescore-api.com/api-client/matches/live.json`,
      {
        params: {
          key: process.env.LIVESCORE_API_KEY,
          secret: process.env.LIVESCORE_API_SECRET,
        },
      }
    );
    return res.data.data.match || [];
  } catch (err) {
    console.error("Live Score API error:", err.response?.data || err.message);
    return [];
  }
}

async function analyzeMatchOdds(
  sportKey = "soccer_spain_la_liga",
  league = "es.1"
) {
  try {
    const regions = "uk,eu";
    const markets = "h2h,totals";

    // Fetch odds from Odds API
    const oddsResponse = await axios.get(
      `${BASE_URL}/sports/${sportKey}/odds/`,
      {
        params: {
          apiKey: process.env.API_KEY,
          regions,
          markets,
          oddsFormat: "decimal",
          dateFormat: "iso",
        },
      }
    );

    const allGames = oddsResponse.data || [];
    const todaysGames = allGames.filter((game) =>
      isTodayUTC(game.commence_time)
    );

    if (!todaysGames.length) {
      return { message: "No matches today" };
    }

    const now = new Date();

    // Fetch live scores from Live Score API once
    const liveMatches = await fetchLiveScores();

    const analysisResults = await Promise.all(
      todaysGames.map(async (match) => {
        const home_team = match.home_team;
        const away_team = match.away_team;

        // H2H last 5 games
        const h2h_last_5_games = await getHeadToHead(
          home_team,
          away_team,
          league
        );

        // Try to find live match in Live Score API
        const liveMatch = liveMatches.find(
          (lm) =>
            lm.home.name.toLowerCase() === home_team.toLowerCase() &&
            lm.away.name.toLowerCase() === away_team.toLowerCase()
        );

        let matchMinute = 0;
        let ismatch_live = false;
        let home_team_score = 0;
        let away_team_score = 0;

        if (liveMatch) {
          // Parse minute if numeric
          const timeStr = liveMatch.time;
          console.log(liveMatch);
          matchMinute = liveMatch.time;

          // Live only if "IN PLAY"
          ismatch_live = liveMatch.status === "IN PLAY";

          // Parse score
          const [h, a] = liveMatch.scores.score
            .split("-")
            .map((s) => parseInt(s.trim(), 10));
          home_team_score = h ?? 0;
          away_team_score = a ?? 0;
        }

        // Odds logic
        const totalsMarket = match.bookmakers?.[0]?.markets?.find(
          (m) => m.key === "totals"
        );

        const over05 = totalsMarket?.outcomes?.find(
          (o) => o.name.toLowerCase().includes("over") && o.price >= 0.6
        );

        const goals_odd = over05?.price ?? null;

        const isGoalless = home_team_score + away_team_score === 0;
        const over05LowOdds = goals_odd !== null && goals_odd <= 1.5;

        const h2hOver15 = last5Over15(h2h_last_5_games);

        const alert =
          ismatch_live &&
          matchMinute >= 30 &&
          matchMinute <= 50 &&
          isGoalless &&
          // over05LowOdds &&
          h2hOver15;

        return {
          match: `${home_team} vs ${away_team}`,
          commence_time: match.commence_time,
          ismatch_live,
          matchMinute,
          home_team,
          away_team,
          home_team_score,
          away_team_score,
          goals_odd,
          h2h_last_5_games,
          alert,
        };
      })
    );

    return {
      total_matches: analysisResults.length,
      matches: analysisResults,
    };
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return { error: error.message };
  }
}

async function test(req, res) {
  console.log('hi')
  const result_laliga = await analyzeMatchOdds("soccer_spain_la_liga", "es.1");
  const result_pl = await analyzeMatchOdds("soccer_epl", "en.1");

  console.log(result_pl);

  if(Array.isArray(result_laliga.matches)) {
    for (const m of result_laliga.matches) {
      // if (!m.alert) continue;
  
      const message = `
      <b>🚨 LIVE BET ALERT</b>
      
      <b>${m.match}</b>
      ⏱ Minute: <b>${m.matchMinute}'</b>
      ⚽ Score: <b>${m.home_team_score}-${m.away_team_score}</b>
      
      <b>📊 Head-to-Head (Last 5)</b>
      • Played: ${m.h2h_last_5_games.played}
      • ${m.home_team} Wins: ${m.h2h_last_5_games.teamAWins}
      • ${m.away_team} Wins: ${m.h2h_last_5_games.teamBWins}
      • Draws: ${m.h2h_last_5_games.draws}
      • Total Goals: ${m.h2h_last_5_games.totalGoals}
      • Over 1.5 Goals: ${m.h2h_last_5_games.over2goals ? "✅ YES" : "❌ NO"}
      
      <b>💰 Market</b>
      • Over 0.5 Goals Odds: <b>${m.goals_odd ?? "N/A"}</b>
      
      <b>📡 Status</b>
      • Live: ${m.ismatch_live ? "✅ Yes" : "❌ No"}
      
      <b>⚠️ Insight</b>
      High probability of at least two goals before FT.
      `;
  
     await sendTelegramAlert(message);
    }
  }

  if(Array.isArray(result_pl.matches)) {
  for (const m of result_pl.matches) {
    // if (!m.alert) continue;

    const message = `
    <b>🚨 LIVE BET ALERT</b>
    
    <b>${m.match}</b>
    ⏱ Minute: <b>${m.matchMinute}'</b>
    ⚽ Score: <b>${m.home_team_score}-${m.away_team_score}</b>
    
    <b>📊 Head-to-Head (Last 5)</b>
    • Played: ${m.h2h_last_5_games.played}
    • ${m.home_team} Wins: ${m.h2h_last_5_games.teamAWins}
    • ${m.away_team} Wins: ${m.h2h_last_5_games.teamBWins}
    • Draws: ${m.h2h_last_5_games.draws}
    • Total Goals: ${m.h2h_last_5_games.totalGoals}
    • Over 1.5 Goals: ${m.h2h_last_5_games.over2goals ? "✅ YES" : "❌ NO"}
    
    <b>💰 Market</b>
    • Over 0.5 Goals Odds: <b>${m.goals_odd ?? "N/A"}</b>
    
    <b>📡 Status</b>
    • Live: ${m.ismatch_live ? "✅ Yes" : "❌ No"}
    
    <b>⚠️ Insight</b>
    High probability of at least two goals before FT.
    `;

    await sendTelegramAlert(message);
  }
}

  return res.json({
    laliga: result_laliga,
    premier_league: result_pl,
  });
}

async function sendTelegramAlert(message) {
  const url = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;

  await axios.post(url, {
    chat_id: process.env.TG_CHAT_ID,
    text: message,
    parse_mode: "HTML",
  });
}












module.exports = { test };
