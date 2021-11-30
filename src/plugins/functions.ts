// HTML記号のエスケープ処理
export function escape_html(str: string): string {
  const map = {
    "&": "&amp;",
    "'": "&#x27;",
    "`": "&#x60;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;",
  };

  let res = str;
  for (const [key, value] of Object.entries(map)) {
    const reg = new RegExp(key, "gm");
    res = res.replace(reg, value);
  }
  return res;
}
