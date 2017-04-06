export default str => str
    .replace(/[^A-Za-z0-9 !@%\*\-_]/g, "")
    .replace(/[ ]+/g, " ")
    .trim()
    .replace(/[ ]/g, "-")
    .toLowerCase();