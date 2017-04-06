const resolve = (base, ...args) =>
{
    base = base.replace(/^\s+/, "");

    const isAbsolute = base[0] === "/";

    let paths = base.split('/');

    for (const arg of args)
    {
        paths = paths.concat(arg.split('/'));
    }

    const _paths = [];

    for (let path of paths)
    {
        path = path.replace(/^\s+/, "").replace(/\s+$/, "");

        if (path === "" || path === ".")
        {
            continue;
        }

        _paths.push(path);
    }

    return (isAbsolute ? '/' : '') +_paths.join('/');
};

export default Object.freeze({resolve});