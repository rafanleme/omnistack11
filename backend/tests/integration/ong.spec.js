const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('ONG', () => {
  beforeAll(async (done) => {
    if (await connection.migrate.status() != 0) {
      await connection.migrate.rollback();
      await connection.migrate.latest();
    }
    done()
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to create a new ong', async () => {
    const response = await request(app)
      .post('/ongs')
      .send({
        name: 'ADPA',
        email: 'contato@teste.com.br',
        whatsapp: '47000000000',
        city: 'Rio do Sul',
        uf: 'SP'
      });

    expect(response.body).toHaveProperty('id')
    expect(response.body.id).toHaveLength(8)
  })

  it('should be able to list ongs', async () => {
    const response = await request(app)
      .get('/ongs')
      .send();

    expect(response.ok).toBe(true)
    expect(Array.isArray(response.body)).toBe(true)
  })
})
