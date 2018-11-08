import {Sdk, SdkConfig} from './types';
import request from './request';

export * from './constants';

const DEFAULT_BASE_URL = 'https://www.eventbrite.com';
const DEFAULT_API_URL = 'https://www.eventbriteapi.com/v3';

const eventbrite = ({
    baseUrl = DEFAULT_BASE_URL,
    baseApiUrl = DEFAULT_API_URL,
    token,
}: SdkConfig = {}): Sdk => {
    if (typeof window !== 'undefined') {
        const hash = window.location.hash
            .slice(1)
            .split('&')
            .map((v) => v.split('='))
            .reduce((pre, [key, value]) => ({...pre, [key]: value}), {
                access_token: '',
            });

        if (hash.access_token) {
            token = hash.access_token;
        }
    }

    return {
        authorize: (client_id) => {
            if (typeof window !== 'undefined') {
                window.location.href = `${baseUrl}/oauth/authorize?response_type=token&client_id=${client_id}`;
            }
        },
        request: (endpoint, options = {}) => {
            const url = `${baseApiUrl}${endpoint}`;
            let requestOptions = options;

            if (token) {
                requestOptions = {
                    ...requestOptions,
                    headers: {
                        ...(requestOptions.headers || {}),
                        Authorization: `Bearer ${token}`,
                    },
                };
            }

            return request(url, requestOptions);
        },
    };
};

export default eventbrite;
