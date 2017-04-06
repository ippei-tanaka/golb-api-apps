import bcrypt from 'bcrypt';

export default (plainString, hashedString) => new Promise((resolve, reject) =>
{
    bcrypt.compare(plainString, hashedString, (error, isMatch) =>
    {
        if (error) return reject(error);
        resolve(isMatch);
    });
});