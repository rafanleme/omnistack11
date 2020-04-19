const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('PROFILE', () => {
  let ongId = ''
  let qtdeIncidents = 3
  beforeAll(async (done) => {
    if (await connection.migrate.status() != 0) {
      await connection.migrate.rollback();
      await connection.migrate.latest();
    }
    let response = await request(app)
      .post('/ongs')
      .send({
        name: 'ADPA',
        email: 'contato@teste.com.br',
        whatsapp: '47000000000',
        city: 'Rio do Sul',
        uf: 'SP'
      });

    ongId = response.body.id

    for (i = 0; i < qtdeIncidents; i++) {
      await request(app)
        .post('/incidents')
        .set({ Authorization: ongId })
        .send({
          "title": "Cadelinha atropelada",
          "description": "Detalhes do caso",
          "value": 120
        });
    }
    done()
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to get a profile', async () => {
    let response = await request(app)
      .get('/profile')
      .set({ Authorization: ongId })
      .send();

    expect(response.ok).toBe(true)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body).toHaveLength(qtdeIncidents)

  })



})
