import 'module-alias/register';

import { AuthClient } from '@auth/auth-client';


const PORT = process.env["PORT"] || "8080";

const authClient = new AuthClient(PORT);
authClient.start();
