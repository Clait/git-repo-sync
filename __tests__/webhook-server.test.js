const request = require('supertest');
const app = require('../webhook-server'); // Assuming app is exported in webhook-server.js

jest.mock('child_process'); // Mocking child_process for git commands
jest.mock('axios'); // Mocking axios for external API calls

describe('Webhook Receiver', () => {
    it('should sync the repository when a valid webhook is received', async () => {
        const mockRepo = {
            repository: {
                name: 'test-repo',
                links: {
                    clone: [{ href: 'https://bitbucket.org/test-repo.git' }]
                }
            }
        };

        // Simulate the response from the Bitbucket webhook
        const response = await request(app)
            .post('/webhook')
            .send(mockRepo)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Repository synced successfully!');
    });

    it('should handle missing repository data gracefully', async () => {
        const invalidWebhook = {};

        const response = await request(app)
            .post('/webhook')
            .send(invalidWebhook)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});
