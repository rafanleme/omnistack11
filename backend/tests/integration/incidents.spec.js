const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('SESSION', () => {
  let ongId = ''
  let incidentId = ''
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
    done()
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to create a new incident', async () => {
    let response = await request(app)
      .post('/incidents')
      .set({ Authorization: ongId })
      .send({
        "title": "Cadelinha atropelada",
        "description": "Detalhes do caso",
        "value": 120
      });

    expect(response.ok).toBe(true)
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toEqual(expect.any(Number))

    incidentId = response.body.id
  })

  it('should be able to list a incident', async () => {
    let response = await request(app)
      .get('/incidents')
      .send();

    expect(response.ok).toBe(true)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should be able to delete a incident', async () => {
    let response = await request(app)
      .delete('/incidents/' + incidentId)
      .set({ Authorization: ongId })
      .send();

    expect(response.ok).toBe(true)
  })

})
