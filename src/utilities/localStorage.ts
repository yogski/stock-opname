export function saveInventory(data : any[]) {
  let d = new Date();
  let key : any;
  if (getKey()) {
    key = getKey();
  } else {
    key = Number(d).toString(16);
    localStorage.setItem('keymaster',key);
  }
  localStorage.setItem(key, JSON.stringify(data));
}

export function getInventory() {
  const key = getKey();
  const data = localStorage.getItem(`${key}`) || '';
  return JSON.parse(data);
}

function getKey() {
  return localStorage.getItem('keymaster');
}

export function clearInventory() {
  localStorage.clear();
}