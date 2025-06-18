import request from 'supertest';
import app from '../../app';

describe('Integração - Rotas de Tarefas', () => {
    let token: string;

    beforeAll(async () => {
        // Cria usuário de teste (ignora erro se já existir)
        await request(app)
            .post('/api/auth/register')
            .send({ name: 'jeni teste',email: 'teste@teste.com', password: '123456' });

        // Faz login e pega o token
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'teste@teste.com', password: '123456' });

        token = res.body.token;
    });

    it('deve criar uma tarefa via POST /api/tasks', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Tarefa integração',
                description: 'Descrição integração',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Tarefa integração');
    });

    it('deve listar tarefas do usuário via GET /api/tasks', async () => {
        const response = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});