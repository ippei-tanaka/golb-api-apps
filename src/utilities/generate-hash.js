import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

export default (str) => new Promise((resolve, reject) =>
{
    bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) =>
    {
        if (error) return reject(error);

        bcrypt.hash(str, salt, (error, hash) =>
        {
            if (error) return reject(error);
            resolve(hash);
        });
    });
});