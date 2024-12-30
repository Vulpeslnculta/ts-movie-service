import jwt from 'jsonwebtoken';

const token = jwt.sign({ foo: 'bar' }, 'shhhhh', { algorithm: 'HS256' });
console.log(token);
const decoded = jwt.verify(token, 'shhhhh', { algorithms: ['HS256'] });
console.log(decoded);