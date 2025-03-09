import http from 'k6/http';
import { Rate } from 'k6/metrics'
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@9.5.1/+esm';

const vus = 100;
const duration = '120s';
const failureRate = new Rate('failure_rate');
export const options = {
    vus: vus,
    duration: duration,
    thresholds: {
        failure_rate: [
            { threshold: 'rate < 0.1', abortOnFail: true, delayAbortEval: '1m' },
        ],
    },
};

export default () => {
    const randomLink = {
        custom_url: faker.string.alphanumeric(6),
        link: faker.internet.url(),
    }
    const response = http.post(`http://localhost:3001/link`, JSON.stringify(randomLink), { headers: { 'Content-Type': 'application/json' } });
    if (response.status !== 201) {
        failureRate.add(1);
    }
}