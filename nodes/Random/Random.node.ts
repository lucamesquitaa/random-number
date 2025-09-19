import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import type { IHttpRequestOptions } from 'n8n-workflow';

export class Random implements INodeType {
    
	description: INodeTypeDescription = {
		displayName: 'Random',
        name: 'random',
        icon: 'file:random.svg',
        group: ['transform'],
        version: 1,
        description: 'Generate random numbers',
        defaults: {
            name: 'Random',
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
		properties: [
			{
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                options: [
                    {
                        name: 'Generate',
                        value: 'generate',
                    },
                ],
                default: 'generate',    
                noDataExpression: true,         
                required: true,
                description: 'Generate a random number',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: [
                            'generate',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Random',
                        value: 'random',
                        description: 'Generate a random number',
                        action: 'Generate a random number',
                    },
                ],
                default: 'random',
                noDataExpression: true,
            },
            {
                displayName: 'Min',
                name: 'min',
                type: 'number',
                required: true,
                displayOptions: {
                    show: {
                        operation: [
                            'random',
                        ],
                        resource: [
                            'generate',
                        ],
                    },
                },
                default:'',
                placeholder: '0',
                description:'Minimum value for the random number',
            },
            {
                displayName: 'Max',
                name: 'max',
                type: 'number',
                required: true,
                displayOptions: {
                    show: {
                        operation: [
                            'random',
                        ],
                        resource: [
                            'generate'
                        ],
                    },
                },
                default:'',
                placeholder: '100',
                description:'Maximum value for the random number'
            }
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // Handle data coming from previous nodes
        const items = this.getInputData();
        let responseData;
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        // For each item, make an API call to create a contact
        for (let i = 0; i < items.length; i++) {
            if (resource === 'generate') {
                if (operation === 'random') {
                    // Get email input
                    const min = this.getNodeParameter('min', i) as number;
                    const max = this.getNodeParameter('max', i) as number;

                    if (min >= max) {
                        throw new Error('O valor de Min deve ser menor que Max.');
                    }

                    // Make an API call to Random.org
                    const options: IHttpRequestOptions = {
                        headers: {
                            'Accept': 'text/plain',
                        },
                        method: 'GET',
                        url: `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`,
                        json: false, // Não é JSON, é texto plano
                    };
                    responseData = await this.helpers.httpRequest(options);
                    
                    
                    returnData.push({responseData});
                }
            }
        }
        // Map data to n8n data structure
        return [this.helpers.returnJsonArray(returnData)];
	}
}