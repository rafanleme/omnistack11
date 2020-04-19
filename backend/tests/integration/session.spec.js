const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('SESSION', () => {
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

  it('should be able to create a new session', async () => {
    const name = 'ADPA'

    let response = await request(app)
      .post('/ongs')
      .send({
        name: name,
        email: 'contato@teste.com.br',
        whatsapp: '47000000000',
        city: 'Rio do Sul',
        uf: 'SP'
      });

    const ongId = response.body.id

    response = await request(app)
      .post('/sessions')
      .send({
        id: ongId
      });

    expect(response.ok).toBe(true)
    expect(response.body).toHaveProperty('name');
    expect(response.body.name).toEqual(name)

    response = await request(app)
      .post('/sessions')
      .send({
        id: 'xxxx'
      });
      
    expect(response.ok).not.toBe(true)

  })
})
