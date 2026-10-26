import fs from 'fs/promises';
import path from 'path';

export const logger = async(req, res, next)  => {
    const filePath = path.join(__appdir, './log/app.log');
   const message = `${req.method} ${req.originalUrl} - 
   ${new Date ().toLocaleTimeString(
    'sv-SE'
   )}`;
   
   console.log(message);

   await fs.appendFile(filePath, message + '\n');
   next();
};