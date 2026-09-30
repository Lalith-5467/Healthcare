async function getShorts(query) {
  const r = await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(query));
  const t = await r.text();
  const matches = [...new Set([...t.matchAll(/\"videoId\":\"([a-zA-Z0-9_-]{11})\"/g)].map(m => m[1]))];
  return matches.slice(0, 3);
}

async function run() {
  const water = await getShorts('shorts benefits of drinking water daily');
  const sleep = await getShorts('shorts healthy sleep tips');
  const exercise = await getShorts('shorts morning exercise routine');
  const food = await getShorts('shorts healthy food diet nutrition');
  
  console.log('Water:', water);
  console.log('Sleep:', sleep);
  console.log('Exercise:', exercise);
  console.log('Food:', food);
}
run();
