import 'module-alias/register';

import { ApiClient } from '@api/api-client';


const PORT = process.env["PORT"] || "3030";

const apiClient = new ApiClient(PORT);
apiClient.start();
