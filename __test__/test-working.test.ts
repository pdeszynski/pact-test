import { Matchers, MatchersV3, TemplateQuery } from '@pact-foundation/pact';
import { HTTPMethods } from '@pact-foundation/pact/src/common/request';
import { pactWith } from 'jest-pact/dist/v3';
import axios from 'axios';
import qs from 'querystring';

pactWith({ consumer: 'Test', provider: 'Test' }, (interaction) => {
  interaction('Test', ({ provider, execute }) => {
    const request = {
      ids: Matchers.term({ matcher: '.*', generate: 'id' }),
    };

    const response = [{ example: 'response' }];

    beforeEach(() => {
      return provider
        .uponReceiving('test request')
        .given('test given')
        .withRequest({
          method: HTTPMethods.GET,
          path: '/expected/url',
          query: request,
        })
        .willRespondWith({
          status: 200,
          body: response,
        });
    });

    execute('it will work', async (mockserver) => {
      const result = await axios.get(mockserver.url + '/expected/url', {
        params: {
          ids: ['id'],
        },
        paramsSerializer: {
          serialize: (params: any) => qs.stringify(params),
        },
      });

      expect(result.status).toEqual(200);
    });
  });
});
